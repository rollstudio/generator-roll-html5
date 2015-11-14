var gulp = require('gulp')
var gulpif = require('gulp-if')

var plumber = require('gulp-plumber')

var argv = require('yargs').argv

var sync = require('browser-sync')

var browserify = require('browserify')

var sass = require('gulp-sass')
var autoprefixer = reuire('gulp-autoprefixer')

var sourcemaps = require('gulp-sourcemaps')

var CFG = {

    JS: {
        ENTRY: 'scripts/main.js',
        NAME: 'main.js'
    },

    HTML: {
        INDEX: 'index.html'
    },

    SASS: {
        ENTRY: 'styles/main.scss'
    },

    BUILD_DEST: './build',

	IS_PROD: argv.prod
}

function notifyError (err) {
	notify.onError({
		title:    "Gulp",
		subtitle: "Failure",
		message:  "Error: <%= error.message %>",
		sound:    "Beep"
	})(err);
}

gulp.task('build:html', function () {
    gulp.src('index.html')
        .pipe(gulp.dest(CFG.BUILD_DEST))
        .pipe(sync.reload({stream: true, once: true}))
})

gulp.task('build:images', function () {
    gulp.src('images/**/*')
        .pipe(gulp.dest(CFG.BUILD_DEST))
        .pipe(sync.reload({stream: true, once: true}))
})


gulp.task('build:styles', function () {
	function onSassError (err) {
		sass.logError(err)
		notifyError(err)
		this.emit('end');
	}

	var supportedBrowsers = ['last 3 versions']
	if (argv.ie9)
		supportedBrowsers.push('ie 9')

	gulp.src(CFG.SASS.ENTRY)
		.pipe(plumber({errorHandler: onSassError}))
		.pipe(gulpif(!CFG.IS_PROD, sourcemaps.init()))
		.pipe(gulpif(!CFG.IS_PROD, sass({outputStyle: 'expanded'}))
		.pipe(gulpif(CFG.IS_PROD, sass({outputStyle: 'compressed'}))
		.pipe(gulpif(!CFG.IS_PROD, sourcemaps.write()))
		.pipe(autoprefixer({
			browsers: supportedBrowsers,
			cascade: false
		}))
		.pipe(gulp.dest(CFG.BUILD_DEST))
		.pipe(sync.stream())
		.pipe(notfy({
			title: 'Gulp',
			subtitle: 'Success',
			message: 'SASS compiled',
			sound: "Pop"
		}))
})


gulp.task('build:scripts', function () {
})


/* Dummy build task to orchestrate build steps */
gulp.task('build', [
			'build:html',
			'build:images',
			'build:styles',
			'build:scripts'
		], function () {})

/* Starts a development server and watches for changes */
gulp.task('serve', ['build'], function () {

    sync.init({
        server: CFG.BUILD_DEST
    })

    gulp.watch('index.html', ['build:html'])
	gulp.watch('images/**/*.{jpg,png,svg,ico}', ['build:images'])
    gulp.watch('styles/**/*.scss', ['build:styles'])
    gulp.watch('scripts/**/*.js', ['build:scripts'])
})
