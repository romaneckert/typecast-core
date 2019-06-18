import { Container } from '../container';

export class ContainerAware {
    public container: Container;

    constructor(container: Container) {
        this.container = container;
    }
}
