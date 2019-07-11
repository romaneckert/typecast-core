export class ValidationError {
    public property: string;
    public value: string;
    public errors: { [key: string]: string };

    constructor(property: string, value: string, errors: { [key: string]: string }) {
        this.property = property;
        this.value = value;
        this.errors = errors;
    }
}
