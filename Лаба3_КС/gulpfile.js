var gulp = require('gulp'),
  connect = require('gulp-connect');

function html(cb){
     gulp.src('./app/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
    cb()
} 
function css(cb) {
    gulp.src('./app/css/*.css')
      .pipe(gulp.dest('./dist/css'))
      .pipe(connect.reload());
      cb()
  }

function js(cb) {
    gulp.src('./app/js/*.js')
      .pipe(gulp.dest('./dist/js'))
      .pipe(connect.reload());
      cb()
  }

function startServer(cb){
        connect.server({
        root: 'app',
        livereload: true,
        port:8000,
        root:'./dist'
      });
      cb();
  }

function watch(cb){
    gulp.watch('./app/*.html',html);
    gulp.watch('./app/css/*.css',css);
    gulp.watch('./app/js/*.js',js);
    cb();
  }

exports.css = css;
exports.js = js;
exports.html = html;

exports.default = gulp.series(startServer,watch);


  









//   gulp.task('watch', function () {
//     gulp.watch(['app/*.html'], ['html']);
//     gulp.watch(['/app/css/*.css'], ['css']);
//     gulp.watch(['/app/js/*.js'], ['js']);
//   });


   




