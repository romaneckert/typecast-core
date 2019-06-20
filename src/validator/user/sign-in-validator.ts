import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSignInValidator {
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
