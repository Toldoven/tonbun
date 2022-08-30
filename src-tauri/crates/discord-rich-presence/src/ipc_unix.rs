use crate::discord_ipc::DiscordIpc;
use serde_json::json;
// use tokio::time::{interval, Duration};
use std::os::unix::net::UnixStream;
// use std::sync::{Arc, Mutex};
use std::{
    env::var,
    error::Error,
    io::{Read, Write},
    net::Shutdown,
    path::PathBuf,
};

// Environment keys to search for the Discord pipe
const ENV_KEYS: [&str; 4] = ["XDG_RUNTIME_DIR", "TMPDIR", "TMP", "TEMP"];

type Result<T> = std::result::Result<T, Box<dyn Error>>;

#[allow(dead_code)]
/// A wrapper struct for the functionality contained in the
/// underlying [`DiscordIpc`](trait@DiscordIpc) trait.
#[derive(Debug)]
pub struct DiscordIpcClient {
    /// Client ID of the IPC client.
    pub client_id: String,
    // Check if the client is connected
    pub enabled: bool,
    pub connected: bool,
    socket: Option<UnixStream>,
}

unsafe impl Send for DiscordIpcClient {}
unsafe impl Sync for DiscordIpcClient {}

impl DiscordIpcClient {
    /// Creates a new `DiscordIpcClient`.
    ///
    /// # Examples
    /// ```
    /// let ipc_client = DiscordIpcClient::new("<some client id>")?;
    /// ```
    pub fn new(client_id: &str) -> Result<Self> {
        let client = Self {
            client_id: client_id.to_string(),
            connected: false,
            enabled: false,
            socket: None,
        };

        Ok(client)
    }

    fn get_pipe_pattern() -> PathBuf {
        let mut path = String::new();

        for key in &ENV_KEYS {
            match var(key) {
                Ok(val) => {
                    path = val;
                    break;
                }
                Err(_e) => continue,
            }
        }
        PathBuf::from(path)
    }
}

impl DiscordIpc for DiscordIpcClient {
    fn connect_ipc(&mut self) -> Result<()> {
        for i in 0..10 {
            let path = DiscordIpcClient::get_pipe_pattern().join(format!("discord-ipc-{}", i));

            match UnixStream::connect(&path) {
                Ok(socket) => {
                    self.socket = Some(socket);
                    return Ok(());
                }
                Err(_) => continue,
            }
        }

        Err("Couldn't connect to the Discord IPC socket".into())
    }

    fn write(&mut self, data: &[u8]) -> Result<()> {
        let socket = self.socket.as_mut().expect("Client not connected");

        socket.write_all(data)?;

        Ok(())
    }

    fn read(&mut self, buffer: &mut [u8]) -> Result<()> {
        let socket = self.socket.as_mut().unwrap();

        socket.read_exact(buffer)?;

        Ok(())
    }

    fn close(&mut self) -> Result<()> {
        let data = json!({});
        if self.send(data, 2).is_ok() {}

        let socket = self.socket.as_mut().unwrap();

        socket.flush()?;
        match socket.shutdown(Shutdown::Both) {
            Ok(()) => (),
            Err(_err) => (),
        };

        self.connected = false;

        Ok(())
    }

    // fn test(&self) {
    //     println!("Pepega")
    // }

    // fn enable(&self, this: Arc<Mutex<Self>>) {

    //     if this.lock().unwrap().enabled { return }

    //     let mut interval = interval(Duration::from_secs(1));

    //     tokio::spawn(async move { loop {

    //         interval.tick().await;

    //         let mut lock = this.lock().unwrap();

    //         if lock.get_connected() { continue };

    //         if lock.connect().is_ok() { println!("Connected to Discord IPC client!") }

    //     }});
    // }

    fn get_client_id(&self) -> &String {
        &self.client_id
    }

    fn set_connected(&mut self, connected: bool) {
        self.connected = connected;
    }

    fn get_connected(&self) -> bool {
        self.connected
    }

    fn get_enabled(&self) -> bool {
        self.enabled
    }

}
