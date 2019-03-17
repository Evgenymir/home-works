'use strict';

module.exports = function() {
	$.gulp.task('css:dev', function() {
		return $.gulp.src('./src/css/*.css')
			.pipe($.gulp.dest('./build/css/'))
	});

	$.gulp.task('css:build', function() {
		return $.gulp.src('./src/css/*.css')
			.pipe($.gp.csso({
				restructure: false,
				sourceMap: true,
				debug: true
			}))
			.pipe($.gulp.dest('./build/css/'))
	});
}