"use strict";
const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');

const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const path = require('path');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const child = require('child_process');
const inject = require('gulp-inject-string');

const isDevEnv = process.env.NODE_ENV === 'development';

const input = ['./src/sass/*.scss', './src/sass/pages/*.scss'];
const output = './dist/css/';

let sassOptions;
sassOptions = {
  errLogToConsole: true,
  outputStyle: 'compressed',
  includePaths: [
    'node_modules/govuk_frontend_toolkit/stylesheets',
    'node_modules/govuk-elements-sass/public/sass',
  ],
};

gulp.task('copy-minify', () => {
  gulp.src([
    'node_modules/govuk_template_jinja/assets/stylesheets/fonts.css',
    'node_modules/govuk_template_jinja/assets/stylesheets/govuk-template.css',
  ])
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest(`${output}govuk/`));
});

gulp.task('browserify', () => {
  const entries = path.join(
    __dirname,
    'src',
    'javascript',
    'vendors.js',
  );
  return browserify(entries)
    .bundle()
    .pipe(source('vendors.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/javascript/vendors/'));
});

gulp.task('copy-js', ['browserify'], () => {
  gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/select2/dist/js/select2.min.js',
  ])
    .pipe(gulp.dest('./dist/javascript/vendors/'));
});

// script paths
let jsFiles = 'src/javascript/!(vendors)*.js',
  jsDest = 'dist/javascript';

gulp.task('scripts', function() {
  return gulp.src(jsFiles)
    .pipe(
      inject.replace(
        /\$\$%NODE_ENV%\$\$/,
        process.env.NODE_ENV,
      ),
    )
    .pipe(
      inject.replace(
        /('|")\$\$%DEBUG%\$\$('|")/, 
        !!process.env.DEBUG,
      ),
    )
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(
      gulpIf(isDevEnv, sourcemaps.write()),
    )
    .pipe(gulp.dest(jsDest));
});

gulp.task('watch', () => {
  gulp.watch(input, ['sass'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
  gulp.watch(jsFiles, ['scripts'])
    .on('change', (event) => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});

gulp.task('sass', () => gulp
  .src(input)
  .pipe(sass(sassOptions))
  .pipe(gulp.dest(output)));

const defaultScripts = ['sass', 'scripts', 'watch', 'copy-minify', 'copy-js'];

gulp.task('run-server', defaultScripts, () => {
  const server = child.spawn('node', ['server.js']);
  const outputToConsole = data => console.log(data.toString());
  server.stdout.on('data', outputToConsole);
  server.stderr.on('data', outputToConsole);
});

gulp.task('default', defaultScripts);
