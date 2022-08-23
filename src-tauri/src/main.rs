#![windows_subsystem = "windows"]

mod tauri;
pub mod manga;
mod prefs;
pub mod connectors;

fn main() {
  prefs::run();
  tauri::run();
}
