var gulp       = require('gulp');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');

gulp.task('sass', function(){
    return gulp.src('css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('css'))
});

gulp.task('js', function(){
    return gulp.src(['js/*.js', '!js/*.min.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js'))
});
