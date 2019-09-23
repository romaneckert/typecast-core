export default class Application {
    private modules: any;

    constructor(modules: any[]) {
        this.modules = modules;
    }

    public async start() {
        console.log(this.modules);
    }
}
