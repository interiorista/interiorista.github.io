/**
 * File:    gulpfile.babel.js
 * Author:  @juancarlosfarah
 * Date:    14/10/15
 */

import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import concat from 'gulp-concat';
import source from 'vinyl-source-stream';
import cssmin from 'gulp-cssmin';
import less from 'gulp-less';
import plumber from 'gulp-plumber';
import autoprefixer from 'gulp-autoprefixer';

const dependencies = [
    'underscore'
];


// Combine all JS libraries into a single file for fewer HTTP requests.
gulp.task('vendor', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/lodash/lodash.min.js',
        'bower_components/bootstrap/dist/js/bootstrap.js',
        'bower_components/masonry/dist/masonry.pkgd.min.js',
        'bower_components/imagesloaded/imagesloaded.pkgd.min.js'
    ]).pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/js'));
});

// Copy all fonts to public directory.
gulp.task('fonts', function() {
    return gulp.src(['bower_components/bootstrap/fonts/**/*'])
        .pipe(gulp.dest('public/fonts'));
});

// Compile third-party dependencies separately for faster performance.
gulp.task('browserify-vendor', function() {
    return browserify()
        .require(dependencies)
        .bundle()
        .pipe(source('vendor.bundle.js'))
        .pipe(gulp.dest('public/js'));
});

// Compile only project files, excluding all third-party dependencies.
gulp.task('browserify', ['browserify-vendor'], function() {
    return browserify('src/main.js')
        .external(dependencies)
        .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/js'));
});

// Compile LESS stylesheets.
gulp.task('styles', function() {
    return gulp.src('src/less/styles.less')
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/main.js', ['browserify']);
});

gulp.task('build', ['fonts', 'styles', 'vendor', 'browserify', 'watch']);
gulp.task('default', ['build']);