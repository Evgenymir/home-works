'use strict';

module.exports = function() {
	$.gulp.task('pug', function() {
		return $.gulp.src('./src/pages/*.pug')
			.pipe($.gp.pug({pretty: true}))
			.on('error', $.gp.notify.onError(function
				(error) {
					return {
						title: 'pug',
						message: error.message
					}
				}))
			.pipe($.gp.prettify({indent_char: ' ', indent_size: 4}))
			.pipe($.gulp.dest('./build/'));
	});
};