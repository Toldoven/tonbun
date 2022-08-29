use std::sync::{Arc, Mutex};

use tokio::time::{interval,  Duration};

use crate::DiscordIpcClient;

use crate::DiscordIpc;

#[derive(Debug)]
pub struct DiscordIpcClientMutex (pub Arc<Mutex<DiscordIpcClient>>);

impl DiscordIpcClientMutex {

    pub fn new(client_id: &str) -> DiscordIpcClientMutex {
        DiscordIpcClientMutex(
            Arc::new(
                Mutex::new(
                    DiscordIpcClient::new(client_id)
                    .unwrap()
                )   
            )
        )
    }

    pub fn enable(&self) {

        let mut lock = self.0.lock().unwrap();

        if lock.enabled { return }

        lock.enabled = true;

        let mut interval = interval(Duration::from_secs(1));

        let clone = Arc::clone(&self.0);

        tokio::spawn(async move { loop {

            interval.tick().await;

            let mut lock = clone.lock().unwrap();
            
            // println!("{:?}", lock);

            if !lock.enabled {
                if lock.connected && lock.close().is_ok() { println!("Closed Discord IPC client...") }
                break;
            }

            if lock.connected { continue };

            println!("Trying to connect..");

            if lock.connect().is_ok() { println!("Connected to Discord IPC client!") }

        }});

    }

    pub fn disable(&self) {

        let mut lock = self.0.lock().unwrap();

        lock.enabled = false;
    }
}