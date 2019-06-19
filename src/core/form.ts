import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { ValidationError } from './validation-error';

export class Form {
    public submitted: boolean = false;
    public valid: boolean = false;
    public errors: { [key: string]: ValidationError } = {};

    [key: string]: any;

    public async handle(data?: { [key: string]: any }): Promise<Form> {
        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) {
            return this;
        }

        // set form to status submitted
        this.submitted = true;

        for (const [key, value] of Object.entries(data)) {
            if (Object.keys(this).includes(key)) {
                this[key] = value;
            }
        }

        const validationErrors: ClassValidationError[] = await validate(this);

        for (const validationError of Object.values(validationErrors)) {
            const error = new ValidationError(
                validationError.property,
                validationError.value,
                validationError.constraints,
            );

            this.errors[validationError.property] = error;
        }

        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
        }

        return this;
    }
}
