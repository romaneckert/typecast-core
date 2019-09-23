import * as gulp from 'gulp';
gulp.task('default', () => console.log('default'));

/*
const { src, dest } = require('gulp');
const { createProject } = require('gulp-typescript');

function defaultTask() {
    return createProject('tsconfig.json')
        .src()
        .pipe(createProject('tsconfig.json')())
        .pipe(dest('dist'));
}

exports.default = defaultTask;*/
