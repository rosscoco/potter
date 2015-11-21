(function()
{
	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var Tabs                    = require('./Tabs.js');

	var _formController;
	var _pottingDisplay;
	var _tabController;
	var _tabs;

	var _domElements;


	function updateTerminal( withPots, withProducts )
	{
		_formController.updateProductList( withProducts );
		_pottingDisplay.clear();
		_pottingDisplay.init( withPots );
	}

	function init( withDom, usingPots, usingProducts )
	{
		_domElements 		= withDom;

		//var arrayCopy       = Array.prototype.slice;

        var formNode        = withDom.querySelector("#productInputs");
		var potDisplayNode  = withDom.querySelector("#pottingDisplay");
		var tabsNode		= withDom.querySelector(".tabs");

        _formController 	= new PotInputController( formNode, usingProducts );
		_pottingDisplay     = new PotDisplayController( potDisplayNode );
		_tabs 				= new Tabs( tabsNode );
       
        formNode.addEventListener("clearTanker", onClearTankerSelected );
	}

	function onClearTankerSelected( evt )
	{
	    console.log("Removing Product from tanker. Products Left: ");
	    _pottingDisplay.reset();
	}
}());
