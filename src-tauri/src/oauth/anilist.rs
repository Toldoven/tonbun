
use std::error::Error;
use reqwest::Client;
use serde_json::{value::Value, json};

type Result<T> = std::result::Result<T, Box<dyn Error>>;

trait HandleErrors {
    fn handle_errors(self) -> Result<Value>;
}

impl HandleErrors for Value {
    fn handle_errors(self) -> Result<Value> {
        if let Some(errors) = self.get("errors") {
            let errors: Vec<&str> = errors
                .as_array()
                .ok_or("Errors is not an array")?
                .iter()
                .map(|error| -> Option<&str> {
                    error.get("message")?.as_str()
                })
                .map(|error| -> &str {
                    error.unwrap_or("Unknown error")
                })
                .collect();
            if errors.contains(&"Invalid token") { Err("Invalid token")? } else { Err(errors[0])? }
        }
        Ok(self)
    }
}

async fn get_progress_and_id(anilist_manga_id: &str, access_token: &str) -> Result<Value> {
    let query: &str = r#"
    mutation ($mediaId: Int) {
        SaveMediaListEntry (mediaId: $mediaId) {
            id
            status
            progress
            media {
                chapters
                volumes
            }
        }
    }
    "#;

    let body = serde_json::to_string(
        &json!({
            "query": query,
            "variables": {
                "mediaId": anilist_manga_id
            }
        })
    )?;

    let client = Client::new();

    let data = client.post("https://graphql.anilist.co")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .body(body)
        .send()
        .await?
        .json()
        .await?;

    Ok(data)
}

async fn update_progress_and_status(id: i64, access_token: &str, progress: i64, status: &str) -> Result<Value> {
    let query: &str = r#"
    mutation ($id: Int, $progress: Int, $status: MediaListStatus) {
        SaveMediaListEntry (id: $id, progress: $progress, status: $status) {
            id
            status
            progress
        }
    }
    "#;

    let body = serde_json::to_string(
        &json!({
            "query": query,
            "variables": {
                "id": id,
                "progress": progress,
                "status": status
            }
        })
    )?;

    let client = Client::new();

    let data = client.post("https://graphql.anilist.co")
        .header("Authorization", format!("Bearer {}", access_token))
        .header("Content-Type", "application/json")
        .header("Accept", "application/json")
        .body(body)
        .send()
        .await?
        .json()
        .await?;

    Ok(data)
}

pub async fn update(anilist_manga_id: &str, access_token: &str, progress: i64) -> Result<Value> {

    let data = get_progress_and_id(anilist_manga_id, access_token)
        .await?
        .handle_errors()?;

    let (current_progress, id, mut status, chapters) = (|| -> Option<(i64, i64, &str, Option<i64>)> {
        let entry = data
            .get("data")?
            .get("SaveMediaListEntry")?;
        Some((
            entry.get("progress")?.as_i64()?,
            entry.get("id")?.as_i64()?,
            entry.get("status")?.as_str()?,
            (|| -> Option<i64> { entry.get("media")?.get("chapters")?.as_i64() })()
        ))
    })().ok_or("Failed to parse data")?;

    if current_progress >= progress { Err("Progress is bigger than or equals to current progress")? }

    if status == "COMPLETED" { Err("Manga is already completed")?  }

    if ["PAUSED", "DROPPED", "PLANNING"].contains(&status) {
        status = "CURRENT";
    }

    if status == "CURRENT" {
        if let Some(chapters) = chapters {
            if progress >= chapters { status = "COMPLETED"; }
        }
    }

    let data = update_progress_and_status(id, access_token, progress, status)
        .await?
        .handle_errors()?;

    Ok(data)
}
// #[test]
// fn test() -> Result<()> {
//     let prefs = Prefs::load()?;
//     let access_token = prefs.oauth.anilist.access_token.ok_or("No anilist token")?;

//     let anilist_manga_id = "30656";
//     let progress: i64 = 2;

//     let result = update(anilist_manga_id, access_token.as_str(), progress);

//     // if let Err(error) = &result {
//     //     let string = error.to_string();

//     // }

//     dbg!(result)?;

//     Ok(())
// }

