export class Container {
    public static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }

        return Container.instance;
    }

    private static instance: Container;

    [key: string]: any;
}
