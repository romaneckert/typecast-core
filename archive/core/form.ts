import { validate, ValidationError as ClassValidationError } from 'class-validator';
import express from 'express';

import StringUtil from '../util/string';
import ValidationError from './validation-error';

export default class Form {
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

        await this.validate();

        return this;
    }

    public async validate(): Promise<void> {
        const validationErrors: ClassValidationError[] = await validate(this.data);

        for (const validationError of Object.values(validationErrors)) {
            for (const [key, message] of Object.entries(validationError.constraints)) {
                this.error(validationError.property, key, message, validationError.value);
            }
        }

        if (0 === Object.keys(this.errors).length) {
            this.valid = true;
        }
    }

    public async error(property: string, key: string = '', message: string = '', value: string = ''): Promise<void> {
        if (null === this.errors) {
            this.errors = {};
        }

        if ('string' !== typeof key || 0 === key.length) {
            key = 'data_process';
        }

        if ('string' !== typeof message || 0 === message.length) {
            message = 'typecast.error.data_process';
        }

        key = StringUtil.decamelize(key);

        if (undefined === this.errors[property]) {
            this.errors[property] = new ValidationError(property, value, { key: message });
        } else {
            this.errors[property].errors[key] = message;
        }

        this.valid = false;

        const orderedErrors: { [key: string]: ValidationError } = {};
        Object.keys(this.errors)
            .sort()
            .reverse()
            .forEach(k => {
                orderedErrors[k] = this.errors[k];
            });

        this.errors = orderedErrors;
    }
}
