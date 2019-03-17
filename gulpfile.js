'use strict';


global.$ = {
	path: {
		task: require('./gulp/path/tasks.js')
	},
	gulp: require('gulp'),
	del: require('del'),
	gp: require('gulp-load-plugins') (),
	browserSync: require('browser-sync').create()
};

$.path.task.forEach(function(taskPath) {
	require(taskPath) ();
});

$.gulp.task('default', $.gulp.series(
	'clean',
	$.gulp.parallel(
		'html',
		'json',
		// 'pug',
		'sass:dev',
		'css:dev',
		'img:dev',
		'script:dev',
		'fonts'
		// 'video'
	),
	$.gulp.parallel(
		'watch',
		'serve'
	)
));

$.gulp.task('build', $.gulp.series(
	'clean',
	$.gulp.parallel(
		'html',
		'json',
		// 'pug',
		'sass:build',
		'css:build',
		'img:build',
		'script:build',
		'fonts'
		// 'video'
	),
	$.gulp.parallel(
		'watch',
		'serve'
	)
));
// $.gulp.task('svgSprite', $.gulp.series(
// 	$.gulp.parallel(
// 		'svgSprite'
// 	)
// ));