/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
			var PottingData             = require('./PottingData.js');
			var ViewController          = require("./ViewController.js");
			var PottingResponder 		= require('./PottingResponse.js');

			var data;
			var view;
			var responder;

			window.onload   = function()
			{
				data                = PottingData();
				view                = ViewController( document.querySelector(".content") );
				responder			= PottingResponder();

				data.loadProductData( onProductDataLoaded );
				
				document.querySelector("#productInputs").addEventListener("fillTanker", onBalanceTankerSelected );
				document.querySelector("#productInputs").addEventListener("potTanker", onPotTankerSelected );                
				document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );
				document.querySelector("#pottingContainer").addEventListener("swapPots", onSwapPotContents );
			};

			function onChangeTerminal( evt )
			{
				console.log("Changing terminal to " + evt.detail );

				var newTerminal = data.changeTerminal( evt.detail );
					
				view.updateTerminal( newTerminal.pots, newTerminal.products );
			}

			function onProductDataLoaded( )
			{
				var currentTerminal = data.changeTerminal( "bramhall" );

				view.init( currentTerminal.pots, currentTerminal.products );
			}

			function onSwapPotContents( evt )
			{
				var newPotting = data.movePots( evt.detail.pot1, evt.detail.pot2 );
				view.showResults( newPotting );
			}

			function onPottingChanged( pots )
			{
				/*I want to respond to potting changing manually, without invoking the potting controller
					-accept a list of potting results
						PottingSet
						Product
				*/
			}

			 //Filling all pots with single product. Invoked when Fill Balance is selected with no other product values entered.
			function onBalanceTankerSelected( evt )
			{
				var pottingResult   = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );
				
				view.showResults( pottingResult.potsUsed );

				showPottingFeedback( pottingResult.pottedProducts );

				view.updateProductInputs( data.getProductTotals() );
			}

			function showPottingFeedback( pottingConfiguration )
			{
				var  messages = [];

				pottingConfiguration.forEach( function( result )
				{
					messages.push( responder.getPottingResponse( result ));
				});

				view.showFeedback( messages );
			}


			function onPotTankerSelected( evt )
			{
				var forProducts        = evt.detail.enteredProducts;
				var messages 		= [];
				var pottingResult   = data.getPotting( forProducts );

				view.showResults( pottingResult.potsUsed );

				showPottingFeedback( pottingResult.pottedProducts ); 
			}
}());            