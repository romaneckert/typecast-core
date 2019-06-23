import express from 'express';

export interface IRouteHandler {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];

    handle(req: express.Request, res: express.Response, next: () => void): Promise<void>;
}
