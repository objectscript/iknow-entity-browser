import gulp from "gulp";
import rimraf from "gulp-rimraf";
import webpack from "webpack";
import preprocess from "gulp-preprocess";
import cssMin from "gulp-cssmin";
import scss from "gulp-sass";
import fs from "fs";
import mime from "mime-types";
import pkg from "./package.json";

const
    APP_NAME = `EntityBrowser`,
    SOURCE_DIR = `${ __dirname }/src`,
    BUILD_DIR = `${ __dirname }/build`,
    STATIC_DATA_FILE = `${ SOURCE_DIR }/cls/${ APP_NAME }/StaticData.cls`,
    context = {
        package: pkg
    },
    webpackConfig = {
        context: `${ __dirname }`,
        entry: {
            "index": `${ SOURCE_DIR }/static/js/index.js`
        },
        output: {
            path: `${ BUILD_DIR }/static/js`,
            filename: `[name].js`
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: `babel-loader`,
                    query: {
                        presets: [`es2015`]
                    }
                }
            ]
        }
    };

function getAllFiles (dir) {
    let results = [];
    let list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        let stat = fs.statSync(file);
        if (stat && stat.isDirectory()) results = results.concat(getAllFiles(file));
        else results.push(file)
    });
    return results;
}

function base64Encode (file) {
    return (new Buffer(fs.readFileSync(file, 'binary'), 'binary')).toString(`base64`);
}

gulp.task("clean", () => {
    return gulp.src(BUILD_DIR, { read: false })
        .pipe(rimraf());
});

gulp.task("cls", ["clean"], () => {
    return gulp.src([
            `!${ STATIC_DATA_FILE }`,
            `${ SOURCE_DIR }/cls/**/*.cls`
        ])
        .pipe(preprocess({ context: context }))
        .pipe(gulp.dest(BUILD_DIR + "/cls"));
});

gulp.task("html", ["clean"], () => {
    return gulp.src(SOURCE_DIR + "/static/**/*.html")
        .pipe(preprocess({ context: context }))
        .pipe(gulp.dest(BUILD_DIR + "/static"));
});

gulp.task("etc", ["clean"], () => {
    return gulp.src([
        `${ SOURCE_DIR }/static/**/*.*`,
        `!${ SOURCE_DIR }/static/js/**/*.*`,
        `!${ SOURCE_DIR }/static/scss/**/*.*`,
        `!${ SOURCE_DIR }/static/index.html`
    ])
        .pipe(gulp.dest(BUILD_DIR + "/static"));
});

gulp.task("js", ["clean"], (done) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) throw new Error(err);
        console.log(stats.toString());
        done(err);
    });
});

gulp.task("css", ["clean"], () => {
    return gulp.src(`${ SOURCE_DIR }/static/scss/index.scss`)
        .pipe(scss().on("error", scss.logError))
        .pipe(cssMin())
        .pipe(gulp.dest(`${ BUILD_DIR }/static/css`));
});

/// doing file replacement manually because preprocess sucks.
gulp.task("StaticData", ["html", "js", "css", "etc"], () => {
    let files = getAllFiles(`${ BUILD_DIR }/static`),
        staticData = files.map((fileName, i) =>
`/// ${ fileName.replace(`${ BUILD_DIR }/static/`, "") }\r\n\
XData File${ i } [ MimeType = ${ mime.lookup(fileName) || "text/plain" } ]\r\n\
{\r\n\
${ base64Encode(fileName).replace(/(.{32765})/g, "$1\r\n") }\r\n\
}`
        ).join(`\r\n\r\n`);
    fs.writeFileSync(
        STATIC_DATA_FILE.replace(SOURCE_DIR, BUILD_DIR),
        new Buffer(fs.readFileSync(STATIC_DATA_FILE)).toString()
            .replace("<!-- staticData -->", staticData)
    );
});

gulp.task("default", ["cls", "StaticData"]);