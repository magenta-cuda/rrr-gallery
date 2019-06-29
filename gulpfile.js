var gulp       = require('gulp');
var sass       = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify');
var gulpif     = require('gulp-if');
var rename     = require('gulp-rename');
var chmod      = require('gulp-chmod');
var webpack    = require('webpack');
var path       = require('path');

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

gulp.task('dev', function(){
    return gulp.src(['*.php', 'css/*.css', 'css/images/*.*', 'js/**/*.js', 'fonts/*.*', '!js/**/*.min.js'], {"base":"."})
        .pipe(chmod(0644))
        .pipe(gulp.dest('/var/www/html/wp-content/plugins/rrr-gallery'))
});

gulp.task('watch', function(){
    // TODO: currently 'dev' must be run as sudo -u www-data; Can gulp chown?
    // gulp.watch('css/*.scss', gulp.series('sass','dev')); 
    // gulp.watch(['js/*.js', '!js/*.min.js'], gulp.series('js','dev'));
    gulp.watch('css/*.scss', gulp.series('sass')); 
    gulp.watch(['js/*.js', '!js/*.min.js'], gulp.series('js'));
});

gulp.task('webpack', function(){
    return new Promise((resolve,reject) => {
        return webpack({
            mode:'development',
            entry:'./rr-main.js',                   // N.B. 'rr-main.js' does not work
            resolve:{extensions:['.js']},
            output:{
                filename:'./bundle.js',
                path:path.join(__dirname, 'js')
            },
            optimization:{
                splitChunks:{
                    chunks:'all'
                }
            },
            context:path.join(__dirname, 'js')
        }, (error, status) => {
            if (error) {
                console.log(error)
            }
            console.log(status.toString())
            resolve()
        })
    })
});

