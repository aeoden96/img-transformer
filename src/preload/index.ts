import { contextBridge, ipcRenderer, webUtils } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { OutputOptions } from 'sharp'

// Custom APIs for renderer
const api = {
  startDrag: (fileName: string) => ipcRenderer.send('ondragstart', fileName),
  convertImage: (params: {
    inputPath: string
    outputPath: string
    format: string
    options?: OutputOptions
  }): Promise<any> => ipcRenderer.invoke('convert-image', params),
  getFilePath: (file: File) => {
    const path = webUtils.getPathForFile(file)
    return path
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
