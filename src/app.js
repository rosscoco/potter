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
				var pottingResult   = data.potProducts( evt.detail.enteredProducts );

				showPotting( pottingResult );
			}

			function onBalanceTankerSelected( evt )
			{
				console.log("app.js:: Balance Tanker" + Math.random().toFixed(4));

				var pottingResult = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );

				showPotting( pottingResult );
				var totals = data.getProductTotals();

				var prodToUpdate = {};
				
				prodToUpdate[ evt.detail.productToFill ] = totals[ evt.detail.productToFill ];

				view.updateProductInputs( prodToUpdate );
			}

			function showPotting( pottingResult )
			{
				var  messages = [];

				pottingResult.pottedProducts.forEach( function( result )
				{
					messages.push( responder.getPottingResponse( result ));
				});

				view.showResults( pottingResult.potsUsed );
				
				view.showFeedback( messages );
			}

			function onIncreasePotContents( evt )
			{
				var pottingResult = data.increasePot( evt.detail.potId );
			}

			function onSwapPotContents( evt )
			{
				var pottingResult = data.changePotPosition( evt.detail.fromPot, evt.detail.toPot );

				view.showResults( pottingResult.potsUsed );

				showPotting( pottingResult );

				//view.updateProductInputs( data.getProductTotals() );
			}


			
}());            