// use downloader::{Download, Downloader};
use downloader::Download;
use reqwest::Client;
use reqwest::Url;
use serde_json::Value;
use ts_rs::TS;

use crate::utils::Result;

use std::fs::{create_dir_all};
use std::path::{PathBuf, Path};
use serde::{Serialize, Deserialize};
use crate::manga::{ MangaMeta, create_custom_meta, Format, Integration };
// use uuid::{uuid, Uuid};

use uuid::{Uuid};

// use self::self::;
// use crate::manga::create_custom_meta;

use tauri::window::Window;  

const API_URL: &'static str = "https://api.mangadex.org";

struct DownloadChapter {
    uuid: String,
    chapter: String,
    _index: usize,
    volume: String,
}

impl DownloadChapter {
    fn new(uuid: &str, chapter: &str, index: usize, volume: &str) -> DownloadChapter {
        DownloadChapter {
            uuid: uuid.to_string(),
            chapter: chapter.to_string(),
            _index: index,
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

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
struct UpdateProgressPayload {
    uuid: String,
    progress: usize,
}

impl UpdateProgressPayload {
    fn _new(uuid: String, progress: usize) -> UpdateProgressPayload {
        UpdateProgressPayload {
            uuid: uuid.to_string(),
            progress,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, TS)]
#[ts(export)]
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
    
    fn client() -> Client { Client::new() }

    pub async fn search(query: String, lang: String) -> Result<Value> {

        let mut url = Url::parse(
            format!("{API_URL}/manga").as_str()
        )?;

        url.query_pairs_mut()
            .append_pair("title", query.as_str())
            .append_pair("includes[]", "cover_art")
            .append_pair("order[relevance]", "desc")
            .append_pair("availableTranslatedLanguage[]", lang.as_str())
            .append_pair("limit", "20")
            .append_pair("hasAvailableChapters", "true");
        
        Ok(Self::fetch(url).await?)
    }

    fn get_chapter_name(chapter: &DownloadChapter, repeats: bool) -> String {
        if chapter.chapter == "none" { return "One Shot".to_string(); }
        if repeats { return format!("Vol. {} Ch. {}", chapter.volume, chapter.chapter) }
        format!("Chapter {}", chapter.chapter)
    }

    async fn download_chapter(_manga_uuid: &str, chapter: DownloadChapter, repeats: bool, path: &PathBuf, _window: &Window) -> Result<()> {

        let mut path = PathBuf::from(&path);

        let chapter_name: String = MangaDex::get_chapter_name(&chapter, repeats);
        path.push(chapter_name);

        create_dir_all(&path)?;

        let at_home_data = MangaDex::get_chapter_athome_data(chapter.uuid.as_str()).await?;

        let (base_url, hash, data) = (|| -> Option<(&str, &str, Vec<&str>)> {
            Some((
                at_home_data.get("baseUrl")?.as_str()?,
                at_home_data.get("chapter")?.get("hash")?.as_str()?,
                at_home_data.get("chapter")?
                    .get("data")?
                    .as_array()?
                    .iter()
                    .filter_map(|value| { value.as_str() })
                    .collect()
            ))
        })().ok_or("Failed to parse at_home_data")?;

        let _downloads: Vec<Download> = data.iter().enumerate().map(|(index, image)| {
            let extension = image.split(".").last().unwrap();
            let download = Download::new(format!("{}/data/{}/{}", &base_url, &hash, image).as_str());
            let download = download.file_name(Path::new(format!("./{}.{}", index.to_string(), extension).as_str()));
            download
        }).collect();

        // println!("{:?}", downloads);

        Ok(())
        
        // let mut downloader = Downloader::builder()
        //     .download_folder(&path.as_path())
        //     .build()?;

        // downloader.download(&downloads)?;

        // window.emit(
        //     "update_download_progress", 
        //     UpdateProgressPayload::new(manga_uuid.to_string(), 
        //     chapter.index))?;

        // Ok(())
    }

    async fn download_cover(manga: &Value, path: &PathBuf) -> Result<()>{

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
        let image_bytes = client.get(url)
            .send()
            .await?
            .bytes()
            .await?;

        let image = image::load_from_memory(&image_bytes)?;

        let mut path = PathBuf::from(&path);
        path.push("cover");
        path.set_extension(extension);

        image.save(&path)?;

        Ok(())
    }



    fn create_meta(manga: &Value, manga_path: &PathBuf) -> Result<()> {

        let uuid = manga["data"]["id"].as_str().ok_or("Err")?;
        let uuid = Uuid::parse_str(uuid)?;

        let credit = Url::parse("https://mangadex.org/title/")?;
        let credit = credit.join(uuid.to_string().as_str())?;

        let tag= manga["data"]["attributes"]["tags"].as_array().ok_or("Err")?
            .iter()
            .map(|tag| { tag["id"].as_str().unwrap().to_string() })
            .find(|tag| tag == "3e2b8dae-350e-4ab8-a8ce-016e844b9f0d" );
        
        let format = if tag.is_some() { Format::Longstrip } else { Format::Default };

        let links = (|| -> Option<&Value>{
            manga.get("data")?.get("attributes")?.get("links")
        })().ok_or("Failed to parse links")?;

        let get_link = |link: &str| -> Option<String> {
            Some(links.get(link)?.as_str()?.to_string())
        };

        let anilist = get_link("al");
        let myanimelist = get_link("mal");

        create_custom_meta(&manga_path, MangaMeta {
            connector: format!("MangaDex"),
            credits: Some(credit),
            format: format,
            integration: Integration {
                anilist,
                myanimelist,
            },
            ..Default::default()
        })?;

        Ok(())
    }

    fn volumes_to_chapters(volumes: &Value) -> Result<DownloadChapters> {

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

    pub async fn download_manga(manga_uuid: &str, lang: &str, title: &str, path: &PathBuf, window: &Window) -> Result<()> {

        let chapters_data = MangaDex::aggregate_manga_chapters(&manga_uuid, lang).await?;
        let download_manga = MangaDex::volumes_to_chapters(&chapters_data["volumes"])?;

        let mut path = PathBuf::from(path);
        path.push(&title.replace("/", "|"));

        let mut index: i32 = 2;
        while path.is_dir() {
            path.set_file_name(format!("{} ({})", &path.file_name().unwrap().to_str().unwrap(), index));
            index = index + 1;
        }
        create_dir_all(&path)?;

        let manga = MangaDex::get_manga(&manga_uuid).await?;
        MangaDex::download_cover(&manga, &path).await?;

        MangaDex::create_meta(&manga, &path)?;
        
        let payload: StartDownloadingPayload = StartDownloadingPayload::new(manga_uuid.to_string(), download_manga.chapters.len());
        window.emit("start_downloading", payload)?;

        for chapter in download_manga.chapters {
            MangaDex::download_chapter(manga_uuid, chapter, download_manga.repeats, &path, &window).await?;
        }

        Ok(())

    }

    async fn aggregate_manga_chapters(manga_uuid: &str, lang: &str) -> Result<Value> {
        let mut url = Url::parse(
            format!("{API_URL}/manga/{manga_uuid}/aggregate").as_str()
        )?;

        url.query_pairs_mut()
            .append_pair("translatedLanguage[]", lang);

        Ok(Self::fetch(url).await?)
    }

    async fn get_manga(manga_uuid: &str) -> Result<Value> {
        let mut url = Url::parse(
            format!("{API_URL}/manga/{manga_uuid}").as_str()
        )?;

        url.query_pairs_mut()
            .append_pair("includes[]", "cover_art");

        Ok(Self::fetch(url).await?)
    }

    async fn get_chapter_athome_data(chapter_uuid: &str) -> Result<Value> {
        let url = Url::parse(
            format!("{API_URL}/at-home/server/{chapter_uuid}").as_str()
        )?;

        Ok(Self::fetch(url).await?)
    }


    async fn fetch(url: Url) -> Result<Value> {

        let client = MangaDex::client();

        let resp = client
            .get(url)
            .send()
            .await?
            .json()
            .await?;

        Ok(resp)

    }

}