'use strict';

module.exports = function() {
	$.gulp.task('watch', function() {
		$.gulp.watch('./src/pages/**/*.html', $.gulp.series('html'));
		// $.gulp.watch('./src/pages/**/*.pug', $.gulp.series('pug'));
		$.gulp.watch('./src/css/**/*.scss', $.gulp.series('sass:dev'));
		$.gulp.watch('./src/img/*', $.gulp.series('img:dev'));
		$.gulp.watch('./src/js/*.js', $.gulp.series('script:dev'));
		$.gulp.watch('./src/fonts/*', $.gulp.series('fonts'));
		$.gulp.watch('./src/*', $.gulp.series('json'));
	});
};