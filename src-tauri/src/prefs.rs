use tauri::api::path::{document_dir, config_dir};
use ts_rs::TS;
use std::fs::{read_to_string, write};
use std::path::PathBuf;
use std::error::Error;
use serde::{Serialize, Deserialize};

use crate::manga::Format;

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[serde(default)]
#[ts(export)]
pub struct Prefs {
    pub lang: String,
    pub manga_directory: PathBuf,
    pub discord_app_id: String,
    pub discord_rich_presence_enabled: bool,
    pub oauth: OAuth,
    pub reader: Reader,
}

impl Default for Prefs {
    fn default() -> Self {
        Self {
            lang: "".to_string(),
            manga_directory: Self::default_manga_dir(),
            discord_app_id: "1012114766141075456".to_string(),
            discord_rich_presence_enabled: false,
            oauth: OAuth {
                anilist: AniList {
                    client_id: "9388".to_string(),
                    access_token: None,
                },
                // myanimelist: None,
            },
            reader: Reader {
                direction: Direction::Vertical,
                reverse: false,
                animation: true,
                animation_speed: 300,
                default_format: Format::Slides,
            },
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct Reader {
    pub direction: Direction,
    pub reverse: bool,
    pub animation: bool,
    pub animation_speed: u32,
    pub default_format: Format,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct OAuth {
    pub anilist: AniList,
    // pub myanimelist: Option<String>
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct AniList {
    pub client_id: String,
    pub access_token: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, TS)]
#[ts(export)]
pub enum Direction {
    Horizontal,
    Vertical,
}

impl Prefs {
    fn prefs_path() -> PathBuf {
        let mut prefs_path = config_dir().unwrap();
        prefs_path.push("com.tonbun.dev");
        prefs_path.push("prefs.toml");
        prefs_path
    }
    fn default_manga_dir() -> PathBuf {
        let mut manga_dir = document_dir().unwrap();
        manga_dir.push("Mangas");
        manga_dir
    }
    pub fn load() -> Result<Prefs, Box<dyn Error>> {

        let prefs_path = Prefs::prefs_path();

        if !prefs_path.is_file() { Prefs::write(Prefs::default())?; }

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