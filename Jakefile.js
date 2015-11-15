/* globals desc:false, task:false, complete:false, fail:false, jake:false, directory:false */
(function()
{
	"use strict";

	var jshint = require('simplebuild-jshint');
	var shelljs = require('shelljs');
	var browserify = require('browserify');
	var path = require('path');
	var fs = require('fs');
	var exorcist = require('exorcist');

	var DEPLOY_DIR = "./deploy/";

	desc("Default task");
	task("default",["lint","clean","deploy","http"],function()
	{
		console.log("Build OK!");
	});

	desc("Launch the http-server");
	task('http', function()
	{
		jake.exec("node_modules/http-server/bin/http-server " + DEPLOY_DIR, {interactive:true}, complete );
	});

	desc("Check Deploy dir exists");
	directory(DEPLOY_DIR);

	desc("Check JS dir exists");
	directory(DEPLOY_DIR + "js");

	desc("Remove existing files from deploy directory");
	task("clean", function()
	{
		console.log("Clearing Deploy folder: .");
		shelljs.rm('-rf', DEPLOY_DIR );
	});


	desc("Bundling JS for deployment");
	task("bundlejs", function()
	{
		console.log("Broserifying JS Modules: .");

		var mapfile = path.join(DEPLOY_DIR,"js","app.js.map");

		browserify({debug:true}).require(require.resolve('./src/app.js'), {entry:true})
					.bundle()
					.pipe(exorcist(mapfile))
					.pipe(fs.createWriteStream( path.join(DEPLOY_DIR,"js","app.js")), 'utf8');
	});
	
	desc("Deploy files to public folder");
	task("deploy",[DEPLOY_DIR,DEPLOY_DIR + "js","bundlejs"], {async:true}, function()
	{


		jake.exec('node_modules/browserify/bin/cmd.js ./src/app.js -o ' + DEPLOY_DIR + "js/app.js", complete );

		console.log("Copying content files: .");
		shelljs.cp("-R", "./src/content/*", DEPLOY_DIR );
	});

	desc("Lint Javascript");
	task("lint", function()
	{
		console.log("Linting JS: .");

		jshint.checkFiles({files:["Jakefile.js", "./src/*.js"],
		//jshint.checkFiles({files:["Jakefile.js", "./public/js/*.js","!./public/js/jquery.js"],
						options:lintOptions(),
						globals:lintGlobals()}, complete, fail );
	});

	
	function lintOptions()
	{
		return { 
			bitwise:true, 
			eqeqeq:true, 
			forin:true,
			freeze:true,
			futurehostile:true,
			latedef:"nofunc",
			noarg:true,
			nocomma:true,
			nonbsp:true,
			nonew:true,
			strict:false,
			undef:true,
			node:true,
			browser:true
		};
	}

	function lintGlobals()
	{
		return { "debugger":false };
	}

}());