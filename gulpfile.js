var gulp = require('gulp'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cssnano = require('gulp-cssnano'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	jade = require('gulp-jade'),
	server = require('gulp-server-livereload'),
	del = require('del');


gulp.task('styles', function() {
	return sass('src/styles/main.sass', { style: 'expanded' })
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
	return gulp.src('src/images/**/*')
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('dist/assets/img'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('templates', function() {
	var YOUR_LOCALS = {};
	gulp.src('./lib/*.jade')
		.pipe(jade({
 			locals: YOUR_LOCALS
		}))
		.pipe(gulp.dest('./dist/'))
});

gulp.task('clean', function() {
	return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img', 'dist/*.html' ]);
});

gulp.task('default', ['clean'], function() {
	gulp.start(
		'styles'
		//, 'scripts'
		, 'templates'
		, 'images');
});

gulp.task('webserver', function() {
	gulp.src('dist')
		.pipe(server({
			livereload: true,
			directoryListing: true,
			open: true,
			port: 8000
		}));
});

gulp.task('watch', function() {
	// Watch .scss files
	gulp.watch('src/styles/**/*.sass', ['styles']);
	// Watch .js files
	// gulp.watch('src/scripts/**/*.js', ['scripts']);
	// Watch jade files
	gulp.watch('src/images/**/*', ['images']);
	// Watch image files
	gulp.watch('lib/**/*.jade', ['templates']);
});
