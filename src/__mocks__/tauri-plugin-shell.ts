export class Command {
  constructor(_program: string, _args?: string[]) {}

  async execute(): Promise<{ code: number; stdout: string; stderr: string }> {
    return { code: 0, stdout: '', stderr: '' }
  }
}
