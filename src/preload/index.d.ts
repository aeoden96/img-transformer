import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      convertImage: (params: {
        inputPath: string
        format: string
        options?: sharp.OutputOptions
      }) => Promise<{
        success: boolean
        file: Buffer
      }>
      startDrag: (fileName: string) => void
      getFilePath: (file: File) => string
    }
  }
}
