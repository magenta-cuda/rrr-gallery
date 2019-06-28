var gulp       = require('gulp');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var gulpif     = require('gulp-if');
var rename     = require('gulp-rename');

gulp.task('sass', function(){
    return gulp.src('css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
        .pipe(gulpif('*.css',gulp.dest('dist/css')))
});

gulp.task('js', function(){
    return gulp.src(['js/*.js', '!js/*.min.js', '!js/bbg_xiv-gallery-extra.js'])
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulpif('*.js', rename({suffix:'.min'})))
        .pipe(gulp.dest('js'))
        .pipe(gulpif('*.min.js',gulp.dest('dist/js')))
});

gulp.task('watch', function(){
    gulp.watch('css/*.scss', gulp.series('sass')); 
    gulp.watch(['js/*.js', '!js/*.min.js'], gulp.series('js'));
});
