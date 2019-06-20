import { IsEmail } from 'class-validator';

export class UserEmailValidator {
    @IsEmail(
        {},
        {
            message: 'typecast.error.email.not_valid',
        },
    )
    public email: string = '';
}
