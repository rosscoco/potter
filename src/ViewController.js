(function()
{
	module.exports = ViewController;

	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var cPottingResult 			= require("./data/PottingResult.js");
    var PottingResult 			= new cPottingResult();
    var Tabs                    = require('./Tabs.js');

	var _formController;
	var _pottingDisplay;
	var _tabController;
	var _tabs;

	var _domElements;

	function ViewController( withDom )
	{
		_domElements = withDom;

		return { 	init: 			init, 
					updateTerminal: updateTerminal,
					showResults: 	showResults,
					showFeedback: 	showFeedback,
					updateProductInputs:updateProductInputs };
	}

	function updatePotting( potDataArray )
	{
		
	}

	function showResults( potDataArray, messages  )
	{
		_pottingDisplay.reset();

		if ( potDataArray )
		{
			potDataArray.forEach( function( singlePotData )
	        {
	            _pottingDisplay.updatePot( singlePotData );
	        });
		}

		if ( messages )
		{
			
		}
	}

	function updateProductInputs( productData )
	{
		for ( var prodId in productData )
		{
			if ( productData.hasOwnProperty( prodId ))
			{
				_formController.updateInput( { id:prodId, amount: productData[ prodId ] });					
			}			
		}
	}

	function showFeedback( messageList )
	{
		var classes = [];

		classes[ PottingResult.SUCCESS 	] = [ "has-success","has-feedback"];
		classes[ PottingResult.ERROR 	] = [ "has-error","has-feedback"];
		classes[ PottingResult.WARN 	] = [ "has-warning","has-feedback"];

		_formController.clearFeedback();

		messageList.forEach( function( messageData )
		{
			messageData.classes 	= classes[ messageData.pottingStatus ];
			//using apply allows us to pass an array of arguments to be called as ordered function params
			//messageDiv.classList.add.apply( messageDiv.classList, classes[ messageData.pottingStatus ]);

			_formController.showProductFeedback( messageData );
		});
	}

	function updateTerminal( withPots, withProducts )
	{
		_formController.updateProductList( withProducts );
		_pottingDisplay.clear();
		_pottingDisplay.init( withPots );
	}

	function init( usingPots, usingProducts )
	{
		var formNode        = _domElements.querySelector("#productInputs");
		var potDisplayNode  = _domElements.querySelector("#pottingContainer");
		var tabsNode		= _domElements.querySelector(".tabs");

		_formController 	= new PotInputController( formNode, usingProducts );
		_pottingDisplay     = new PotDisplayController( potDisplayNode );
		_tabs 				= new Tabs( tabsNode );
       
		updateTerminal( usingPots, usingProducts );
       	
       	tabsNode.addEventListener("onChangeTerminal", onChangeTerminal );
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
