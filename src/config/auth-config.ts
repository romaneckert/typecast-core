export class AuthConfig {
    public tokenExpiresIn: number = 600;
    public tokenCookieName: string = '_t';
    public secret?: string = undefined;
}
