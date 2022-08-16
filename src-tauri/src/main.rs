#![windows_subsystem = "windows"]

mod tauri;
pub mod manga;
mod config;
pub mod connectors;

fn main() {
  config::run();
  tauri::run();
}
