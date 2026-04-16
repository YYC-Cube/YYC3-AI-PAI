declare module '@tauri-apps/plugin-fs' {
  interface FileInfo {
    name: string
    path: string
    isFile: boolean
    isDirectory: boolean
    size?: number
    mtime?: number | null
    permissions?: { mode: number; readonly: boolean }
  }

  export function readTextFile(path: string): Promise<string>
  export function readFile(path: string): Promise<Uint8Array>
  export function writeFile(path: string, data: string | Uint8Array): Promise<void>
  export function removeFile(path: string): Promise<void>
  export function renameFile(oldPath: string, newPath: string): Promise<void>
  export function copyFile(src: string, dest: string): Promise<void>
  export function exists(path: string): Promise<boolean>
  export function stat(path: string): Promise<FileInfo>
  export function readDir(path: string): Promise<FileInfo[]>
  export function mkdir(path: string, options?: { recursive?: boolean }): Promise<void>

  // Tauri event types for file watching
  interface FsChangeEvent {
    type: 'create' | 'modify' | 'remove'
    paths: string[]
  }
}
