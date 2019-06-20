import { validate, ValidationError as ClassValidationError } from 'class-validator';
import { ContainerAware } from './container-aware';
import { ValidationError } from './validation-error';

export class Form extends ContainerAware {
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
            this.errors[validationError.property] = new ValidationError(
                validationError.property,
                validationError.value,
                this.cleanContraints(validationError.constraints),
            );
        }

        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
        }

        return this;
    }

    public addError(constraints: { [key: string]: string }, property: string, value: string = '') {
        this.errors[property] = new ValidationError(property, value, this.cleanContraints(constraints));
        return this;
    }

    private cleanContraints(constraints: { [key: string]: string }): { [key: string]: string } {
        const cleanedConstraints: { [key: string]: string } = {};

        for (const [key, value] of Object.entries(constraints)) {
            cleanedConstraints[this.container.service.string.decamelize(key)] = value;
        }

        return cleanedConstraints;
    }
}
