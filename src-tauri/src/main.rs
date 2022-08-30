#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod tauri;
pub mod manga;
mod prefs;
pub mod connectors;
pub mod discord;

// #[tokio::main]
fn main() {
  tauri::run();
}
