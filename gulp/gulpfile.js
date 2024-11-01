const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

// Compile SCSS for development
function compileSassDev() {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('static'))
    .pipe(browserSync.stream());
}

// Compile and minify SCSS for production
function compileSassProd() {
  return gulp.src('assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest('static'));
}

// Minify JS
function minifyJs() {
  return gulp.src('assets/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('static'))
    .pipe(browserSync.stream());
}

// Watch files
function watchFiles() {
  gulp.watch('assets/scss/**/*.scss', compileSassDev);
  gulp.watch('assets/js/**/*.js', minifyJs);
  gulp.watch('**/*.php').on('change', browserSync.reload);
}

// BrowserSync
function browserSyncInit(done) {
  browserSync.init({
    proxy: "https://mysite.local", // Update this to match your local development URL
    notify: false
  });
  done();
}

// Define complex tasks
const buildDev = gulp.series(compileSassDev, minifyJs);
const build = gulp.series(compileSassProd, minifyJs);
const watch = gulp.parallel(watchFiles, browserSyncInit);

// Export tasks
exports.sassDev = compileSassDev;
exports.sassProd = compileSassProd;
exports.js = minifyJs;
exports.build = build;
exports.watch = watch;
exports.default = gulp.series(buildDev, watch);
