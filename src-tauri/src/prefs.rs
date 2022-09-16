use tauri::api::path::{document_dir, app_dir};
use std::fs::{read_to_string, write};
use std::path::PathBuf;
use std::error::Error;
use serde::{Serialize, Deserialize};
use tauri::generate_context;

use crate::manga::Format;

// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct Window {
//     pub fullscreen: bool,
//     pub x: i32,
//     pub y: i32,
// }

// impl Window {
//     pub fn new(fullscreen: bool, x: i32, y: i32) -> Window {
//         Window {
//             fullscreen,
//             x,
//             y,
//         }
//     }
// }

// #[derive(Clone, Debug, Serialize, Deserialize)]
// pub struct Windows {
//     pub reader: Window,
//     pub library: Window,
// }

#[derive(Clone, Debug, Serialize, Deserialize)]
pub enum Direction {
    Horizontal,
    Vertical,
}

// impl Direction {
//     fn as_str(&self) -> &'static str {
//         match self {
//             Direction::Horizontal => "horizontal",
//             Direction::Vertical => "vertical",
//         }
//     }
// }

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Reader {
    pub direction: Direction,
    pub reverse: bool,
    pub animation: bool,
    pub animation_speed: u32,
    pub default_format: Format,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Prefs {
    pub lang: String,
    pub manga_directory: PathBuf,
    pub discord_app_id: String,
    pub discord_rich_presence_enabled: bool,
    // pub windows: Windows,
    pub reader: Reader,
}

pub fn default_manga_dir() -> PathBuf {
    let mut manga_dir = document_dir().unwrap();
    manga_dir.push("Mangas");
    manga_dir
}



impl Prefs {
    fn prefs_path() -> PathBuf {
        let context = generate_context!();
        let mut prefs_path = app_dir(context.config()).unwrap();
        prefs_path.push("prefs.toml");
        prefs_path
    }
    fn default() -> Prefs {
        Prefs {
            lang: "".to_string(),
            manga_directory: default_manga_dir(),
            discord_app_id: "1012114766141075456".to_string(),
            discord_rich_presence_enabled: false,
            // windows: Windows {
            //     reader: Window::new(false, 600, 900),
            //     library: Window::new(false, 800, 600),
            // },
            reader: Reader {
                direction: Direction::Vertical,
                reverse: false,
                animation: true,
                animation_speed: 300,
                default_format: Format::Slides,
            },
        }
    }
    pub fn load() -> Result<Prefs, Box<dyn Error>> {
        let prefs_path = Prefs::prefs_path();

        if !prefs_path.exists() { Prefs::write(Prefs::default())?; }

        let read_prefs: Result<Prefs, toml::de::Error> = toml::from_str(read_to_string(&prefs_path)?.as_str());

        match read_prefs {
            Ok(result) => return Ok(result),
            Err(_) => println!("Failed to read prefs. Creating new prefs.toml"),
        }

        Prefs::write(Prefs::default())?;
        let prefs = toml::from_str(read_to_string(prefs_path)?.as_str())?;

        Ok(prefs)
    }
    pub fn write(prefs: Prefs) -> Result<(), Box<dyn Error>> {
        let prefs_path = Prefs::prefs_path();
        write(&prefs_path, toml::to_string(&prefs)?.as_bytes())?;

        Ok(())
    }
    // pub fn set_lang(&mut self, lang: &str) {
    //     self.lang = lang.to_string();
    // }
    // pub fn update_value(&mut self, key: &str, value: &dyn Any) {
    //     self[key] = value;
    // }
    pub fn save(&self) -> Result<(), Box<dyn Error>> {
        let prefs_path = Prefs::prefs_path();
        write(&prefs_path, toml::to_string(self)?.as_bytes())?;

        Ok(())
    }
}

// pub fn manga_dir() -> PathBuf {

//     let prefs = Prefs::load();

//     prefs.unwrap().manga_directory
// }

pub fn manga_dir_title(title: &str, manga_dir: &PathBuf) -> PathBuf {
    let mut manga_dir = PathBuf::from(manga_dir);
    manga_dir.push(title);
    manga_dir
}

// pub fn update_manga_dir(dir: PathBuf) {
//     create_dir_all(&dir).unwrap();
//     let mut prefs = Prefs::load().unwrap();
//     prefs.manga_directory = PathBuf::from(&dir);
//     prefs.save().unwrap();
// }

// pub fn run() {
//     let manga_dir = manga_dir();
//     create_dir_all(&manga_dir).unwrap();
// }