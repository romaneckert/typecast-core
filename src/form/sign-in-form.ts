import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Form } from '../core/form';

export class SignInForm extends Form {
    @IsEmail(
        {},
        {
            message: 'typecast.error.email.not_valid',
        },
    )
    public email: string = '';

    @IsNotEmpty({
        message: 'typecast.error.password.required',
    })
    public password: string = '';
}
