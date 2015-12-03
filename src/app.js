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

			function onPotTankerSelected( evt )
			{	
				var pottingResult   = data.getPotting( evt.detail.enteredProducts );

				showPotting( pottingResult );
			}

			function onBalanceTankerSelected( evt )
			{
				var pottingResult = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );

				showPotting( pottingResult );
			}

			function showPotting( pottingResult )
			{
				var  messages = [];

				pottingResult.pottedProducts.forEach( function( result )
				{
					messages.push( responder.getPottingResponse( result ));
				});

				view.showResults( pottingResult.potsUsed );
				view.updateProductInputs( data.getProductTotals() );
				view.showFeedback( messages );
			}

			function onSwapPotContents( evt )
			{
				var pottingResult = data.changePotPosition( evt.detail.pot1, evt.detail.pot2 );

				view.showResults( pottingResult.potsUsed );

				showPottingFeedback( pottingResult.pottedProducts );

				view.updateProductInputs( data.getProductTotals() );
			}

			function showPottingFeedback( pottingConfiguration )
			{
				
			}


			
}());            