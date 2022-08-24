import {invoke} from '@tauri-apps/api/tauri'
import {LogicalSize, WindowManager} from '@tauri-apps/api/window'

export const addFullscreenEventListener = (window: Window, webview: WindowManager) => {
    window.addEventListener("keyup", async (e) => {
        if (e.key !== 'F11') return
        await webview.setFullscreen(!(await webview.isFullscreen()))
    })
}

const checkWindowPrefs = async (webview: WindowManager) => {
    const prefs: any = await invoke('load_prefs')
    if (!prefs['windows'][webview.label.toLowerCase()]) return undefined
    return prefs
}

export const loadWindowPrefs = async (webview: WindowManager) => {
    const prefs = await checkWindowPrefs(webview)
    if (!prefs) return

    let windowPrefs = prefs['windows'][webview.label.toLowerCase()]

    await Promise.all([
        webview.setSize(new LogicalSize(windowPrefs.size[0], windowPrefs.size[1])),
        webview.setFullscreen(windowPrefs.fullscreen)
    ])
}

export const saveWindowPrefs = async (webview: WindowManager) => {
    let prefs = await checkWindowPrefs(webview)
    if (!prefs) return

    let windowPrefs = prefs['windows'][webview.label.toLowerCase()]
    const fullscreen = await webview.isFullscreen()
    const size = await webview.innerSize()

    let settingsChanged: boolean = false

    if (windowPrefs.fullscreen != fullscreen) {
        windowPrefs['fullscreen'] = !windowPrefs.fullscreen
        settingsChanged = true
    }

    if (windowPrefs.size[0] != size.width || windowPrefs.size[1] != size.height) {
        windowPrefs['size'] = [size.width, size.height]
        settingsChanged = true
    }

    if (settingsChanged) {
        prefs['windows'][webview.label.toLowerCase()] = windowPrefs
        await invoke('save_prefs', {prefs: prefs})
    }
}

