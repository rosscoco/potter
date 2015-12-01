/* globals desc:false, task:false, complete:false, fail:false, jake:false, directory:false, process:false */
(function()
{
	"use strict";

	var jshint = require('simplebuild-jshint');
	var shelljs = require('shelljs');
	var browserify = require('browserify');
	var path = require('path');
	var fs = require('fs');
	var exorcist = require('exorcist');
	var through2 = require('through2');

	var DEPLOY_DIR 		= "./deploy/";
	var APP_ENGINE_DIR 	= "/Users/Rossco/pottingcalc/www";

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

	desc("Launch the http-server from the src directory");
	task('httpd', function()
	{
		jake.exec("node_modules/http-server/bin/http-server " + "src/content", {interactive:true}, complete );
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
		shelljs.rm('-rf', APP_ENGINE_DIR );
	});


	desc("Bundling JS for deployment");
	task("bundlejs", function()
	{
		console.log("Broserifying JS Modules: .");

		var mapfile = path.join(DEPLOY_DIR, "js","app.js.map");
		var flag 	= 0;
		var sourceDirective ="//# sourceMappingURL=./app.js.map";

		browserify({ debug:true }).require(require.resolve('./src/app.js'), {entry:true})
					.bundle()
					.pipe(exorcist(mapfile))
					.pipe(through2( {"decodeStrings" : false, "encoding": "utf8"},function(chunk, enc) 
						{
				        	if(flag===0) 
				        	{
					            var tempChunk=chunk;
					            chunk=sourceDirective;
					            chunk+= "\n";
					            chunk+=tempChunk;
					            
					            flag=1;
				        	}
        					this.push( chunk );
        				}))
					.pipe(fs.createWriteStream( path.join( DEPLOY_DIR, "js","app.js")), 'utf8' );

		//# sourceMappingURL=./app.js.map
	});

	desc("Deploy files to public folder");
	task("deploy",["clean",DEPLOY_DIR,DEPLOY_DIR + "js","lint","bundlejs"], {async:true}, function()
	{
		//jake.exec('node_modules/browserify/bin/cmd.js ./src/app.js -o ' + DEPLOY_DIR + "js/app.js", complete );

		console.log("Copying content files: .");
		shelljs.cp("-R", "./src/content/*", DEPLOY_DIR );
		shelljs.cp("-R", "./deploy/", APP_ENGINE_DIR );
	});

	desc("Lint Javascript");
	task("lint", function()
	{
		//console.log("Linting JS: .");
		process.stdout.write("Linting JS: .");

		jshint.checkFiles({files:["Jakefile.js", "./src/**/*.js"],
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
			browser:true,
			debug:true,
			newcap:false
		};
	}

	function lintGlobals()
	{
		return { "debugger":false };
	}

}());