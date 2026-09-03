import gulp from 'gulp'
import base64 from 'gulp-base64'
import autoprefixer from 'gulp-autoprefixer'
import fileInclude from 'gulp-file-include'
import del from 'del'
import browserSync from 'browser-sync'
import concat from 'gulp-concat'
import bro from 'gulp-bro'
import uglify from 'gulp-uglify'
import babelify from 'babelify'

const app = 'app'
const src = 'src'
const dist = `dist/${app}`
const paths = {
  library: [`${src}/lib/*.js`, `${src}/lib/*.{css,scss}`],
  script: [`${src}/**/*.js`, `!${src}/lib/*.js`],
  style: [`${src}/**/*.{css,scss}`, `!${src}/lib/*.{css,scss}`],
  html: `${src}/**/*.html`,
  image: `${src}/**/*.{png,jpg,jpeg,gif,svg,ico,mp4}`,
  font: `${src}/**/*.{ttf,otf,woff,woff2,eot,svg}`,
  data: `${src}/data/*.*`
}

const clean = () => {return del(['dist'])}
const server = browserSync.create()
const sass = require('gulp-sass')(require('sass'))
const scssOptions = { // Sass compile option
  outputStyle: 'expanded',
  indentType: 'space',
  indentWidth: 2,
  precision: 6,
  sourceComments: false,
  silenceDeprecations: ['legacy-js-api', 'import']
}
const htmlIncludeOptions = {
  prefix: '@@',
  basepath: '@file',
  indent: true
}

function htmlInclude() {
  return gulp.src([paths.html, `!${src}/html/inc/*.html`])
  .pipe(fileInclude(htmlIncludeOptions))
  .pipe(gulp.dest(dist))
  .pipe(browserSync.stream())
}

function library() {
  return gulp.src(paths.library, {sourcemaps: false}).pipe(gulp.dest(`dist/${app}/lib`))
}

function script() {
  return gulp.src(paths.script, {sourcemaps: false})/** .pipe(uglify({toplevel: true}))*/.pipe(gulp.dest(dist))
}

function style() {
  return gulp.src(paths.style, {sourcemaps: false})
  .pipe(sass(scssOptions).on('error', sass.logError))
  .pipe(base64({
    extensions: ['svg', 'png', /\.jpg#datauri$/i],
    maxImageSize: 1024,
    debug: true
  }))
  .pipe(autoprefixer())
  .pipe(gulp.dest(dist, {sourcemaps: '/maps'}))
  .pipe(browserSync.stream())
}

function copyImage() {
  return gulp.src(paths.image, {since: gulp.lastRun(copyImage)})
    .pipe(gulp.dest(dist))
}

function copyFont() {
  return gulp.src(paths.font, {since: gulp.lastRun(copyFont)})
    .pipe(gulp.dest(dist))
}

function copyData() {
  return gulp.src(paths.data, {since: gulp.lastRun(copyData)})
    .pipe(gulp.dest(`dist/${app}/data`))
}

function watchFiles(done) {
  server.init({
    server: './dist/',
    port: 5000,
    open: false,
    startPath: `${app}/index.html`
  })
  done()
  gulp.watch(paths.html, htmlInclude)
  gulp.watch(paths.library, library)
  gulp.watch(paths.script, script)
  gulp.watch(paths.style, style)
  gulp.watch(paths.image, copyImage)
  gulp.watch(paths.font, copyFont)
  gulp.watch(paths.data, copyData)
}

const watch = gulp.parallel(watchFiles)
const build = gulp.series(clean, gulp.parallel(htmlInclude, library, script, style, copyImage, copyFont, copyData))
const dataBuild = gulp.parallel(copyImage, copyFont, copyData)

// build
exports.build = build

// dev
export const dev = gulp.series([build, watch]);
export const data = gulp.series([dataBuild])

// exports.watch = watch
// exports.build = build
// exports.default = build
