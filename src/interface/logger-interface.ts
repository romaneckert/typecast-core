import { Connection } from 'typeorm';

export interface ILogger {
    emergency(message: string, data?: any): Promise<void>;
    alert(message: string, data?: any): Promise<void>;
    critical(message: string, data?: any): Promise<void>;
    error(message: string, data?: any): Promise<void>;
    warning(message: string, data?: any): Promise<void>;
    notice(message: string, data?: any): Promise<void>;
    info(message: string, data?: any): Promise<void>;
    debug(message: string, data?: any): Promise<void>;
}
