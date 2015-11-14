var generators = require('yeoman-generator');

module.exports = generators.Base.extend({

	constructor: function () {
		generators.Base.apply(this, arguments)


	},

	promptUser: function () {
		var done = this.async()

		console.log(this.yeoman)

		var prompts = [{
			name: 'name',
			message: "[?] WHAT YA WORKIN' ON?"
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
			name: 'cssReset',
			message: '[?] USE RESET CSS? (ELSE NORMALIZE)'
		}]

		this.prompt(prompts, function (props) {
			console.log(props)
			this.name = props.name
			this.author = props.author
			this.description = props.description

			done()
		}.bind(this))
	},

	copyFiles: function () {

		//COPY BASE THINGS
		this.template('package.json', 'package.json')
		this.copy('gulpfile.js', 'gulpfile.js')
		this.copy('index.html', 'index.html')

		this.bulkDirectory('styles', 'styles')
		this.bulkDirectory('scripts', 'scripts')
		this.bulkDirectory('parts', 'parts')

		//JS OPTIONS
		if (this.supportIE9)
			this.copy('extras/js/ie9-shim.js', 'scripts/ie9-shim.js')

		//SASS OPTIONS
		var cssResetName = this.cssReset ? 'reset' : 'normalize'
		this.template('dynamics/sass/main.scss', 'styles/main.scss', {cssReset: cssResetName})
		this.copy('extras/sass/' + cssResetName + '.scss', 'styles/vendor/' + cssResetName + '.scss', {force: true})

		//dotfiles
		this.copy('.gitignore', '.gitignore')
		this.copy('.editorconfig', '.editorconfig')
		this.copy('.eslintrc', '.eslintrc')

		console.log("[+] THINGS COPIED");
	},

	install: function () {
		var done = this.async()
		this.npmInstall("", function () {
			console.log("[+] DEPENDENCIES INSTALLED");
			console.log("[+] CONGRATS, NOW GET SOME WORK DONE");
			done()
		})
	}
});
