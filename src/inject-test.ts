const service: {
    [key: string]: any;
} = {};

const Service = (name: string): ClassDecorator => {
    return target => {
        service[name] = target;
    };
};

function InjectService(name: string): any {
    // this is the decorator factory
    return (target: { [key: string]: any }, propertyName: string): void => {
        target[propertyName] = new service[name]();
    };
}

interface ILogger {
    log(message: string): void;
}

@Service('logger')
class Logger implements ILogger {
    public log(message: string) {
        console.log('logger');
        console.log(message);
    }
}

@Service('logger')
class MyOtherLogger implements ILogger {
    public log(message: string) {
        console.log('other logger');
        console.log(message);
    }
}

@Service('server')
class Server {
    @InjectService('logger')
    public logger: ILogger;

    test() {
        this.logger.log('test');
    }
}

let server = new Server();

server.test();
