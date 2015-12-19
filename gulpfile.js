/* DEPS */
const del          = require('del')
const gulp         = require('gulp')
const imageminWebp = require('imagemin-webp')
const imageop      = require('gulp-image-optimization')
const pngquant     = require('imagemin-pngquant')
const rename       = require('gulp-rename')
const resize       = require('gulp-image-resize')
const watch        = require('gulp-watch')
const webp         = require('gulp-webp')
const mozjpg       = require('imagemin-mozjpeg')

/* SOURCES */
const imgRawSrc  = 'images/raw/**/*.+(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|webp|WEBP)'
const stageDir   = 'images/stage'
const stageSrc   = 'images/stage/**/*.+(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|webp|WEBP)'
const imgProcSrc = [
  'images/resized/*',
  'images/opto/*'
]

/* CONFIGS */
var imageOptoConfig = {
  optimizationLevel: 5,
  progressive: true,
  interlaced: true,
  use: [
    pngquant( {quality: '65-80', speed: 4} ),
    imageminWebp( {quality: 50} )
  ]
}

/* DELETE PREVIOUS PROCESSED IMAGES */
gulp.task('img-del', () =>
  imgProcSrc.forEach( item =>
    del.sync(item)
  )
)

/* CREATE WEBP FROM JPG AND PNG */
gulp.task('img-webp', () =>
  gulp.src(imgRawSrc)
    .pipe(webp({ quality: 50 }))
    .pipe(gulp.dest(stageDir))
)

/* CREATE MOZ JPGS FROM JPGS */
gulp.task('img-mozjpg', () =>
  gulp.src(imgRawSrc)
    .pipe(mozjpg({ quality: 50 }))
    .pipe(rename({ suffix: '-moz' }))
    .pipe(gulp.dest(stageDir))
)

/* RESIZE TO BREAKPOINTS */
/* OPTIMIZE ALL IMAGES */
