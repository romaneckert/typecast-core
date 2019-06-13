import { ILogger } from '../interface/logger-interface';

export class LoggerService implements ILogger {

  public type: string
  public name: string

  public constructor(type: string, name: string) {
    this.type = type
    this.name = name
  }

  public start() {
    // TODO: check and create directories
  }

  public log(message: string): boolean {
    // console.log(message)
    return true
  }
}
