import { IObjectLiteral } from './object-literal';

export class Form {
    public submitted: boolean = false;
    public valid: boolean = false;
    public errors: string[];

    private entity: any;
    private instance: any;

    [key: string]: any;

    constructor(instance?: any) {
        this.instance = instance;
    }

    public handle(data?: IObjectLiteral): Form {
        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) {
            return this;
        }

        // set form to status submitted
        this.submitted = true;

        const cleanedData: IObjectLiteral = {};

        for (const [key, value] of Object.entries(data)) {
            if (Object.keys(this).includes(key)) {
                this[key] = value;
            }
        }

        return this;
    }
}
