'use strict';

module.exports = function() {
	$.gulp.task('script:dev', function() {
		return $.gulp.src('./src/js/*.js')
			.pipe($.gulp.dest('./build/js/'));
	});

	$.gulp.task('script:build', function() {
		return $.gulp.src('./src/js/*.js')
			.pipe($.gp.uglify())
			.pipe($.gulp.dest('./build/js/'));
	});
}