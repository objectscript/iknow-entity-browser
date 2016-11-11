import gulp from "gulp";
import rimraf from "gulp-rimraf";
import preprocess from "gulp-preprocess";
import cssMin from "gulp-cssmin";
import browserify from "browserify";
import to5ify from "6to5ify";
import streamify from "gulp-streamify";
import source from "vinyl-source-stream";
import scss from "gulp-sass";
import pkg from "./package.json";

const
    SOURCE_DIR = `${ __dirname }/src`,
    BUILD_DIR = `${ __dirname }/build`,
    context = {
        package: pkg
    };

gulp.task("clean", () => {
    return gulp.src(BUILD_DIR, { read: false })
        .pipe(rimraf());
});

gulp.task("cls", ["clean"], () => {
    return gulp.src(SOURCE_DIR + "/cls/**/*.cls")
        .pipe(preprocess({ context: context }))
        .pipe(gulp.dest(BUILD_DIR + "/cls"));
});

gulp.task("html", ["clean"], () => {
    return gulp.src(SOURCE_DIR + "/static/**/*.html")
        .pipe(preprocess({ context: context }))
        .pipe(gulp.dest(BUILD_DIR + "/static"));
});

gulp.task("js", ["clean"], () => {
    return browserify(`${ SOURCE_DIR }/static/js/index.js`, { debug: true })
        .transform(to5ify)
        .bundle()
        .on(`error`, (err) => { console.error(err); })
        .pipe(source("index.js"))
        .pipe(streamify(preprocess({ context: context })))
        .pipe(gulp.dest(`${ BUILD_DIR }/static/js`));
});

gulp.task("css", ["clean"], () => {
    return gulp.src(`${ SOURCE_DIR }/static/scss/index.scss`)
        .pipe(scss().on("error", scss.logError))
        .pipe(cssMin())
        .pipe(gulp.dest(`${ BUILD_DIR }/static/css`));
});

gulp.task("default", ["cls", "html", "js", "css"]);