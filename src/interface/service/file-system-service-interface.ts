export interface IFileSystemService {
    remove(path: string): Promise<void>;
    isFile(path: string): Promise<boolean>;
    isSymbolicLink(path: string): Promise<boolean>;
    isDirectory(path: string): Promise<boolean>;
    isSymbolicLinkToDirectory(path: string): Promise<boolean>;
    ensureFileExists(path: string): Promise<void>;
    ensureDirExists(path: string): Promise<void>;
    appendFile(path: string, data: any): Promise<void>;
    readFile(path: string, options?: any): Promise<Buffer>;
    readDirectory(path: string): Promise<string[]>;
}
