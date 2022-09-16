use downloader::{Download, Downloader};
use reqwest::blocking::{Client};
use reqwest::Url;
use serde_json::Value;

use std::error::Error;
use std::fs::{create_dir_all};
use std::path::{PathBuf, Path};
use serde::{Serialize, Deserialize};
use crate::manga::{ MangaMeta, create_custom_meta, Format };
// use uuid::{uuid, Uuid};

use uuid::{Uuid};

// use self::self::;
// use crate::manga::create_custom_meta;

use tauri::window::Window;


struct DownloadChapter {
    uuid: String,
    chapter: String,
    index: usize,
    volume: String,
}

impl DownloadChapter {
    fn new(uuid: &str, chapter: &str, index: usize, volume: &str) -> DownloadChapter {
        DownloadChapter {
            uuid: uuid.to_string(),
            chapter: chapter.to_string(),
            index,
            volume: volume.to_string(),
        }
    }
}

struct DownloadChapters {
    chapters: Vec<DownloadChapter>,
    repeats: bool,
}

impl DownloadChapters {
    fn new(chapters: Vec<DownloadChapter>, repeats: bool) -> DownloadChapters {
        DownloadChapters {
            chapters,
            repeats,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct UpdateProgressPayload {
    uuid: String,
    progress: usize,
}

impl UpdateProgressPayload {
    fn new(uuid: String, progress: usize) -> UpdateProgressPayload {
        UpdateProgressPayload {
            uuid: uuid.to_string(),
            progress,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct StartDownloadingPayload {
    uuid: String,
    out_of: usize,
}

impl StartDownloadingPayload {
    fn new(uuid: String, out_of: usize) -> StartDownloadingPayload {
        StartDownloadingPayload {
            uuid: uuid.to_string(),
            out_of,
        }
    }
}

pub struct MangaDex {}

impl MangaDex {

    fn api_url() -> Url {
        Url::parse("https://api.mangadex.org/").unwrap()
    }

    fn client() -> Client { Client::new() }

    pub fn search(query: String, lang: String) -> Result<Value, Box<dyn Error>> {

        let client = MangaDex::client();

        let mut url: Url = MangaDex::api_url();
        url.set_path("manga");
        url.query_pairs_mut()
            .append_pair("title", query.as_str())
            .append_pair("includes[]", "cover_art")
            .append_pair("order[relevance]", "desc")
            .append_pair("availableTranslatedLanguage[]", lang.as_str())
            .append_pair("limit", "20")
            .append_pair("hasAvailableChapters", "true");
        
        let resp = client
            .get(url).send()?
            .json::<Value>()?;

        Ok(resp)

    }

    fn get_chapter_name(chapter: &DownloadChapter, repeats: bool) -> String {
        if chapter.chapter == "none" { return "One Shot".to_string(); }
        if repeats { return format!("Vol. {} Ch. {}", chapter.volume, chapter.chapter) }
        format!("Chapter {}", chapter.chapter)
    }

    fn download_chapter(manga_uuid: &str, chapter: DownloadChapter, repeats: bool, path: &PathBuf, window: &Window) -> Result<(), Box<dyn Error>> {

        // let uuid = chapter.uuid.clone();

        let mut path = PathBuf::from(&path);

        let chapter_name: String = MangaDex::get_chapter_name(&chapter, repeats);
        path.push(chapter_name);

        create_dir_all(&path)?;

        let at_home_data = MangaDex::get_chapter_athome_data(chapter.uuid.as_str())?;
        
        let base_url = at_home_data["baseUrl"].as_str().ok_or("Err")?;
        let hash = at_home_data["chapter"]["hash"].as_str().ok_or("Err")?;
        let data = at_home_data["chapter"]["data"].as_array().ok_or("Err")?;

        let downloads: Vec<Download> = data.iter().enumerate().map(|(index, image)| {
            let extension = image.as_str().unwrap().split(".").last().unwrap();
            let download = Download::new(format!("{}/data/{}/{}", &base_url, &hash, image.as_str().unwrap()).as_str());
            let download = download.file_name(Path::new(format!("./{}.{}", index.to_string(), extension).as_str()));
            download
        }).collect();
        
        let mut downloader = Downloader::builder()
            .download_folder(&path.as_path())
            .build()?;

        downloader.download(&downloads)?;

        window.emit(
            "update_download_progress", 
            UpdateProgressPayload::new(manga_uuid.to_string(), 
            chapter.index))?;

        Ok(())
    }

    fn download_cover(manga: &Value, path: &PathBuf) -> Result<(), Box<dyn Error>>{

        let cover_art = manga["data"]["relationships"]
            .as_array()
            .ok_or("Err")?
            .into_iter()
            .find(|item| item["type"] == "cover_art")
            .ok_or("Err")?;

        let manga_uuid = manga["data"]["id"].as_str().ok_or("Err")?;
        let file_name = cover_art["attributes"]["fileName"].as_str().ok_or("Err")?;
        let extension = &file_name.split(".").last().ok_or("Err")?;

        let mut url = Url::parse("https://uploads.mangadex.org/covers/")?;
        url.set_path(format!("covers/{}/{}", manga_uuid, file_name).as_str());

        let client = MangaDex::client();
        let image_bytes = client.get(url).send()?.bytes()?;

        let image = image::load_from_memory(&image_bytes)?;

        let mut path = PathBuf::from(&path);
        path.push("cover");
        path.set_extension(extension);

        image.save(&path)?;

        Ok(())
    }

    fn create_meta(manga: &Value, manga_path: &PathBuf) -> Result<(), Box<dyn Error>> {

        let uuid = manga["data"]["id"].as_str().ok_or("Err")?;
        let uuid = Uuid::parse_str(uuid)?;

        let credit = Url::parse("https://mangadex.org/title/")?;
        let credit = credit.join(uuid.to_string().as_str())?;

        let tag= manga["data"]["attributes"]["tags"].as_array().ok_or("Err")?
            .iter()
            .map(|tag| { tag["id"].as_str().unwrap().to_string() })
            .find(|tag| tag == "3e2b8dae-350e-4ab8-a8ce-016e844b9f0d" );
        
        let format = if tag.is_some() { Format::Longstrip } else { Format::Default };

        create_custom_meta(&manga_path, MangaMeta::new(
            uuid, "MangaDex", -1, "0", 0, vec![], format, Some(credit)
        ))?;

        Ok(())
    }

    fn volumes_to_chapters(volumes: &Value) -> Result<DownloadChapters, Box<dyn Error>> {

        let mut chapters: Vec<DownloadChapter> = vec![];

        let mut index: usize = 0;

        let mut repeats: bool = false;

        let mut check_repeats: Vec<String> = vec![];
        // let mut 

        volumes.as_object().ok_or("Err")?.iter().for_each(|volume| {

            let mut chapters_vec: Vec<(&String, &Value)> = volume.1.as_object().unwrap()["chapters"].as_object().unwrap().iter().collect();
            
            chapters_vec.sort_by(|a, b| {
                let af: f32 = a.1["chapter"].as_str().unwrap().parse::<f32>().unwrap();
                let bf: f32 = b.1["chapter"].as_str().unwrap().parse::<f32>().unwrap();
                return af.partial_cmp(&bf).unwrap()
            });

            chapters_vec.into_iter().for_each(|chapter| {

                let chapter_string = chapter.1["chapter"].as_str().unwrap().to_string();
                if check_repeats.contains(&chapter_string) { repeats = true; }
                check_repeats.push(chapter_string.to_owned());

                chapters.push(DownloadChapter::new(
                    chapter.1["id"].as_str().unwrap(), 
                    chapter.1["chapter"].as_str().unwrap(),
                    index,
                    volume.1["volume"].as_str().unwrap(),
                ));
                index = index + 1;

            });
        });

        Ok(DownloadChapters::new(chapters, repeats))
    }

    pub fn download_manga(manga_uuid: &str, lang: &str, title: &str, path: &PathBuf, window: &Window) -> Result<(), Box<dyn Error>> {

        let chapters_data = MangaDex::aggregate_manga_chapters(&manga_uuid, lang)?;
        let download_manga = MangaDex::volumes_to_chapters(&chapters_data["volumes"])?;

        let mut path = PathBuf::from(path);
        path.push(&title.replace("/", "|"));

        let mut index: i32 = 2;
        while path.is_dir() {
            path.set_file_name(format!("{} ({})", &path.file_name().unwrap().to_str().unwrap(), index));
            index = index + 1;
        }
        create_dir_all(&path)?;

        let manga = MangaDex::get_manga(&manga_uuid)?;
        MangaDex::download_cover(&manga, &path)?;

        MangaDex::create_meta(&manga, &path)?;
        
        let payload: StartDownloadingPayload = StartDownloadingPayload::new(manga_uuid.to_string(), download_manga.chapters.len());
        window.emit("start_downloading", payload)?;

        for chapter in download_manga.chapters {
            MangaDex::download_chapter(manga_uuid, chapter, download_manga.repeats, &path, &window)?;
        }

        Ok(())

    }

    fn aggregate_manga_chapters(manga_uuid: &str, lang: &str) -> Result<Value, Box<dyn Error>> {

        let client = MangaDex::client();

        let mut url: Url = MangaDex::api_url();
        url.set_path(format!("manga/{}/aggregate", manga_uuid).as_str());
        url.query_pairs_mut()
            .append_pair("translatedLanguage[]", lang);

        let resp = client
            .get(url).send()?
            .json::<Value>()?;

        Ok(resp)

    }

    fn get_manga(manga_uuid: &str) -> Result<Value, Box<dyn Error>> {

        let client = MangaDex::client();

        let mut url: Url = MangaDex::api_url();
        url.set_path(format!("manga/{}", manga_uuid).as_str());
        url.query_pairs_mut()
            .append_pair("includes[]", "cover_art");

        let resp = client
            .get(url).send()?
            .json::<Value>()?;

        Ok(resp)

    }

    fn get_chapter_athome_data(chapter_uuid: &str) -> Result<Value, Box<dyn Error>> {

        let client = MangaDex::client();

        let mut url: Url = MangaDex::api_url();
        url.set_path(format!("/at-home/server/{}", chapter_uuid).as_str());

        let resp = client
            .get(url).send()?
            .json::<Value>()?;

        Ok(resp)

    }

}