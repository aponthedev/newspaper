import gulp from 'gulp';
const { series } = gulp;

import * as path from 'path';
import { fileURLToPath } from 'url';

import fileinclude from 'gulp-file-include';
import cssbeautify from 'gulp-cssbeautify';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import concat from 'gulp-concat';

import sassCompiler from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(sassCompiler);

import browserSyncInstance from 'browser-sync';
const browserSync = browserSyncInstance.create();

/* =====================
   Compile SCSS
===================== */
function style() {
  return gulp
    .src('./src/assets/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(cssbeautify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(browserSync.stream());
}

/* =====================
   HTML Include
===================== */
function htmlfileinclude() {
  return gulp
    .src('./src/html/pages/*.html')
    .pipe(
      fileinclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(gulp.dest('./src/'))
    .pipe(browserSync.stream());
}

/* =====================
   JS Combine
===================== */
function scripts() {
  return gulp
    .src('./src/assets/js/custom-lib/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./src/assets/js/'))
    .pipe(browserSync.stream());
}

/* =====================
   Browser Sync + Watch
===================== */
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: './src/',
    },
  });

  gulp.watch('./src/html/**/*.html', htmlfileinclude);
  gulp.watch('./src/assets/sass/**/*.scss', style);
  gulp.watch('./src/assets/js/custom-lib/*.js', scripts);

  gulp.watch('./src/assets/js/**/*.js').on('change', browserSync.reload);
}

/* =====================
   Create ZIP
===================== */
function makeZip() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const currentDir = path.basename(__dirname);

  return gulp
    .src([
      'src/**',
      '!src/html/**',
      '!src/assets/sass/**',
      '!src/test.html',
      '!src/assets/css/main.css.map',
    ])
    .pipe(zip(`${currentDir}.zip`))
    .pipe(gulp.dest('./'));
}

/* =====================
   Clean HTML
===================== */
function clean() {
  return deleteAsync(['src/*.html']);
}

/* =====================
   Tasks
===================== */

gulp.task('clean', clean);
gulp.task('htmlInclude', htmlfileinclude);
gulp.task('cssInclude', style);
gulp.task('scripts', scripts);
gulp.task('watch', watchFiles);
gulp.task('makeZip', makeZip);

gulp.task('zip', series(clean, htmlfileinclude, style, makeZip));
gulp.task('default', series(clean, htmlfileinclude, style, watchFiles));
