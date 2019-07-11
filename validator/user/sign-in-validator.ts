import { IsEmail, IsNotEmpty } from 'class-validator';
import { EmailValidator } from '../email-validator';

export class UserSignInValidator extends EmailValidator {
    @IsNotEmpty({
        message: 'typecast.error.password.required',
    })
    public password: string = '';
}
