import { IsEmail } from 'class-validator';
import { Form } from '../core/form';

export class SignInForm extends Form {
    @IsEmail()
    private email: string;

    constructor() {
        super();
    }
}
