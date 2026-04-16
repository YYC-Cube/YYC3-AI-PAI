declare module '@tauri-apps/plugin-shell' {
  interface CommandResult {
    code: number | null
    stdout: string
    stderr: string
  }

  class Command {
    constructor(program: string, args?: string[])
    execute(): Promise<CommandResult>
  }
}
