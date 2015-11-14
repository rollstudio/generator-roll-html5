var generators = require('yeoman-generator')
var _ = require('lodash')
var chalk = require('chalk')

module.exports = generators.Base.extend({

	constructor: function () {
		generators.Base.apply(this, arguments)
	},


	greet: function () {
		var greetMsg = chalk.magenta.bold("\n\n == ")
		greetMsg += chalk.magenta("Welcome to")
		greetMsg += chalk.magenta.bold(" ROLL Studio ")
		greetMsg += chalk.magenta("'s " + chalk.magenta.bold("HTML5") +" generator")
		greetMsg += chalk.magenta.bold(" == \n\n")

		console.log(greetMsg)
	},

	promptInfo: function () {

		console.log(chalk.cyan(" == GIMME SOME BASIC INFO\n"))

		var done = this.async()

		var prompts = [{
			name: 'name',
			message: "WHAT YA WORKIN' ON?"
		}, {
			name: 'author',
			message: "[?] WHO'S TO BLAME FOR THIS?"
		}, {
			name: 'description',
			message: "[!] GIMME DESCRIPTION"
		}, {
			type: 'confirm',
			name: 'supportIE9',
			message: "[?] SUPPORT IE9?"
		}, {
			type: 'confirm',
			name: 'ues_cssReset',
			message: '[?] USE RESET CSS? (ELSE NORMALIZE)'
		}, {
			type: 'confirm',
			name: 'use_jQuery',
			message: "[?] USE jQuery?"
		}, {
			type: 'confirm',
			name: 'use_babel',
			message: "[?] USE ES6? (WITH BABEL)"
		}]

		this.prompt(prompts, function (props) {
			for (var k in props)
				this[k] = props[k]
			done()
		}.bind(this))
	},

	copyFiles: function () {

		//Fill and copy package.json
		var pkgInfo = _.clone(this)
		pkgInfo.name = _.kebabCase(this.name)
		this.template('package.json', 'package.json', pkgInfo)

		//Copy gulpfile.js
		//avoiding template substituction of error messages
		this.fs.copy(this.templatePath('gulpfile.js'), this.destinationPath('gulpfile.js'))

		//Copy static things
		this.template('index.html', 'index.html')
		this.bulkDirectory('parts', 'parts')
		this.bulkDirectory('images', 'images')

		//JS OPTIONS
		if (this.supportIE9)
			this.copy('extras/js/ie9-shim.js', 'scripts/polyfills/ie9-shim.js')

		this.template('dynamics/js/main.js', 'scripts/main.js')

		//SASS OPTIONS
		var cssResetName = this.use_cssReset ? 'reset' : 'normalize'
		this.template('dynamics/sass/main.scss', 'styles/main.scss', {cssReset: cssResetName})
		this.copy('extras/sass/' + cssResetName + '.scss', 'styles/vendor/' + cssResetName + '.scss', {force: true})

		//dotfiles
		this.copy('.gitignore', '.gitignore')

		//TODO: Download these from our central style repo
		this.copy('.editorconfig', '.editorconfig')
		this.copy('.eslintrc', '.eslintrc')

		console.log("[+] THINGS COPIED");
	},

	install: function () {
		//install manually to always grab the latest version
		this.devDeps = [
			'gulp',
			'gulp-if',
			'yargs',
			'gulp-plumber',
			'browser-sync',
			'browserify',
			'gulp-sass',
			'gulp-autoprefixer',
			'gulp-sourcemaps'
		]

		//saveExact to avoid inconsitencies between local and remote
		this.npmInstall(this.devDeps, {
			saveDev: true,
			saveExact: true
		}, function () {
			console.log("[+] DEV DEPS INSTALLED");
			console.log("[+] CONGRATS, NOW GET SOME WORK DONE");
		})
	}
});
