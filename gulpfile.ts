/* tslint:disable:no-console */

import { watch, series, parallel, dest } from 'gulp';
import { createProject } from 'gulp-typescript';
import path from 'path';
import merge from 'merge-stream';
import { Stream } from 'stream';
import FileSystemService from './packages/core/service/file-system.service';
import jest from 'jest';
import chalk from 'chalk';

const fs = new FileSystemService();
const packages = ['packages/core'];

export async function test(cb: any): Promise<void> {
    const promises = [];

    for (const entry of packages) {
        promises.push(jest.runCLI({} as any, [entry]));
    }

    const results = await Promise.all(promises);

    for (const result of results) {
        if (result.results.success) {
            console.log(chalk.black.bgGreen('           '));
            console.log(chalk.black.bgGreen(' TEST DONE '));
            console.log(chalk.black.bgGreen('           '));
        } else {
            console.log(chalk.black.bgRed('             '));
            console.log(chalk.black.bgRed(' TEST FAILED '));
            console.log(chalk.black.bgRed('             '));
        }
    }
}

function listen(cb: any) {
    for (const entry of packages) {
        watch(path.join(entry, '/**/*'), test);
    }

    cb();
}

async function clean(): Promise<void> {
    await fs.remove('./var');
    await fs.remove('./dist');
}

function compile(): Stream {
    const stream = merge();

    for (const entry of packages) {
        const project = createProject(path.join(entry, 'tsconfig.json'));

        stream.add(
            project
                .src()
                .pipe(project())
                .pipe(dest('dist')),
        );
    }

    return stream;
}

export default series(clean, parallel(compile, listen), test);
