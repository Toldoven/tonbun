use crate::prefs::manga_dir_title;
use std::fs::remove_dir_all;
use std::fs::{read_to_string, read_dir, write, copy};
use reqwest::Url;
use serde::{Serialize, Deserialize};
use std::path::{PathBuf};
use std::result::Result;
use std::error::Error;
use uuid::Uuid;
use alphanumeric_sort::{sort_str_slice, sort_path_slice};
use ts_rs::TS;

#[derive(Serialize, Deserialize)]
pub struct UuidOrderIndex(Uuid, i32);

#[derive(Serialize, TS)]
#[ts(export)]
pub struct MangaCard {
    #[ts(type = "string")]
    uuid: Uuid,
    connector: String,
    title: String,
    cover: String,
    order: i32,
    chapter: String,
    slide: i32,
}

impl MangaCard {
    fn new(uuid: Uuid, title: &str, connector: &str, cover: &str, order: i32, chapter: &str, slide: i32) -> MangaCard {
        MangaCard {
            uuid,
            title: title.to_string(),
            connector: connector.to_string(),
            cover: cover.to_string(),
            order,
            chapter: chapter.to_string(),
            slide,
        }
    }
}

#[derive(Serialize, Clone, TS)]
#[ts(export)]
pub struct Manga {
    title: String,
    chapters: Vec<Chapter>,
    path: PathBuf,
    meta: MangaMeta,
}

impl Manga {
    fn new(title: &str, chapters: Vec<Chapter>, path: PathBuf, meta: MangaMeta) -> Manga {
        Manga {
            title: title.to_string(),
            chapters: chapters,
            path,
            meta: meta,
        }
    }
    fn update_meta(&self) -> Result<(), Box<dyn Error>> {
        let mut meta_path = PathBuf::from(&self.path);
        meta_path.push(&self.title);
        meta_path.push("meta.toml");
        write(&meta_path, toml::to_string(&self.meta)?.as_bytes())?;
        Ok(())
    }
}

#[derive(Serialize, Clone, TS)]
#[ts(export)]
pub struct Chapter {
    path: PathBuf,
    images: Vec<String>,
}

impl Chapter {
    fn new(path: PathBuf, images: Vec<String>) -> Chapter {
        Chapter {
            path,
            images,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, TS)]
#[serde(default)]
#[ts(export)]
pub struct MangaMeta {
    #[ts(type = "string")]
    pub uuid: Uuid,
    pub connector: String,
    pub order: i32,
    pub chapter: String,
    pub slide: i32,
    pub finished_chapters: Vec<String>,
    pub format: Format,
    #[ts(type = "string")]
    pub credits: Option<Url>,
    pub integration: Integration,
}

#[derive(Serialize, Deserialize, Clone, TS)]
#[serde(default)]
#[ts(export)]
pub struct Integration {
    pub anilist: Option<String>,
    pub myanimelist: Option<String>,
}

impl Default for Integration {
    fn default() -> Self {
        Self {
            anilist: None,
            myanimelist: None,
        }
    }
}

impl Default for MangaMeta {
    fn default() -> Self {
        Self::new(
            Uuid::new_v4(),
            "Local",
            -1,
            "0",
            0,
            vec![],
            Format::Default,
            None,
            Integration::default(),
        )
    }
}

impl MangaMeta {
    pub fn new(
        uuid: Uuid,
        connector: &str,
        order: i32,
        chapter: &str,
        slide: i32,
        finished_chapters: Vec<String>,
        format: Format,
        credits: Option<Url>,
        integration: Integration
    ) -> MangaMeta {
        MangaMeta {
            uuid,
            connector: connector.to_string(),
            order,
            chapter: chapter.to_string(),
            slide, 
            finished_chapters,
            format,
            credits,
            integration,
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, TS)]
#[ts(export)]
pub enum Format {
    Default,
    Slides,
    Longstrip,
}


pub fn get_chapter_images(path: &PathBuf) -> Vec<String> {

    // println!("{:?}", path);

    let mut images: Vec<String> = read_dir(path)
        .unwrap()
        .map(|image| image.unwrap().path())
        .filter(|image| { image.is_file() && vec!["jpeg", "jpg", "png", "webp"].contains(&image.extension().unwrap().to_str().unwrap()) })
        .map(|image| image.file_name().unwrap().to_str().unwrap().to_string())
        .collect();

    sort_str_slice(&mut images);

    images
}

pub fn get_manga_chapters_paths(manga_path: &PathBuf) -> Vec<PathBuf> {

    let mut chapters: Vec<PathBuf> = read_dir(&manga_path)
        .unwrap()
        .map(|chapter| chapter.unwrap().path())
        .filter(|chapter| chapter.is_dir())
        .collect();

    sort_path_slice(&mut chapters);

    chapters
}

pub fn get_manga_chapters(manga_path: &PathBuf) -> Vec<Chapter> {

    let chapters: Vec<PathBuf> = get_manga_chapters_paths(manga_path);

    chapters
        .iter()
        .map(|chapter| {
            return Chapter::new(
                PathBuf::from(&chapter),
                get_chapter_images(&chapter)
            )
        })
        .collect()

}

pub fn create_default_meta(manga_path: &PathBuf) -> MangaMeta {
    let meta_path = manga_path_to_meta_path(manga_path);
    let meta = MangaMeta::default();
    write(meta_path, toml::to_string(&meta).unwrap().as_bytes()).unwrap();
    return meta;
}

pub fn create_custom_meta(manga_path: &PathBuf, meta: MangaMeta) -> Result<MangaMeta, Box<dyn Error>> {
    let meta_path = manga_path_to_meta_path(manga_path);
    write(meta_path, toml::to_string(&meta)?.as_bytes())?;
    Ok(meta)
}

fn get_meta(manga_path: &PathBuf) -> MangaMeta {

    let meta_path = manga_path_to_meta_path(manga_path);

    if !meta_path.is_file() {
        return create_default_meta(manga_path);
    }

    let file = read_to_string(&meta_path).unwrap();
    let meta: Result<MangaMeta, _> = toml::from_str(file.as_str());

    match meta {
        Ok(result) => return result,
        Err(_) => return create_default_meta(manga_path),
    }
}

pub fn manga_path_to_meta_path(manga_path: &PathBuf) -> PathBuf {
    let mut meta_path = PathBuf::from(manga_path);
    meta_path.push("meta.toml");
    meta_path
}

pub fn get_manga_paths(manga_dir: &PathBuf) -> Vec<PathBuf> {
    read_dir(manga_dir).unwrap()
        .map(|path| path.unwrap().path())
        .filter(|path| {
            path.is_dir()
        })
        .collect()
}

pub fn get_manga_cover_by_path(path: &PathBuf) -> PathBuf {
    let mut cover_path = PathBuf::from(path);
    cover_path.push("cover");

    for extension in ["webp", "png", "jpg", "jpeg"] {
        cover_path.set_extension(extension);
        if cover_path.is_file() { return PathBuf::from(cover_path) };
    }

    let chapters = get_manga_chapters(path);

    let mut chapter_cover = PathBuf::from(&chapters[0].path);
    chapter_cover.push(&chapters[0].images[0]);

    cover_path.set_extension(chapter_cover.extension().unwrap());

    copy(&chapter_cover, &cover_path).unwrap();

    chapter_cover
}

pub fn get_manga_by_path(path: &PathBuf) -> Option<Manga> {

    if !path.is_dir() { return None }

    let title = path.file_stem()?.to_str()?;

    let manga = Manga::new(
        title,
        get_manga_chapters(path),
        PathBuf::from( path.parent()?),
        get_meta(path),
    );

    Some(manga)
}

pub fn get_manga_by_path_and_title(path: &PathBuf, title: &str) -> Option<Manga> {

    let mut path = PathBuf::from(path);
    path.push(title);

    let manga = get_manga_by_path(&path)?;

    Some(manga)

}

pub fn get_mangas(manga_dir: &PathBuf) -> Vec<Manga> {

    let mut manga_list: Vec<Manga> = vec![];

    let paths = get_manga_paths(manga_dir);

    for manga_path in paths {
        let manga = get_manga_by_path(&manga_path);
        
        if manga.is_some() {
            manga_list.push(get_manga_by_path(&manga_path).unwrap())
        }
    }

    return manga_list;
}

pub fn get_manga_cards(manga_dir: &PathBuf) -> Vec<MangaCard> {
    let mut manga_cards: Vec<MangaCard> = vec![];

    for path in get_manga_paths(manga_dir){
        let cover = get_manga_cover_by_path(&path);
        let meta = get_meta(&path);

        manga_cards.push(MangaCard::new(
            meta.uuid,
            path.file_stem().unwrap().to_str().unwrap(),
            meta.connector.as_str(),
            cover.to_str().unwrap(),
            meta.order,
            meta.chapter.as_str(),
            meta.slide,
        ));
    }

    manga_cards
}

pub fn get_chapter_by_title(title: &str, chapter: &str, manga_dir: &PathBuf) -> Chapter {

    let mut path = PathBuf::from(manga_dir);
    path.push(title);
    path.push(chapter);

    Chapter::new(
        PathBuf::from(&path),
        get_chapter_images(&path)
    )
}

struct PathAndMeta {
    path: PathBuf,
    meta: MangaMeta,
}

impl PathAndMeta {
    fn new(path: PathBuf, meta: MangaMeta) -> PathAndMeta {
        PathAndMeta {
            path,
            meta,
        }
    }
}

fn get_manga_path_and_meta_by_uuid(uuid: Uuid, manga_dir: &PathBuf) -> PathAndMeta {
    get_manga_paths(manga_dir)
        .iter()
        .map(|path| PathAndMeta::new(PathBuf::from(path), get_meta(&path)))
        .find(|pwm| pwm.meta.uuid == uuid)
        .unwrap()
}

fn get_manga_by_uuid(uuid: Uuid, manga_dir: &PathBuf) -> Manga {
    let path = get_manga_path_and_meta_by_uuid(uuid, manga_dir).path;
    get_manga_by_path(&path).unwrap()
}

pub fn get_chapter_list_by_title(title: String, manga_dir: &PathBuf) -> Vec<String> {

    let mut path = PathBuf::from(manga_dir);
    path.push(title);
    let chapters = get_manga_chapters_paths(&path);

    chapters.iter().map(|chapter|{
        chapter
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string()
    }).collect()

}

pub fn get_manga_title_by_uuid(uuid: Uuid, manga_dir: &PathBuf) -> String {
    let path = get_manga_path_and_meta_by_uuid(uuid, manga_dir).path;
    return path.file_name().unwrap().to_str().unwrap().to_string();
}

pub fn set_manga_chapter_and_slide_by_title(title: &str, chapter: &str, slide: i32, manga_dir: &PathBuf) -> Result<(), Box<dyn Error>> {

    let mut manga = get_manga_by_path_and_title(manga_dir, title).ok_or("No manga with this title")?;

    manga.meta.chapter = chapter.to_string();
    manga.meta.slide = slide;
    manga.update_meta()?;

    Ok(())
}

pub fn set_manga_format_by_title(title: &str, format: Format, manga_dir: &PathBuf, window: tauri::Window) -> Result<(), Box<dyn Error>> {

    let mut manga = get_manga_by_path_and_title(manga_dir, title).ok_or("No manga with this title")?;

    manga.meta.format = format;
    manga.update_meta()?;

    window.emit("update_meta", manga.meta).ok();

    Ok(())
}


pub fn get_manga_meta_by_title(title: &str, manga_dir: &PathBuf) -> MangaMeta {
    let path = manga_dir_title(title, manga_dir);
    get_meta(&path)
}

pub fn update_manga_order(order_list: Vec<UuidOrderIndex>, manga_dir: &PathBuf) -> Result<(), Box<dyn Error>> {
    for item in order_list {
        let mut manga = get_manga_by_uuid(item.0, manga_dir);
        manga.meta.order = item.1;
        manga.update_meta()?;
    }
    Ok(())
}

pub fn delete_manga_by_uuid(manga_uuid: Uuid, manga_dir: &PathBuf) {
    let path = get_manga_path_and_meta_by_uuid(manga_uuid, manga_dir).path;
    remove_dir_all(path).unwrap();
}
