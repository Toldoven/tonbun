#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
#![feature(async_closure)]

pub mod manga;
pub mod prefs;
pub mod connectors;
pub mod discord;
pub mod oauth;
pub mod utils;
pub mod downloader;

use crate::manga::Format;
use crate::manga::Manga;
use crate::prefs::Prefs;
use crate::oauth::anilist;
// use crate::discord::discord_ipc_start_interval;

use crate::connectors::mangadex::MangaDex;
use std::env;
use std::error::Error;
use std::fs::create_dir_all;
use std::path::PathBuf;
use std::sync::Arc;
use reqwest::Url;
use tokio::sync::Mutex;
use tauri::Manager;
// use discord_rich_presence::activity::Assets;
// use discord_rich_presence::activity::Timestamps;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use tauri::State;
// use tokio::time::{interval, Duration};
use uuid::{Uuid};
use declarative_discord_rich_presence::{activity::{Activity, Assets, Timestamps}, DeclarativeDiscordIpcClient};

// use tokio::time::{Duration, interval};

#[derive(Serialize, Deserialize, Clone)]
struct DownloadingError {
  uuid: String,
  title: String,
  message: String,
}

// Commands

#[tauri::command(async)]
fn message(message: String) {
  println!("{}", message);
}

#[tauri::command]
async fn get_manga_cards(prefs: State<'_, PrefsStore>) -> Result<Vec<manga::MangaCard>, ()> {
  Ok(manga::get_manga_cards(&prefs.manga_dir().await))
}

#[tauri::command]
async fn get_chapter_by_title(title: &str, chapter: &str, prefs: State<'_, PrefsStore>) -> Result<manga::Chapter, ()> {
  Ok(manga::get_chapter_by_title(title, chapter, &prefs.manga_dir().await))
}

#[tauri::command]
async fn get_chapter_list_by_title(title: String, prefs: State<'_, PrefsStore>) -> Result<Vec<String>, ()> {
  Ok(manga::get_chapter_list_by_title(title, &prefs.manga_dir().await))
}

#[tauri::command]
async fn get_manga_by_title(title: String, prefs: State<'_, PrefsStore>) -> Result<Option<Manga>, ()> {
  Ok(manga::get_manga_by_path_and_title(&prefs.manga_dir().await, title.as_str()))
}

#[tauri::command]
async fn get_manga_title_by_uuid(uuid: &str, prefs: State<'_, PrefsStore>) -> Result<String, ()> {
  Ok(manga::get_manga_title_by_uuid(Uuid::parse_str(uuid).unwrap(), &prefs.manga_dir().await))
}

#[tauri::command]
async fn get_manga_meta_by_title(title: &str, prefs: State<'_, PrefsStore>) -> Result<manga::MangaMeta, ()> {
  Ok(manga::get_manga_meta_by_title(title, &prefs.manga_dir().await))
}

#[tauri::command]
async fn delete_manga_by_uuid(uuid: &str, prefs: State<'_, PrefsStore>) -> Result<(), ()> {
  Ok(manga::delete_manga_by_uuid(Uuid::parse_str(uuid).unwrap(), &prefs.manga_dir().await))
}

#[tauri::command]
async fn set_manga_chapter_and_slide_by_title(title: &str, chapter: &str, slide: i32, prefs: State<'_, PrefsStore>) -> Result<(), ()> {
  match manga::set_manga_chapter_and_slide_by_title(title, chapter, slide, &prefs.manga_dir().await) {
    Ok(()) => println!("Updated chapter ({}) and slide ({}) of {}", chapter, slide, title),
    Err(e) => println!("Failed to update chapter and slide of {}, ({})", title, e),
  }
  Ok(())
}


#[tauri::command]
async fn set_manga_chapter_and_slide_from_state(reader: State<'_, ReaderStore>, prefs: State<'_, PrefsStore>) -> Result<(), ()> {
  let lock = reader.0.lock().await;
  println!("{:?}", lock);
  let result = manga::set_manga_chapter_and_slide_by_title(
    lock.title.as_str(), 
    lock.chapter.as_str(), 
    lock.slide,
    &prefs.manga_dir().await
  );
  println!("{:?}", result);
  Ok(())
}


#[tauri::command]
async fn set_reader_state(title: &str, chapter: &str, slide: i32, reader: State<'_, ReaderStore>) -> Result<(), ()> {
  reader.set(title, chapter, slide).await;
  Ok(())
}

#[tauri::command]
async fn set_manga_format_by_title(title: &str, format: Format, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  match manga::set_manga_format_by_title(title, format, &prefs.manga_dir().await, window) {
    Ok(()) => println!("Updated format"),
    Err(_) => println!("Failed to update format"),
  }
  Ok(())
}

#[tauri::command]
async fn update_manga_order(order_list: Vec<manga::UuidOrderIndex>, prefs: State<'_, PrefsStore>) -> Result<(), ()> {
  match manga::update_manga_order(order_list, &prefs.manga_dir().await) {
    Ok(()) => println!("Updated manga order"),
    Err(_) => println!("Failed to update manga order"),
  }
  Ok(())
}

#[tauri::command]
async fn search_title(query: String, lang: String) -> Result<Value, String> {
    return match MangaDex::search(query, lang).await {
        Ok(result) => Ok(result["data"].clone()),
        Err(_) => Err("No connection".into()),
    }
}

#[tauri::command]
async fn download_manga(uuid: String, lang: String, title: String, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  let prefs = prefs.0.lock().await;
  let manga_directory = PathBuf::from(&prefs.manga_directory);

  let result = MangaDex::download_manga(&uuid, &lang, &title, &manga_directory, &window).await;

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

  Ok(())
}

#[tauri::command]
async fn update_manga_dir(dir: PathBuf, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  create_dir_all(&dir).unwrap();

  let mut prefs = prefs.0.lock().await;
  prefs.manga_directory = PathBuf::from(&dir);
  window.emit_all("update_prefs", prefs.clone()).unwrap();

  Ok(())
}

#[tauri::command(async)]
fn change_reader_url(url: String, app_handle: tauri::AppHandle) {
  let window = app_handle.get_window("reader").unwrap();
  let js = format!("window.location.replace('{}')", url);
  let _ = window.eval(js.as_str());
}

// Pefs

#[tauri::command]
async fn read_prefs(prefs: State<'_, PrefsStore>) -> Result<Prefs, ()> {
  Ok(prefs.0.lock().await.clone())
}

#[tauri::command]
async fn set_lang(lang: String, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  let mut prefs = prefs.0.lock().await;
  prefs.lang = lang;
  window.emit_all("update_prefs", prefs.clone()).unwrap();
  Ok(())
}

#[tauri::command]
async fn anilist_oauth_logout(prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  let mut prefs = prefs.0.lock().await;
  prefs.oauth.anilist.access_token = None;
  window.emit_all("update_prefs", prefs.clone()).unwrap();
  Ok(())
}

#[tauri::command]
async fn set_reader_format(format: Format, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {
  let mut prefs = prefs.0.lock().await;
  prefs.reader.default_format = format;
  window.emit_all("update_prefs", prefs.clone()).unwrap();
  Ok(())
}

#[tauri::command]
async fn set_discord_rich_presence_enabled(
  value: bool,
  prefs: State<'_, PrefsStore>,
  client: State<'_, DeclarativeDiscordIpcClient>,
  window: tauri::Window
) -> Result<(), ()> {
  
  let mut prefs = prefs.0.lock().await;
  prefs.discord_rich_presence_enabled = value;

  window.emit_all("update_prefs", prefs.clone()).unwrap();

  if value { client.enable() } else { client.disable() }

  Ok(())
}

// #[tauri::command(async)]
// fn set_window_prefs(label: String, window: prefs::Window, prefs: State<'_, PrefsStore>, webview: tauri::Window) {
//   let mut prefs = prefs.0.lock().unwrap();
//   if label == "reader" { prefs.windows.reader = window.clone() };
//   if label == "library" { prefs.windows.library = window.clone() };
//   webview.emit_all("update_prefs", prefs.clone()).unwrap();
// }

#[tauri::command(async)]
async fn save_prefs(prefs: State<'_, PrefsStore>) -> Result<(), String> {
  let prefs = prefs.0.lock().await;
  let result = prefs.save();
  if prefs.save().is_err() { return Err(format!("{:#?}", result)) }
  Ok(())
}

#[tauri::command(async)]
fn discord_set_activity(
  details: &str,
  state: &str,
  timestamp: i64,
  image: &str,
  client: State<'_, DeclarativeDiscordIpcClient>
) -> Result<(), ()> {
  
  client.set_activity(Activity::new()
    .state(state)
    .details(details)
    .timestamps(Timestamps::new().start(timestamp))
    .assets(Assets::new().large_image(image))
  ).ok();

  // println!("{:?}", res);

  Ok(())

}

#[tauri::command(async)]
fn discord_clear_activity(client: State<'_, DeclarativeDiscordIpcClient>) -> Result<(), ()> {

  client.clear_activity().ok();

  Ok(())

}

#[tauri::command]
async fn anilist_update_manga(anilist_manga_id: &str, progress: i64, prefs: State<'_, PrefsStore>, window: tauri::Window) -> Result<(), ()> {

  let mut prefs = prefs.0.lock().await;
  let access_token = prefs.oauth.anilist.access_token.clone();

  if let None = access_token { return Ok(()) }

  let result = anilist::update(
    anilist_manga_id, 
    access_token.unwrap().as_str(),
    progress
  ).await;

  if let Err(error) = result {
    if error.to_string() == "Invalid token" {
      let _ = window.emit_all("error", "oauth.anilist.token");
      prefs.oauth.anilist.access_token = None;
      window.emit_all("update_prefs", prefs.clone()).unwrap();
    }
    dbg!(error);
  }

  Ok(())
}

// Stores

pub struct PrefsStore(Arc<Mutex<Prefs>>);

impl PrefsStore {
  pub fn new() -> PrefsStore {
    PrefsStore(
      Arc::new(
        Mutex::new(
          Prefs::load().unwrap()
        )
      )
    )
  }

async fn manga_dir(&self) -> PathBuf {
    let lock = self.0.lock().await;
    PathBuf::from(&lock.manga_directory)
  }
}

#[derive(Debug)]
pub struct Reader {
  pub title: String,
  pub chapter: String,
  pub slide: i32,
}

#[derive(Debug)]
pub struct ReaderStore(pub Arc<Mutex<Reader>>);

impl ReaderStore {
  pub fn new() -> ReaderStore {
    ReaderStore(
      Arc::new(
        Mutex::new(
          Reader {
            title: "".to_string(),
            chapter: "".to_string(),
            slide: 0,
          }
        )
      )
    )
  }
  pub async fn set(&self, title: &str, chapter: &str, slide: i32) {
    let mut lock = self.0.lock().await;
    lock.title = title.to_string();
    lock.chapter = chapter.to_string();
    lock.slide = slide;
  }
}

#[tokio::main]
async fn main() {
  tauri_plugin_deep_link::prepare("com.tonbun.dev");
  tauri::async_runtime::set(tokio::runtime::Handle::current());
  tauri::Builder::default()
    .plugin(tauri_plugin_persisted_scope::init())
    .plugin(tauri_plugin_window_state::Builder::default()
      .set_auto_show(false)
      .build()
    )
    .invoke_handler(tauri::generate_handler![
      message,
      search_title,
      download_manga,
      get_manga_cards,
      update_manga_order,
      get_manga_title_by_uuid,
      get_chapter_list_by_title,
      get_manga_by_title,
      get_chapter_by_title,
      set_manga_chapter_and_slide_by_title,
      set_manga_chapter_and_slide_from_state,
      get_manga_meta_by_title,
      delete_manga_by_uuid,
      update_manga_dir,
      change_reader_url,
      read_prefs,
      save_prefs,
      set_lang,
      set_reader_format,
      set_manga_format_by_title,
      set_discord_rich_presence_enabled,
      discord_set_activity,
      discord_clear_activity,
      set_reader_state,
      anilist_oauth_logout,
      anilist_update_manga
    ])
    .setup(|app| {

      let handle = app.handle();

      app.manage(PrefsStore::new());

      let prefs = app.state::<PrefsStore>();
      let prefs = tokio::task::block_in_place(
        || { tauri::async_runtime::block_on(prefs.0.lock()) }
      );

      app.manage(DeclarativeDiscordIpcClient::new(&*prefs.discord_app_id));

      if prefs.discord_rich_presence_enabled {
        let client = app.state::<DeclarativeDiscordIpcClient>();
        client.enable();
      } 

      app.manage(ReaderStore::new());

      create_dir_all(&prefs.manga_directory).unwrap();

      let prefs = app.state::<PrefsStore>();
      let prefs = Arc::clone(&prefs.0);

      tauri_plugin_deep_link::register(
        "tonbun",
        move |request| {

          let result = (|| -> Result<(), Box<dyn Error>> { 

            let url = Url::parse(&request)?;
            let domain = url.domain().ok_or("No domain")?; 
            let fragment = url.fragment().ok_or("No fragment")?;

            let token = queryst::parse(fragment).unwrap_or_default();

            let token = token
              .as_object()
              .ok_or("Fragment is not an object")?
              .get("access_token").ok_or("No token field")?
              .as_str()
              .ok_or("Token is not a string")?;

            let mut prefs = tokio::task::block_in_place(
              || { tauri::async_runtime::block_on(prefs.lock()) }
            );

            match domain {
              "anilist" => prefs.oauth.anilist.access_token = Some(token.to_string()),
              _ => Err("Wrong domain")?
            }

            handle.emit_all("update_prefs", prefs.clone()).unwrap();

            Ok(())

          })();

          if let Some(library) = handle.get_window("library") {
            library.set_focus().ok();
            match result {
              Ok(_) =>{ library.emit("success", "oauth.anilist.login").ok(); }
              Err(_) => { library.emit("error", "ouath.anilist.login").ok(); }
            }

          }
        },
      )
      .unwrap();

      Ok(())

    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
