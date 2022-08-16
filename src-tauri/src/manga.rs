use crate::config::manga_dir;
use crate::config::manga_dir_title;
use std::fs::remove_dir_all;
use std::fs::{read_to_string, read_dir, write, copy};
use serde::{Serialize, Deserialize};
use std::path::{PathBuf};
use std::result::Result;
use std::error::Error;
use uuid::Uuid;
use alphanumeric_sort::{sort_str_slice, sort_path_slice};

#[derive(Serialize, Deserialize)]
pub struct UuidOrderIndex(Uuid, i32);

#[derive(Serialize)]
pub struct MangaCard {
    uuid: Uuid,
    connector: String,
    title: String,
    cover: String,
    order: i32,
    chapter: i32,
    slide: i32,
}

impl MangaCard {
    fn new(uuid: Uuid, title: &str, connector: &str, cover: &str, order: i32, chapter: i32, slide: i32) -> MangaCard {
        MangaCard {
            uuid,
            title: title.to_string(),
            connector: connector.to_string(),
            cover: cover.to_string(),
            order,
            chapter,
            slide,
        }
    }
}

#[derive(Serialize, Clone)]
pub struct Manga {
    title: String,
    chapters: Vec<Chapter>,
    meta: MangaMeta,
}

impl Manga {
    fn new(title: &str, chapters: Vec<Chapter>, meta: MangaMeta) -> Manga {
        Manga {
            title: title.to_string(),
            chapters: chapters,
            meta: meta,
        }
    }
    fn update_meta(&self) -> Result<(), Box<dyn Error>> {
        let mut meta_path = manga_dir_title(&self.title);
        meta_path.push("meta.json");
        write(&meta_path, serde_json::to_string(&self.meta)?.as_bytes())?;
        Ok(())
    }
}

#[derive(Serialize, Clone)]
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

#[derive(Serialize, Deserialize, Clone)]
pub struct MangaMeta {
    uuid: Uuid,
    connector: String,
    order: i32,
    chapter: i32,
    slide: i32,
    finished_chapters: Vec<i32>,
}

impl MangaMeta {
    pub fn new(uuid: Uuid, connector: &str, order: i32, chapter: i32, slide: i32, finished_chapters: Vec<i32>) -> MangaMeta {
        MangaMeta {
            uuid,
            connector: connector.to_string(),
            order,
            chapter,
            slide, 
            finished_chapters,
        }
    }

    pub fn default() -> MangaMeta {
        MangaMeta::new(
            Uuid::new_v4(),
            "Local",
            -1,
            0,
            0,
            vec![],
        )
    }
}


pub fn get_chapter_images(path: &PathBuf) -> Vec<String> {
    let mut images: Vec<String> = read_dir(path)
        .unwrap()
        .map(|image| image.unwrap().path())
        .filter(|image| { vec!["jpeg", "jpg", "png", "webp"].contains(&image.extension().unwrap().to_str().unwrap()) })
        .map(|image| image.file_name().unwrap().to_str().unwrap().to_string())
        .collect();

    sort_str_slice(&mut images);

    images
}

pub fn get_manga_chapters(path: &PathBuf) -> Vec<Chapter> {

    let mut chapters: Vec<PathBuf> = read_dir(&path)
        .unwrap()
        .map(|chapter| chapter.unwrap().path())
        .collect();

    sort_path_slice(&mut chapters);

    chapters
        .iter()
        .filter(|chapter| chapter.is_dir())
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
    write(meta_path, serde_json::to_string(&meta).unwrap().as_bytes()).unwrap();
    return meta;
}

pub fn create_custom_meta(manga_path: &PathBuf, meta: MangaMeta) -> Result<MangaMeta, Box<dyn Error>> {
    let meta_path = manga_path_to_meta_path(manga_path);
    write(meta_path, serde_json::to_string(&meta)?.as_bytes())?;
    Ok(meta)
}

fn get_meta(manga_path: &PathBuf) -> MangaMeta {
    let meta_path = manga_path_to_meta_path(manga_path);

    if !meta_path.is_file() {
        return create_default_meta(manga_path);
    }

    let file = read_to_string(&meta_path).unwrap();
    let meta: Result<MangaMeta, _> = serde_json::from_str(file.as_str());

    match meta {
        Ok(result) => return result,
        Err(_) => return create_default_meta(&meta_path),
    }
}

pub fn manga_path_to_meta_path(manga_path: &PathBuf) -> PathBuf {
    let mut meta_path = PathBuf::from(manga_path);
    meta_path.push("meta.json");
    meta_path
}

pub fn get_manga_paths() -> Vec<PathBuf> {
    read_dir(manga_dir()).unwrap()
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

pub fn get_manga_by_path(path: &PathBuf) -> Manga {
    let title = path.file_stem().unwrap().to_str().unwrap();

    Manga::new(
        title,
        get_manga_chapters(path),
        get_meta(path),
    )
}

pub fn get_mangas() -> Vec<Manga> {
    let mut manga_list: Vec<Manga> = vec![];

    let paths = get_manga_paths();

    for manga_path in paths {
        manga_list.push(get_manga_by_path(&manga_path));
    }

    return manga_list;
}

pub fn get_manga_cards() -> Vec<MangaCard> {
    let mut manga_cards: Vec<MangaCard> = vec![];

    for path in get_manga_paths(){
        let cover = get_manga_cover_by_path(&path);
        let meta = get_meta(&path);

        manga_cards.push(MangaCard::new(
            meta.uuid,
            path.file_stem().unwrap().to_str().unwrap(),
            meta.connector.as_str(),
            cover.to_str().unwrap(),
            meta.order,
            meta.chapter,
            meta.slide,
        ));
    }

    manga_cards
}

pub fn get_chapter_by_uuid(uuid: Uuid, index: usize) -> Chapter {

    let path = get_manga_path_and_meta_by_uuid(uuid).path;
    let chapters = get_manga_chapters(&path);

    chapters.get(index).unwrap().clone()
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

fn get_manga_path_and_meta_by_uuid(uuid: Uuid) -> PathAndMeta {
    get_manga_paths()
        .iter()
        .map(|path| PathAndMeta::new(PathBuf::from(path), get_meta(&path)))
        .find(|pwm| pwm.meta.uuid == uuid)
        .unwrap()
}

fn get_manga_by_uuid(uuid: Uuid) -> Manga {
    let path = get_manga_path_and_meta_by_uuid(uuid).path;
    get_manga_by_path(&path)
}

pub fn get_chapter_list_by_uuid(uuid: Uuid) -> Vec<String> {

    let path = get_manga_path_and_meta_by_uuid(uuid).path;
    let chapters = get_manga_chapters(&path);

    chapters.iter().map(|chapter|{
        chapter.path
            .file_name()
            .unwrap()
            .to_str()
            .unwrap()
            .to_string()
    }).collect()

}

pub fn get_manga_title_by_uuid(uuid: Uuid) -> String {
    let path = get_manga_path_and_meta_by_uuid(uuid).path;
    return path.file_name().unwrap().to_str().unwrap().to_string();
}

pub fn get_manga_chapter_and_slide_by_uuid(uuid: Uuid) -> [i32; 2] {
    let meta = get_manga_path_and_meta_by_uuid(uuid).meta;
    return [meta.chapter, meta.slide]
}

pub fn set_manga_chapter_and_slide_by_uuid(uuid: Uuid, chapter: i32, slide: i32) -> Result<(), Box<dyn Error>> {
    let mut manga = get_manga_by_uuid(uuid);
    manga.meta.chapter = chapter;
    manga.meta.slide = slide;
    manga.update_meta()?;

    Ok(())
}

pub fn update_manga_order(order_list: Vec<UuidOrderIndex>) -> Result<(), Box<dyn Error>> {
    for item in order_list {
        let mut manga = get_manga_by_uuid(item.0);
        manga.meta.order = item.1;
        manga.update_meta()?;
    }
    Ok(())
}

pub fn delete_manga_by_uuid(manga_uuid: Uuid) {
    let path = get_manga_path_and_meta_by_uuid(manga_uuid).path;
    remove_dir_all(path).unwrap();
}
