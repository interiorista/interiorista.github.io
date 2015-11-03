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
import nunjucksRender from 'gulp-nunjucks-render';
import data from 'gulp-data';
import fs from 'fs';
import nunjucks from 'nunjucks';

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
        'bower_components/slick-carousel/slick/slick.min.js',
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
    gulp.watch('src/**/*.nunjucks', ['nunjucks', 'projects']);
    gulp.watch('src/data/*.json', ['nunjucks', 'projects']);
});

gulp.task('nunjucks', function() {
    nunjucksRender.nunjucks.configure(['src/templates/']);

    let json = JSON.parse(fs.readFileSync('src/data/carousel.json', 'utf8')),
        carousel = json.carousel,
        images = fs.readdirSync(carousel.imageDir);

    // Gets .html and .nunjucks files in pages
    return gulp.src('src/pages/**/*.+(html|nunjucks)')
        .pipe(data(function() {
            let doc = JSON.parse(fs.readFileSync('src/data/projects.json',
                                                 'utf8'));
            doc['carousel'] = images;
            return doc;
        }))
        .pipe(nunjucksRender())
        .pipe(gulp.dest('.'))
});

gulp.task('projects', function() {
    nunjucks.configure(['src/templates/']);
    let json = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8')),
        projects = json.projects;
    for (var key in projects) {
        let project = projects[key];
        let images = fs.readdirSync(project.imageDir);
        project['images'] = images;
        var html = nunjucks.render('project.nunjucks',
            {
                project: project,
                projects: projects
            });
        fs.writeFileSync(project.href, html);
    }
});

gulp.task('build',
          [
              'fonts',
              'styles',
              'vendor',
              'browserify',
              'watch',
              'nunjucks',
              'projects'
          ]);
gulp.task('default', ['build']);