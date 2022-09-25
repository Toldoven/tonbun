// use std::path::PathBuf;

// use reqwest::Url;
// use uuid::Uuid;

// use std::collections::HashMap;

// #[cfg(test)]
// use crate::utils::Result;

// pub struct Downloader {
//     mangas: HashMap<Uuid, Progress>,
//     queue: Vec<DownloaderImage>,
//     failed: Vec<DownloaderImage>,
// }

// impl Downloader {
//     fn new() -> Self {
//         Self {
//             mangas: HashMap::new(),
//             queue: Vec::new(),
//             failed: Vec::new(),
//         }
//     }
//     fn push_with_uuid(&mut self, manga_uuid: Uuid, mut images: Vec<DownloaderImage>) {
//         self.mangas.insert(manga_uuid, Progress::new(images.len()));
//         self.queue.append(&mut images);
//     }
//     pub fn download(&mut self) {
//         let mut queue = &self.queue;
//         println!("Queue is: {:?}", queue);

//         let new: Vec<DownloaderImage> = queue.drain(0..10).collect();



//     }
// }

// // pub struct DownloaderManga {
// //     progress: Progress,
// // }

// struct Progress (usize, usize);

// impl Progress {
//     pub fn new(total: usize) -> Self {
//         Self (0, total)
//     }
// }

// #[derive(Debug)]
// pub struct DownloaderImage {
//     manga_uuid: Option<Uuid>,
//     url: Url,
//     path: PathBuf,
// }

// impl DownloaderImage {
//     pub fn new(url: Url, path: PathBuf) -> Self {
//         Self {
//             manga_uuid: None,
//             url,
//             path,
//         }
//     }
//     // pub fn download_image()
// }

// #[test]
// fn test() -> Result<()> {

//     let images: Vec<DownloaderImage> = (0..10).map(|index| -> DownloaderImage {
//         DownloaderImage::new(
//             Url::parse("https://random.imagecdn.app/500/150").unwrap(),
//             PathBuf::from(format!("/tests/{}", index))
//         )
//     }).collect();

//     let mut downloader = Downloader::new();

//     downloader.push_with_uuid(Uuid::new_v4(), images);
//     downloader.push_with_uuid(Uuid::new_v4(), images);
//     downloader.push_with_uuid(Uuid::new_v4(), images);
    
//     Ok(())
// }