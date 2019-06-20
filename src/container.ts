import { Repository } from 'typeorm';
import { ApplicationConfig } from './config/application-config';
import { AuthConfig } from './config/auth-config';
import { DatabaseConfig } from './config/database-config';
import { I18nConfig } from './config/i18n-config';
import { MailConfig } from './config/mail-config';
import { ServerConfig } from './config/server-config';
import { Log } from './entity/log';
import { User } from './entity/user';
import { AuthService } from './service/auth-service';
import { DatabaseService } from './service/database-service';
import { FileSystemService } from './service/file-system-service';
import { I18nService } from './service/i18n-service';
import { MailService } from './service/mail-service';
import { RendererService } from './service/renderer-service';
import { ServerService } from './service/server-service';
import { StringService } from './service/string-service';

export class Container {
    public initialized: boolean = false;

    public config: {
        application: ApplicationConfig;
        auth: AuthConfig;
        database: DatabaseConfig;
        mail: MailConfig;
        i18n: I18nConfig;
        server: ServerConfig;
    };

    public service: {
        auth: AuthService;
        database: DatabaseService;
        fs: FileSystemService;
        i18n: I18nService;
        mail: MailService;
        renderer: RendererService;
        server: ServerService;
        string: StringService;
    };

    public repository: {
        log: Repository<Log>;
        user: Repository<User>;
    };
}
