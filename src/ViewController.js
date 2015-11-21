(function()
{
	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var Tabs                    = require('./Tabs.js');

	var _formController;
	var _pottingDisplay;
	var _tabController;

	var _domElements;

	function updatePotDisplay( withPots )
	{
		_pottingDisplay.clear();
		_pottingDisplay.init( withPots );
	}

	function init( withDom, usingPots )
	{
		_domElements 		= withDom;

		//var arrayCopy       = Array.prototype.slice;

        var formNode        = withDom.querySelector("#productInputs");
		var potDisplayNode  = withDom.querySelector("#pottingDisplay");

        //_formController 	= new PotInputController( formNode, availableProducts );
		//_pottingDisplay     = new PotDisplayController( potDisplayNode );

       
        formNode.addEventListener("clearTanker", onClearTankerSelected );

        //_pottingDisplay.init( basePots );
	}

	function onClearTankerSelected( evt )
	{
	    console.log("Removing Product from tanker. Products Left: ");
	    _pottingDisplay.reset();    
	}
}());
