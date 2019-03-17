'use strict';

module.exports = function() {
	$.gulp.task('img:dev', function() {
		return $.gulp.src('./src/img/**/*.{png,jpg,gif,svg}')
			.pipe($.gulp.dest('./build/img/'));
	});

	$.gulp.task('img:build', function() {
		return $.gulp.src('./src/img/**/*.{png,jpg,gif,svg}')
			// .pipe($.gp.tinypng('Gt0oLUIxJOEcvIgW2OgL6fYb_030qW4U'))
			.pipe($.gp.imagemin({
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [$.gp.pngquant()],
	            interlaced: true
	        }))
			.pipe($.gulp.dest('./build/img/'));
	});
}