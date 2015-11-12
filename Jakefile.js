/* globals desc:false, task:false, complete:false, fail:false */
(function()
{
	"use strict";

	var jshint = require('simplebuild-jshint');


	desc("Default task");
	task("default",["lint"],function()
	{
		console.log("Build OK!");
	});

	desc("Fixing Javascript");
	task("fixmysjs", function()
	{

	});


	desc("Lint Javascript");
	task("lint", function()
	{
		console.log("Linting JS: .");

		//jshint.checkFiles({files:["Jakefile.js", "./src/*.js"],
			jshint.checkFiles({files:["Jakefile.js", "./public/js/*.js","!./public/js/jquery.js"],
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