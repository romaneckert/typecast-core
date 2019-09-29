import ServiceDecorator from '../decorator/service.decorator';
import StringUtil from '../util/string';

@ServiceDecorator()
export default class LoggerService {
    
    private _contextType: string;
    private _contextName: string;
    private _allowedTypes: string[] = ['controller', 'service', 'module'];

    public constructor(contextType: string, contextName: string) {
        contextType = contextType.toLowerCase();
        contextName = StringUtil.decamelize(contextName);

        if (!this._allowedTypes.includes(contextType)) {
            throw new Error(`type "${contextType}" is not allowed`);
        }

        this._contextType = contextType.toLowerCase();

        for (const type of this._allowedTypes) {
            contextName = contextName.replace('-' + type, '');
        }

        this._contextName = contextName;
    }

    public async emergency(message: string, data?: any): Promise<void> {
        await this.log(0, message, data);
    }

    public async alert(message: string, data?: any): Promise<void> {
        await this.log(1, message, data);
    }

    public async critical(message: string, data?: any): Promise<void> {
        await this.log(2, message, data);
    }

    public async error(message: string, data?: any): Promise<void> {
        await this.log(3, message, data);
    }

    public async warning(message: string, data?: any): Promise<void> {
        await this.log(4, message, data);
    }

    public async notice(message: string, data?: any): Promise<void> {
        await this.log(5, message, data);
    }

    public async info(message: string, data?: any): Promise<void> {
        await this.log(6, message, data);
    }

    public async debug(message: string, data?: any): Promise<void> {
        await this.log(7, message, data);
    }

    private async log(code: number, message: string, data?: any): Promise<void> {
        // console.log(code, message, this._contextType, this._contextName);
    }
}
