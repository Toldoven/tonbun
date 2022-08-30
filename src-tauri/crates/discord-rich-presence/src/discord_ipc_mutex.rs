use std::{sync::{Arc, Mutex}, thread, time::Duration};
use crate::{DiscordIpc, DiscordIpcClient};

#[derive(Debug)]
pub struct DiscordIpcClientMutex (pub Arc<Mutex<DiscordIpcClient>>);

impl DiscordIpcClientMutex {

    pub fn new(client_id: &str) -> DiscordIpcClientMutex {

        let client = DiscordIpcClientMutex(
            Arc::new(
                Mutex::new(
                    DiscordIpcClient::new(client_id)
                    .unwrap()
                )   
            )
        );

        client.start_loop();

        client

    }


    pub fn enable(&self) {

        let mut lock = self.0.lock().unwrap();

        if lock.enabled { return }

        lock.enabled = true;
    }

    pub fn disable(&self) {

        let mut lock = self.0.lock().unwrap();

        if !lock.enabled { return }

        lock.enabled = false;
    }

    fn start_loop(&self) {

        let clone = Arc::clone(&self.0);

        thread::spawn(move || { loop {

            let mut lock = clone.lock().unwrap();

            if !lock.enabled {
                if lock.connected && lock.close().is_ok() { println!("Closed Discord IPC client...") }
                continue;
            }

            if lock.connected { continue };

            if lock.connect().is_ok() { println!("Connected to Discord IPC client!") }

            thread::sleep(Duration::from_secs(1));

        }});

    }

}

// #[derive(Debug)]
// pub struct DiscordIpcClientMutex (pub Arc<Mutex<DiscordIpcClient>>);

// impl DiscordIpcClientMutex {

//     pub fn new(client_id: &str) -> DiscordIpcClientMutex {
//         DiscordIpcClientMutex(
//             Arc::new(
//                 Mutex::new(
//                     DiscordIpcClient::new(client_id)
//                     .unwrap()
//                 )   
//             )
//         )
//     }

//     pub fn enable(&self) {

//         let mut lock = self.0.lock().unwrap();

//         if lock.enabled { return }

//         lock.enabled = true;

//         let mut interval = interval(Duration::from_secs(1));

//         let clone = Arc::clone(&self.0);

//         tokio::spawn(async move { loop {

//             interval.tick().await;

//             let mut lock = clone.lock().unwrap();
            
//             // println!("{:?}", lock);

//             if !lock.enabled {
//                 if lock.connected && lock.close().is_ok() { println!("Closed Discord IPC client...") }
//                 break;
//             }

//             if lock.connected { continue };

//             println!("Trying to connect..");

//             if lock.connect().is_ok() { println!("Connected to Discord IPC client!") }

//         }});

//     }

//     pub fn disable(&self) {

//         let mut lock = self.0.lock().unwrap();

//         lock.enabled = false;
//     }
// }