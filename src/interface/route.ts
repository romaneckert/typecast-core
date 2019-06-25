import express from 'express';

export interface IRoute {
    name: string;
    methods: string[];
    path: string;
    roles?: string[];
    backendModuleMainKey?: string;
    backendModuleSubKey?: string;
    backendModuleTitleKey?: string;
    disabled?: boolean;

    handle(req: express.Request, res: express.Response, next: () => void): Promise<void>;
}
