'use strict';

module.exports = function() {
	$.gulp.task('sass:dev', function() {
		return $.gulp.src('./src/css/*.scss')
			.pipe($.gp.sourcemaps.init())
			.pipe($.gp.sass())
			.on('error', $.gp.notify.onError({
				title: 'style'
			}))
			.pipe($.gp.autoprefixer({
				browsers: [
					'last 3 version'
				]
			}))
			.pipe($.gp.sourcemaps.write())
			.pipe($.gulp.dest('./build/css'))
	});

	$.gulp.task('sass:build', function() {
		return $.gulp.src('./src/css/*.scss')
			.pipe($.gp.sourcemaps.init())
			.pipe($.gp.sass())
			.on('error', $.gp.notify.onError({
				title: 'style'
			}))
			.pipe($.gp.autoprefixer({
				browsers: [
					'last 3 version'
				]
			}))
			.pipe($.gp.csso())
			.pipe($.gp.sourcemaps.write())
			.pipe($.gulp.dest('./build/css'))
	});
}

