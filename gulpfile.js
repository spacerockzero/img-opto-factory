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
const imgExt       = '.+(jpg|JPG|jpeg|JPEG|gif|GIF|png|PNG|webp|WEBP)'
const imgPngExt    = '.+(png|PNG)'
const imgRawDir    = 'images/raw/'
const imgRawSrc    = imgRawDir + '/**/*' + imgExt
const imgRawPngSrc = 'images/raw/**/*' + imgPngExt
const imgStageDir  = 'images/stage'
const imgStageSrc  = imgStageDir + '/**/*' + imgExt
const resizedDir   = 'images/resized'
const resizedSrc   = resizedDir + '/**/*' + imgExt
const optoDir      = 'images/opto'
const optoSrc      = optoDir + '/**/*' + imgExt
const delSrc   = [
  'images/resized/*',
  'images/stage/*',
  'images/opto/*'
]

/* CONFIGS */
var imageOptoConfig = {
  optimizationLevel: 5,
  progressive: true,
  interlaced: true,
  use: [
    pngquant( {quality: '65-80', speed: 4} )
  ]
}
/*
 * DELETE PREVIOUS PROCESSED IMAGES
 */
gulp.task('img-del', () =>
  delSrc.forEach( item =>
    del.sync(item)
  )
)

gulp.task('img-png-to-jpg', function () {
  return gulp.src(imgRawPngSrc)
    .pipe(resize({ format: 'jpeg' })) //resize with empty dimensions to losslessly convert to jpg
    .pipe(gulp.dest(stageDir))
});

/*
 * RESIZE TO BREAKPOINTS
 */
 gulp.task('img-resize-1200', () =>
 gulp.src(imgRawSrc)
 .pipe(resize({ width: 1200 }))
 .pipe(rename({ suffix: '-1200'}))
 .pipe(gulp.dest(resizedDir))
)
gulp.task('img-resize-900', () =>
  gulp.src(imgRawSrc)
    .pipe(resize({ width: 900 }))
    .pipe(rename({ suffix: '-900'}))
    .pipe(gulp.dest(resizedDir))
)
gulp.task('img-resize-500', () =>
  gulp.src(imgRawSrc)
    .pipe(resize({ width: 500 }))
    .pipe(rename({ suffix: '-500'}))
    .pipe(gulp.dest(resizedDir))
)
gulp.task('img-resize-1024', () =>
  gulp.src(imgRawSrc)
    .pipe(resize({ width: 1024 }))
    .pipe(rename({ suffix: '-1024'}))
    .pipe(gulp.dest(resizedDir))
)

/* GROUP TASK */
gulp.task('img-resize', ['img-resize-1024']);

/* CREATE WEBP FROM JPG AND PNG */
gulp.task('img-webp', () =>
  gulp.src(resizedSrc)
    .pipe(webp({ quality: 60 }))
    .pipe(gulp.dest(optoDir))
)

/* CREATE MOZ JPGS FROM JPGS */
gulp.task('img-mozjpg', () =>
  gulp.src(imgRawSrc)
    .pipe(mozjpg({ quality: 60 })())
    .pipe(rename({ suffix: '-moz' }))
    .pipe(gulp.dest(optoDir))
)

/* GROUP TASK */
gulp.task('img-transpile', ['img-webp', 'img-mozjpg'])

/*
 * OPTIMIZE ALL IMAGES
 */

/*
 * MASTER BUILD
 */
gulp.task('default', ['img-del', 'img-resize', 'img-transpile']);
