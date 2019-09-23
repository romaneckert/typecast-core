import { dest } from 'gulp';
import { createProject } from 'gulp-typescript';

const packages = {
    core: createProject('packages/core/tsconfig.json'),
};

export default function defaultTask() {
    return packages.core
        .src()
        .pipe(packages.core())
        .pipe(dest('dist'));
}
