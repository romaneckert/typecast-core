import { validate, ValidationError as ClassValidationError } from 'class-validator';
import express from 'express';

import { StringUtil } from '../util/string';
import { ValidationError } from './validation-error';

export class Form {
    public submitted: boolean = false;
    public valid: boolean = false;
    public errors: { [key: string]: ValidationError } = {};
    public data: any;

    public constructor(validator: any) {
        this.data = validator;
    }

    public async handle(req: express.Request): Promise<Form> {
        this.errors = {};

        const data = req.body;

        // test if data is empty
        if ('object' !== typeof data || 0 === Object.keys(data).length) {
            return this;
        }

        // set form to status submitted
        this.submitted = true;

        for (const [key, value] of Object.entries(data)) {
            if (Object.keys(this.data).includes(key)) {
                this.data[key] = value;
            }
        }

        const validationErrors: ClassValidationError[] = await validate(this.data);

        for (const validationError of Object.values(validationErrors)) {
            this.addError(validationError.constraints, validationError.property, validationError.value);
        }

        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
        }

        return this;
    }

    public addError(constraints: { [key: string]: string }, property: string, value: string = ''): void {
        if (null === this.errors) {
            this.errors = {};
        }

        this.errors[property] = new ValidationError(property, value, this.cleanContraints(constraints));
        this.valid = false;

        const orderedErrors: { [key: string]: ValidationError } = {};
        Object.keys(this.errors)
            .sort()
            .reverse()
            .forEach(key => {
                orderedErrors[key] = this.errors[key];
            });

        this.errors = orderedErrors;
    }

    private cleanContraints(constraints: { [key: string]: string }): { [key: string]: string } {
        const cleanedConstraints: { [key: string]: string } = {};

        for (const [key, value] of Object.entries(constraints)) {
            cleanedConstraints[StringUtil.decamelize(key)] = value;
        }

        return cleanedConstraints;
    }
}
