'use strict';

module.exports = function() {
	$.gulp.task('svgSprite', function() {
		return $.gulp.src('./src/img/icon/sprite/*.svg')
			.pipe($.gp.svgstore({
				inlineSvg: true
			}))
			.pipe($.gp.rename("sprite.svg"))
			.pipe($.gulp.dest('./build/img/'));
	});
}