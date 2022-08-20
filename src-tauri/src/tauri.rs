#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use super::config;
use super::manga;
use super::connectors::mangadex::MangaDex;
use std::env;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use tauri::Manager;
use uuid::{Uuid};

#[derive(Serialize, Deserialize, Clone)]
struct DownloadingError {
  uuid: String,
  title: String,
  message: String,
}


// use crate::connectors::Connector;

#[tauri::command(async)]
fn message(message: String) {
  println!("{}", message);
}

#[tauri::command(async)]
fn get_manga_cards() -> Vec<manga::MangaCard> {
  manga::get_manga_cards()
}

// #[tauri::command(async)]
// fn get_chapter_by_uuid(uuid: &str, index: usize) -> manga::Chapter {
//   manga::get_chapter_by_uuid(Uuid::parse_str(uuid).unwrap(), index)
// }

#[tauri::command(async)]
fn get_chapter_by_title(title: &str, chapter: &str) -> manga::Chapter {
  manga::get_chapter_by_title(title, chapter)
}

// #[tauri::command(async)]
// fn get_chapter_list_by_uuid(uuid: &str) -> Vec<String> {
//   manga::get_chapter_list_by_uuid(Uuid::parse_str(uuid).unwrap())
// }

#[tauri::command(async)]
fn get_chapter_list_by_title(title: String) -> Vec<String> {
  manga::get_chapter_list_by_title(title)
}

#[tauri::command(async)]
fn get_manga_title_by_uuid(uuid: &str) -> String {
  manga::get_manga_title_by_uuid(Uuid::parse_str(uuid).unwrap())
}

// #[tauri::command(async)]
// fn get_manga_chapter_and_slide_by_uuid(uuid: &str) -> [i32; 2] {
//   manga::get_manga_chapter_and_slide_by_uuid(Uuid::parse_str(uuid).unwrap())
// }

#[tauri::command(async)]
fn get_manga_meta_by_title(title: &str) -> manga::MangaMeta {
  manga::get_manga_meta_by_title(title)
}

#[tauri::command(async)]
fn delete_manga_by_uuid(uuid: &str) {
  manga::delete_manga_by_uuid(Uuid::parse_str(uuid).unwrap())
}

// #[tauri::command(async)]
// fn set_manga_chapter_and_slide_by_uuid(uuid: &str, chapter: i32, slide: i32) {
//   match manga::set_manga_chapter_and_slide_by_uuid(Uuid::parse_str(uuid).unwrap(), chapter, slide) {
//     Ok(()) => println!("Updated chapter ({}) and slide ({}) of {}", chapter, slide, uuid),
//     Err(_) => println!("Failed to update chapter and slide of {}", uuid),
//   }
// }

#[tauri::command(async)]
fn set_manga_chapter_and_slide_by_title(title: &str, chapter: &str, slide: i32) {
  match manga::set_manga_chapter_and_slide_by_title(title, chapter, slide) {
    Ok(()) => println!("Updated chapter ({}) and slide ({}) of {}", chapter, slide, title),
    Err(_) => println!("Failed to update chapter and slide of {}", title),
  }
}

#[tauri::command(async)]
fn update_manga_order(order_list: Vec<manga::UuidOrderIndex>) {
  match manga::update_manga_order(order_list) {
    Ok(()) => println!("Updated manga order"),
    Err(_) => println!("Failed to update manga order"),
  }
}

#[tauri::command]
fn search_title(query: String, lang: String) -> Result<Value, String> {
  match MangaDex::search(query, lang) {
    Ok(result) => return Ok(result["data"].clone()),
    Err(_) => return Err("No connection".into()),
  }
}

#[tauri::command]
fn download_manga(uuid: String, lang: String, title: String, window: tauri::Window) {
  std::thread::spawn(move || {
    let result = MangaDex::download_manga(&uuid, &lang, &title, &window);
    match result {
      Ok(_) => println!("Downloaded manga {}", &title),
      Err(e) => {
        println!("{:?}", e);
        window.emit("downloading_error", DownloadingError{
          uuid,
          title,
          message: "Failed downloading manga".to_string(),
        }).unwrap();
      },
    }
  });
}

#[tauri::command(async)]
fn load_prefs() -> config::Prefs {
  config::Prefs::read().unwrap()
}

#[tauri::command(async)]
fn save_prefs(prefs: config::Prefs) {
  match config::Prefs::write(prefs) {
    Ok(()) => println!("Updated prefs"),
    Err(_) => println!("Failed to update prefs"),
  }
}

#[tauri::command(async)]
fn update_manga_dir(dir: PathBuf) {
  config::update_manga_dir(dir);
}

#[tauri::command]
fn change_reader_url(url: String, app_handle: tauri::AppHandle) {
  let window = app_handle.get_window("reader").unwrap();
  let js = format!("window.location.replace('{}')", url);
  let _ = window.eval(js.as_str());
}


pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_persisted_scope::init())
    .invoke_handler(tauri::generate_handler![
      message,
      search_title,
      download_manga,
      save_prefs,
      load_prefs,
      get_manga_cards,
      update_manga_order,
      get_manga_title_by_uuid,
      get_chapter_list_by_title,
      get_chapter_by_title,
      set_manga_chapter_and_slide_by_title,
      get_manga_meta_by_title,
      delete_manga_by_uuid,
      update_manga_dir,
      change_reader_url,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
