#![windows_subsystem = "windows"]

mod tauri;
pub mod manga;
mod prefs;
pub mod connectors;
pub mod discord;

#[tokio::main]
async fn main() {
  tauri::run();
}
