use crate::manga::Format;
use crate::prefs::Prefs;
// use crate::discord::discord_ipc_start_interval;

use crate::manga;
use crate::connectors::mangadex::MangaDex;
use std::env;
use std::fs::create_dir_all;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::Mutex;
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

#[tauri::command(async)]
fn get_manga_cards(prefs: State<'_, PrefsStore>) -> Vec<manga::MangaCard> {
  manga::get_manga_cards(&prefs.manga_dir())
}

#[tauri::command(async)]
fn get_chapter_by_title(title: &str, chapter: &str, prefs: State<'_, PrefsStore>) -> manga::Chapter {
  manga::get_chapter_by_title(title, chapter, &prefs.manga_dir())
}

#[tauri::command(async)]
fn get_chapter_list_by_title(title: String, prefs: State<'_, PrefsStore>) -> Vec<String> {
  manga::get_chapter_list_by_title(title, &prefs.manga_dir())
}

#[tauri::command(async)]
fn get_manga_title_by_uuid(uuid: &str, prefs: State<'_, PrefsStore>) -> String {
  manga::get_manga_title_by_uuid(Uuid::parse_str(uuid).unwrap(), &prefs.manga_dir())
}

#[tauri::command(async)]
fn get_manga_meta_by_title(title: &str, prefs: State<'_, PrefsStore>) -> manga::MangaMeta {
  manga::get_manga_meta_by_title(title, &prefs.manga_dir())
}

#[tauri::command(async)]
fn delete_manga_by_uuid(uuid: &str, prefs: State<'_, PrefsStore>) {
  manga::delete_manga_by_uuid(Uuid::parse_str(uuid).unwrap(), &prefs.manga_dir())
}

#[tauri::command(async)]
fn set_manga_chapter_and_slide_by_title(title: &str, chapter: &str, slide: i32, prefs: State<'_, PrefsStore>) {
  match manga::set_manga_chapter_and_slide_by_title(title, chapter, slide, &prefs.manga_dir()) {
    Ok(()) => println!("Updated chapter ({}) and slide ({}) of {}", chapter, slide, title),
    Err(e) => println!("Failed to update chapter and slide of {}, ({})", title, e),
  }
}


#[tauri::command(async)]
fn set_manga_chapter_and_slide_from_state(reader: State<'_, ReaderStore>, prefs: State<'_, PrefsStore>) {
  let lock = reader.0.lock().unwrap();
  manga::set_manga_chapter_and_slide_by_title(
    lock.title.as_str(), 
    lock.chapter.as_str(), 
    lock.slide,
    &prefs.manga_dir()
  ).ok();
  // println!("{:?}", result);
}


#[tauri::command(async)]
fn set_reader_state(title: &str, chapter: &str, slide: i32, reader: State<'_, ReaderStore>) {
  reader.set(title, chapter, slide);
}

#[tauri::command(async)]
fn set_manga_format_by_title(title: &str, format: Format, prefs: State<'_, PrefsStore>, window: tauri::Window) {
  match manga::set_manga_format_by_title(title, format, &prefs.manga_dir(), window) {
    Ok(()) => println!("Updated format"),
    Err(_) => println!("Failed to update format"),
  }
}

#[tauri::command(async)]
fn update_manga_order(order_list: Vec<manga::UuidOrderIndex>, prefs: State<'_, PrefsStore>) {
  match manga::update_manga_order(order_list, &prefs.manga_dir()) {
    Ok(()) => println!("Updated manga order"),
    Err(_) => println!("Failed to update manga order"),
  }
}

#[tauri::command]
fn search_title(query: String, lang: String) -> Result<Value, String> {
    return match MangaDex::search(query, lang) {
        Ok(result) => Ok(result["data"].clone()),
        Err(_) => Err("No connection".into()),
    }
}

#[tauri::command]
fn download_manga(uuid: String, lang: String, title: String, prefs: State<'_, PrefsStore>, window: tauri::Window) {
  let prefs = prefs.0.lock().unwrap();
  let manga_directory = PathBuf::from(&prefs.manga_directory);

  std::thread::spawn(move || {
    let result = MangaDex::download_manga(&uuid, &lang, &title, &manga_directory, &window);
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
fn update_manga_dir(dir: PathBuf, prefs: State<'_, PrefsStore>, window: tauri::Window) {
  create_dir_all(&dir).unwrap();

  let mut prefs = prefs.0.lock().unwrap();
  prefs.manga_directory = PathBuf::from(&dir);
  window.emit_all("update_prefs", prefs.clone()).unwrap();
}

#[tauri::command]
fn change_reader_url(url: String, app_handle: tauri::AppHandle) {
  let window = app_handle.get_window("reader").unwrap();
  let js = format!("window.location.replace('{}')", url);
  let _ = window.eval(js.as_str());
}

// Pefs

#[tauri::command(async)]
fn read_prefs(prefs: State<'_, PrefsStore>) -> Prefs {
  prefs.0.lock().unwrap().clone()
}

#[tauri::command(async)]
fn set_lang(lang: String, prefs: State<'_, PrefsStore>, window: tauri::Window) {
  let mut prefs = prefs.0.lock().unwrap();
  prefs.lang = lang;
  window.emit_all("update_prefs", prefs.clone()).unwrap();
}

#[tauri::command(async)]
fn set_reader_format(format: Format, prefs: State<'_, PrefsStore>, window: tauri::Window) {
  let mut prefs = prefs.0.lock().unwrap();
  prefs.reader.default_format = format;
  window.emit_all("update_prefs", prefs.clone()).unwrap();
}


#[tauri::command(async)]
fn set_discord_rich_presence_enabled(value: bool, prefs: State<'_, PrefsStore>, client: State<'_, DeclarativeDiscordIpcClient>, window: tauri::Window) {
  
  let mut prefs = prefs.0.lock().unwrap();
  prefs.discord_rich_presence_enabled = value;

  window.emit_all("update_prefs", prefs.clone()).unwrap();

  if value {
    client.enable()
  } else {
    client.disable()
  }
}

// #[tauri::command(async)]
// fn set_window_prefs(label: String, window: prefs::Window, prefs: State<'_, PrefsStore>, webview: tauri::Window) {
//   let mut prefs = prefs.0.lock().unwrap();
//   if label == "reader" { prefs.windows.reader = window.clone() };
//   if label == "library" { prefs.windows.library = window.clone() };
//   webview.emit_all("update_prefs", prefs.clone()).unwrap();
// }

#[tauri::command(async)]
fn save_prefs(prefs: State<'_, PrefsStore>) -> Result<(), String> {
  let prefs = prefs.0.lock().unwrap();
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

  fn manga_dir(&self) -> PathBuf {
    let lock = self.0.lock().unwrap();
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
  pub fn set(&self, title: &str, chapter: &str, slide: i32) {
    let mut lock = self.0.lock().unwrap();
    lock.title = title.to_string();
    lock.chapter = chapter.to_string();
    lock.slide = slide;
  }
}



// Run

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_persisted_scope::init())
    .plugin(tauri_plugin_window_state::Builder::default().set_auto_show(false).build())
    .invoke_handler(tauri::generate_handler![
      message,
      search_title,
      download_manga,
      get_manga_cards,
      update_manga_order,
      get_manga_title_by_uuid,
      get_chapter_list_by_title,
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
      set_reader_state
    ])
    .setup(|app| {

      app.manage(PrefsStore::new());

      let prefs = app.state::<PrefsStore>();
      let prefs = prefs.0.lock().unwrap();

      app.manage(DeclarativeDiscordIpcClient::new(&*prefs.discord_app_id));

      if prefs.discord_rich_presence_enabled {
        let client = app.state::<DeclarativeDiscordIpcClient>();
        client.enable();
      } 

      app.manage(ReaderStore::new());

      create_dir_all(&prefs.manga_directory).unwrap();

      Ok(())

    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
