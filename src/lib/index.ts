import { invoke } from "@tauri-apps/api"

const msg = (message: string) => invoke('message', { message })

const fileName = (path: String) => path.split('/').pop()

export { msg, fileName }