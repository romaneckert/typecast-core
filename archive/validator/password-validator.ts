import { Matches, MaxLength, MinLength } from 'class-validator';

export default class PasswordValidator {
    @Matches(/\d/, {
        message: 'typecast.error.password.one_number_required',
    })
    @Matches(/[a-zA-ZöäüÖÜA]/, {
        message: 'typecast.error.password.one_letter_required',
    })
    @Matches(/[\@\^\#\(\)\[\]\{\}\?\!\$\%\&\/\=\*\+\~\,\.\;\:\<\>\-\_]/, {
        message: 'typecast.error.password.one_special_char_required',
    })
    @MinLength(8, {
        message: 'typecast.error.password.min_length_8',
    })
    @MaxLength(64, {
        message: 'typecast.error.password.max_length_64',
    })
    public password: string = '';

    // TODO: validate password
    /*
    {
        validator: (password) => {

            for (let char of password) {
                if (-1 === 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZöüäÖÜÄ0123456789@^#()[]{}?!$%&/=*+~,.;:<>-_'.split('').indexOf(char)) return false;
            }

            return true;
        },
        message: 'typecast.error.password.illegal_characters'
    }*/
}
