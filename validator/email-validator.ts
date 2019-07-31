import { IsEmail } from 'class-validator';

export default class EmailValidator {
    @IsEmail(
        {},
        {
            message: 'typecast.error.email.not_valid',
        },
    )
    public email: string = '';
}
