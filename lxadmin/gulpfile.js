"use strict";

var gulp = require("gulp");
var connect = require("gulp-connect"); //Runs a local dev server
var open = require("gulp-open"); //Open a URL in a web browser
var browserify = require('browserify'); //Bundle JS
var reactify = require('reactify'); //transforms React JSX to JS
var source = require('vinyl-source-stream'); //Use conventional text streams with Gulp
var concat = require('gulp-concat'); //Concatenates files

var config = {
    port: 9000,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        dist: './dist',
        mainJs: './src/main.js'
    }
};

//Start a local development server
gulp.task("connect", function(){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

//Open url in web browser
gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open('', { url: config.devBaseUrl+':'+config.port+'/'}));
});

//Copy html to dist folder
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

//Compile js and copy js files to dist folder
gulp.task('js', function(){
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console)) //出错机制
        .pipe(source('bundle.js')) //browserify的输出名字
        .pipe(gulp.dest(config.paths.dist+'/scripts')) //gulp拷贝目录地址
        .pipe(connect.reload()); //重载服务器
});

//Concat css files to dist folder
gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist+'/css'))
        .pipe(connect.reload());
});

//Watch file changes
gulp.task('watch', function(){
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
    gulp.watch(config.paths.css, ['css']);
});

//Default css
gulp.task('default', ['html', 'js', 'css', 'open', 'watch']);