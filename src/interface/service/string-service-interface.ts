export interface IStringService {
    camelize(text: string): string;
    decamelize(text: string, separator: string): string;
    cast(data: any): string;
}
