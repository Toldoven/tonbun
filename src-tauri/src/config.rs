use tauri::api::path::{document_dir};
use std::fs::{create_dir_all, read_to_string, write};
use std::path::PathBuf;
use std::error::Error;
use serde::{Serialize, Deserialize};

pub fn manga_dir() -> PathBuf {
    let mut manga_dir = document_dir().unwrap();
    manga_dir.push("Mangas");
    manga_dir
}

pub fn manga_dir_title(title: &str) -> PathBuf {
    let mut manga_dir = document_dir().unwrap();
    manga_dir.push("Mangas");
    manga_dir.push(title);
    manga_dir
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Window {
    fullscreen: bool, 
    size: (i32, i32),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Windows {
    reader: Window,
    library: Window,
}

#[derive(Debug, Serialize, Deserialize)]
enum Direction {
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

#[derive(Debug, Serialize, Deserialize)]
pub struct Reader {
    direction: Direction,
    reverse: bool,
    animation: bool,
    animation_speed: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Prefs {
    lang: String,
    windows: Windows,
    reader: Reader,
}

impl Prefs {
    fn prefs_path() -> PathBuf {
        let mut prefs_path = manga_dir();
        prefs_path.push("prefs.toml");
        prefs_path
    }
    fn default() -> Prefs {
        Prefs {
            lang: "".to_string(),
            windows: Windows {
                reader: Window {
                    fullscreen: false,
                    size: (600, 900),
                },
                library: Window {
                    fullscreen: false,
                    size: (800, 600),
                },
            },
            reader: Reader {
                direction: Direction::Vertical,
                reverse: false,
                animation: true,
                animation_speed: 300,
            },
        }
    }
    pub fn read() -> Result<Prefs, Box<dyn Error>> {
        let prefs_path = Prefs::prefs_path();

        if !prefs_path.exists() {
            Prefs::write(Prefs::default())?;
        }

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
}

pub fn run() {

    let manga_dir = manga_dir();

    let result = create_dir_all(&manga_dir);

    match result {
        Ok(()) => {},
        Err(_) => {},
    }
    
}