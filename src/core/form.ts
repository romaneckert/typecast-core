export class Form {
    public submitted: boolean = false;
    public valid: boolean = false;
    public errors: { [key: string]: any } = {};

    private entity: any;
    private instance: any;

    [key: string]: any;

    constructor(instance?: any) {
        this.instance = instance;
    }

    public handle(data?: { [key: string]: any }): Form {
        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) {
            return this;
        }

        // set form to status submitted
        this.submitted = true;

        const cleanedData: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(data)) {
            if (Object.keys(this).includes(key)) {
                this[key] = value;
            }
        }

        return this;
    }
}
