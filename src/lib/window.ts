// import {invoke} from '@tauri-apps/api/tauri'
import { WindowManager } from '@tauri-apps/api/window'

export const addFullscreenEventListener = (window: Window, webview: WindowManager) => {
    window.addEventListener("keyup", async (e) => {
        if (e.key !== 'F11') return
        await webview.setFullscreen(!(await webview.isFullscreen()))
    })
}

// export const errorToast

// export const loadWindowPrefs = async (webview: WindowManager, prefs) => {
//     try {
//         let windowPrefs = prefs['windows'][webview.label.toLowerCase()]
//         await Promise.all([
//             webview.setSize(new LogicalSize(windowPrefs.x, windowPrefs.y)),
//             webview.setFullscreen(windowPrefs.fullscreen)
//         ])
//     } catch (e) {
//         console.error(e)
//     }
// }

// export const saveWindowPrefs = async (webview: WindowManager) => {

//     const size = await webview.innerSize()

//     await invoke('set_window_prefs', {
//         label: webview.label.toLowerCase(),
//         window: {
//             fullscreen: await webview.isFullscreen(),
//             x: size.width,
//             y: size.height,
//         }
//     })

// }

