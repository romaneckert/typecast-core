import express from 'express';

export interface IRoute {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];

    handle(req: express.Request, res: express.Response, next: () => void): Promise<void>;
}
