//// Compress images
//gulp.task('compress:images', function () {
//    return gulp.src(src.images)
//        .pipe(imagemin({
//            progressive: true,
//            svgoPlugins: [{removeViewBox: false}],
//            use: [pngquant()],
//            interlaced: true
//        }))
//        .pipe(gulp.dest(src.images));
//});