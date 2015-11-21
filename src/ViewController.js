(function()
{
	module.exports = ViewController;

	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var Tabs                    = require('./Tabs.js');

	var _formController;
	var _pottingDisplay;
	var _tabController;
	var _tabs;

	var _domElements;

	function ViewController( withDom )
	{
		_domElements = withDom;

		return {init: init, updateTerminal:updateTerminal};
	}

	function updateTerminal( withPots, withProducts )
	{
		_formController.updateProductList( withProducts );
		_pottingDisplay.clear();
		_pottingDisplay.init( withPots );
	}

	function init( usingPots, usingProducts )
	{
		//var arrayCopy       = Array.prototype.slice;

        var formNode        = _domElements.querySelector("#productInputs");
		var potDisplayNode  = _domElements.querySelector("#pottingDisplay");
		var tabsNode		= _domElements.querySelector(".tabs");

		tabsNode.addEventListener("onChangeTerminal", onChangeTerminal );

        _formController 	= new PotInputController( formNode, usingProducts );
		_pottingDisplay     = new PotDisplayController( potDisplayNode );
		_tabs 				= new Tabs( tabsNode );
       
        formNode.addEventListener("clearTanker", onClearTankerSelected );
	}

	function onChangeTerminal( evt )
	{
		console.log("Changed!" + evt.detail);
	}


	function onClearTankerSelected( evt )
	{
	    console.log("Removing Product from tanker. Products Left: ");
	    _pottingDisplay.reset();
	}
}());
