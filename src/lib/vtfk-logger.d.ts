declare module '@vtfk/logger' {
  export type Levels = 'silly' | 'debug' | 'verbose' | 'info' | 'warn' | 'error'

  export function logger (
    level: Levels,
    message: string[] | string
  ): void
}
