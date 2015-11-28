/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            var PottingController       = require("./PottingController.js");
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");
            var PottingResponse         = require("./PottingResponse.js");
            var Utils                   = require("./Utils.js");
            
            var potter;
            var data;
            var view;
            var currentTerminal;
            var pottingResponder;

            window.onload   = function()
            {
                data            = new PottingData();
                view            = new ViewController( document.querySelector(".content") );
                pottingResponder        = PottingResponse();

                data.loadProductData( onProductDataLoaded );
                
                document.querySelector("#productInputs").addEventListener("fillTanker", onFillTankerSelected );
                document.querySelector("#productInputs").addEventListener("potTanker", onPotTankerSelected );                
                document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );
                document.querySelector("#pottingContainer").addEventListener("swapPots", onSwapPotContents );
            };

            function onChangeTerminal( evt )
            {
                console.log("Changing terminal to " + evt.detail );

                var newTerminal = data.getTerminalData( evt.detail );

                potter          = new PottingController( currentTerminal.pots );
                    
                view.updateTerminal( newTerminal.pots, newTerminal.products );
            }

            function onProductDataLoaded( )
            {
                console.log("Product Data Loaded!!");
                currentTerminal = data.changeTerminal("bramhall");

                potter          = new PottingController( currentTerminal.pots );

                view.init( currentTerminal.pots, currentTerminal.products );
            }

            function onSwapPotContents( evt )
            {
                var newPotting = data.movePots( evt.detail.pot1, evt.detail.pot2 );
                view.showResults( newPotting );
            }

            
            //Filling all pots with single product. Invoked when Fill Balance is selected with no other product values entered.
            function onFillTankerSelected( evt )
            {
                var weightUsed = 0;

                evt.detail.enteredProducts.forEach( function( productData )
                {
                    weightUsed += productData.amount * currentTerminal.getProductData( productData.id ).density;
                });

                   

                var litresAvailable = ( currentTerminal.getMaxWeight() - weightUsed ) * ( 1 / currentTerminal.getProductData( evt.detail.productToFill ).density );
                var fillProductData = { id: evt.detail.productToFill, amount: litresAvailable };

                evt.detail.enteredProducts.push( fillProductData );

                console.log("Filling Tanker With: " + litresAvailable + " of " + evt.detail.productToFill );

                view.updateProductInputs([ fillProductData ]);

                onPotTankerSelected( evt );
            }



            function potProduct( product, pots )
            {
                var pottingUsed = potter.doPottingWithProduct( {id:product.productToFill, amount:product.amountToFill }, pots );
                var bestPotting = pottingUsed[ 0 ];

                view.updatePotting( bestPotting.getUsedPots() );
            }

            function onPottingChanged(pots)
            {
                /*I want to respond to potting changing manually, without invoking the potting controller
                    -accept a list of potting results
                        PottingSet
                        Product
                */
            }

            function onPotTankerSelected( evt )
            {
                var forProducts     = evt.detail.enteredProducts;
                var results         = [];
                var potList         = data.getPotting( forProducts );

                view.showResults( potList );
                //data.setPotting( allUsedPots );


/*                products.forEach( function( productDetails )
                {
                    if ( availablePots.length === 0 ) return;

                    productDetails      = currentTerminal.checkWeight( productDetails, currentWeight );
                    pottingResult       = potter.doPottingWithProduct( productDetails, availablePots.slice() );


                    //currentUsedPots     = pottingResult.pottingUsed.getUsedPots();

                    //messages.push( pottingResponder.getPottingResponse( productDetails, pottingResult ) );

                    currentWeight       += currentUsedPots.reduce( function reduceToProductWeight( total, potData )
                    {
                        return total + potData.contents * currentTerminal.getProductData( potData.product ).density;
                    }, 0 );
                    
                    allUsedPots         = allUsedPots.concat( currentUsedPots );
                    availablePots       = Utils.filterRemainingPots( allUsedPots, availablePots );
                });*/

                //updatePotting( messages )
                

                //view.updatePotting( filledPots );
            }
}());            