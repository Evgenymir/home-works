'use strict';

module.exports = function() {
	$.gulp.task('html', function() {
		return $.gulp.src('./src/pages/**/*.html')
			.pipe($.gulp.dest('./build/'));
	});
}