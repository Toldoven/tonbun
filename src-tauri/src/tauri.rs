use crate::manga::Format;
use crate::prefs::Prefs;
use crate::prefs;
// use crate::discord::discord_ipc_start_interval;

use crate::manga;
use crate::connectors::mangadex::MangaDex;
use std::env;
use std::fs::create_dir_all;
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::Mutex;
use tauri::Manager;
use discord_rich_presence::activity::Assets;
use discord_rich_presence::activity::Timestamps;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use tauri::State;
// use tokio::time::{interval, Duration};
use uuid::{Uuid};
use discord_rich_presence::{activity::Activity, DiscordIpc, DiscordIpcClientMutex};

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
fn get_manga_cards() -> Vec<manga::MangaCard> {
  manga::get_manga_cards()
}

#[tauri::command(async)]
fn get_chapter_by_title(title: &str, chapter: &str) -> manga::Chapter {
  manga::get_chapter_by_title(title, chapter)
}

#[tauri::command(async)]
fn get_chapter_list_by_title(title: String) -> Vec<String> {
  manga::get_chapter_list_by_title(title)
}

#[tauri::command(async)]
fn get_manga_title_by_uuid(uuid: &str) -> String {
  manga::get_manga_title_by_uuid(Uuid::parse_str(uuid).unwrap())
}

#[tauri::command(async)]
fn get_manga_meta_by_title(title: &str) -> manga::MangaMeta {
  manga::get_manga_meta_by_title(title)
}

#[tauri::command(async)]
fn delete_manga_by_uuid(uuid: &str) {
  manga::delete_manga_by_uuid(Uuid::parse_str(uuid).unwrap())
}

#[tauri::command(async)]
fn set_manga_chapter_and_slide_by_title(title: &str, chapter: &str, slide: i32) {
  match manga::set_manga_chapter_and_slide_by_title(title, chapter, slide) {
    Ok(()) => println!("Updated chapter ({}) and slide ({}) of {}", chapter, slide, title),
    Err(_) => println!("Failed to update chapter and slide of {}", title),
  }
}

#[tauri::command(async)]
fn set_manga_format_by_title(title: &str, format: Format, window: tauri::Window) {
  match manga::set_manga_format_by_title(title, format, window) {
    Ok(()) => println!("Updated format"),
    Err(_) => println!("Failed to update format"),
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
    return match MangaDex::search(query, lang) {
        Ok(result) => Ok(result["data"].clone()),
        Err(_) => Err("No connection".into()),
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

// #[tauri::command(async)]
// fn load_prefs() -> prefs::Prefs {
//   prefs::Prefs::read().unwrap()
// }

// #[tauri::command(async)]
// fn save_prefs(prefs: prefs::Prefs) {
//   match prefs::Prefs::write(prefs) {
//     Ok(()) => println!("Updated prefs"),
//     Err(_) => println!("Failed to update prefs"),
//   }
// }

#[tauri::command(async)]
fn update_manga_dir(dir: PathBuf) {
  prefs::update_manga_dir(dir);
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
fn set_discord_rich_presence_enabled(value: bool, prefs: State<'_, PrefsStore>, client: State<'_, DiscordIpcClientMutex>, window: tauri::Window) {
  
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
// fn set_discord_rich_presence_enabled(value: bool, prefs: State<'_, PrefsStore>, window: tauri::Window) {
//   let mut prefs = prefs.0.lock().unwrap();
//   prefs.lang = lang;
//   window.emit_all("update_prefs", prefs.clone()).unwrap();
// }

#[tauri::command(async)]
fn set_window_prefs(label: String, window: prefs::Window, prefs: State<'_, PrefsStore>, webview: tauri::Window) {
  let mut prefs = prefs.0.lock().unwrap();
  if label == "reader" { prefs.windows.reader = window.clone() };
  if label == "library" { prefs.windows.library = window.clone() };
  webview.emit_all("update_prefs", prefs.clone()).unwrap();
}

#[tauri::command(async)]
fn save_prefs(prefs: State<'_, PrefsStore>) {
  let prefs = prefs.0.lock().unwrap();
  match prefs.save() {
    Ok(_) => println!("Saved Prefs: {:?}", prefs),
    Err(_) => println!("Couldn't save Prefs: {:?}", prefs),
  }
}

// Discord RP 

// #[tauri::command(async)]
// fn discord_rich_presence_enable(client: State<'_, DiscordIpcClientMutex>) {
//   let mut prefs = prefs.0.lock().unwrap();

//   prefs.discord_rich_presence_enabled = true;

//   window.emit_all("update_prefs", prefs.clone()).unwrap();

//   client.enable();
// }

// #[tauri::command(async)]
// fn discord_rich_presence_disable(client: State<'_, DiscordIpcClientMutex>) {
//   client.disable()
// }

#[tauri::command(async)]
fn discord_set_activity(
  details: &str,
  state: &str,
  timestamp: i64,
  image: &str,
  client: State<'_, DiscordIpcClientMutex>
) -> Result<(), ()> {

  let mut client = client.0.lock().unwrap();
  
  let res = client.set_activity_safe(Activity::new()
    .state(state)
    .details(details)
    .timestamps(Timestamps::new().start(timestamp))
    .assets(Assets::new().large_image(image))
  );

  println!("{:?}", res);

  Ok(())

}

#[tauri::command(async)]
fn discord_clear_activity(client: State<'_, DiscordIpcClientMutex>) -> Result<(), ()> {
  let mut client = client.0.lock().unwrap();

  client.clear_activity_safe().ok();

  Ok(())

}

// #[tauri::comand(async)]
// fn set_format_by_title() {


  
// }

// #[tauri::command(async)]
// async fn discord_start_interval(client: State<'_, DiscordRP>, prefs: State<'_, PrefsStore>) -> Result<(), ()> {

//   let mut interval = interval(Duration::from_secs(1));

//   loop {

//     interval.tick().await;

//     let prefs = prefs.0.lock().unwrap();
//     let mut client = client.0.lock().unwrap();

//     if !prefs.discord_rich_presence_enabled {
//       if client.connected && client.close().is_ok() { println!("Closed Discord IPC client...") }
//       continue;
//     }

//     if client.connected { continue };

//     if client.connect().is_ok() { println!("Connected to Discord IPC client!") }

//   }

// }

// async fn discord_start_interval(client: State<'_, DiscordRP>) {

//   let mut interval = interval(Duration::from_secs(1));

//   loop {

//     interval.tick().await;

//     println!("Tick");

//     let mut client = client.0.lock().unwrap();

//     if client.socket.is_some() { continue };

//     match client.connect() {
//       Ok(_) => println!("Opened Discord IPC client"),
//       Err(_) => println!("Failed to open Discord IPC client"),
//     }

//     match client.set_activity(Activity::new()
//       .state("foo")
//       .details("bar") 
//     ) {
//       Ok(_) => println!("Set activity"),
//       Err(_) => println!("Failed to set activity"),
//     }

//   }

// }

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
}

// #[derive(Debug)]
// pub struct DiscordRP(Arc<Mutex<DiscordIpcClient>>);

// impl DiscordRP {
//   pub fn new(client_id: &str) -> DiscordRP {
//     DiscordRP(
//       Arc::new(
//         Mutex::new(
//           DiscordIpcClient::new(client_id)
//           .unwrap()
//         )
//       )
//     )
//   }
// }

// Run

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_persisted_scope::init())
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
      get_manga_meta_by_title,
      delete_manga_by_uuid,
      update_manga_dir,
      change_reader_url,
      read_prefs,
      save_prefs,
      set_lang,
      set_reader_format,
      set_window_prefs,
      set_manga_format_by_title,
      set_discord_rich_presence_enabled,
      discord_set_activity,
      discord_clear_activity
    ])
    .setup(|app| {

      let manga_dir = prefs::manga_dir();
      create_dir_all(&manga_dir).unwrap();

      app.manage(PrefsStore::new());

      let prefs = app.state::<PrefsStore>();
      let prefs = prefs.0.lock().unwrap();

      app.manage(DiscordIpcClientMutex::new(&*prefs.discord_app_id));

      if prefs.discord_rich_presence_enabled {
        let client = app.state::<DiscordIpcClientMutex>();
        client.enable();
      } 

      Ok(())

    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
