/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            var PottingController       = require("./PottingController.js");
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");
            var PottingResults          = require("./PottingResults.js");

            
            var potter;
            var data;
            var view;
            var currentTerminal;
            var results;

            window.onload   = function()
            {
                data            = new PottingData();
                view            = new ViewController( document.querySelector(".content") );
                results         = PottingResults();

                data.loadProductData( onProductDataLoaded );
                
                document.querySelector("#productInputs").addEventListener("fillTanker", onFillTankerSelected );
                document.querySelector("#productInputs").addEventListener("potTanker", onPotTankerSelected );                
                document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );
            };

            function onChangeTerminal( evt )
            {
                console.log("Changing terminal to " + evt.detail );

                currentTerminal = data.getTerminalData( evt.detail );

                potter          = new PottingController( currentTerminal.pots );
                    
                view.updateTerminal( currentTerminal.pots, currentTerminal.products );
            }

            function onProductDataLoaded( )
            {
                console.log("Product Data Loaded!!");
                currentTerminal = data.getTerminalData("bramhall");

                potter          = new PottingController( currentTerminal.pots );

                view.init( currentTerminal.pots, currentTerminal.products );
            }

            //Filling all pots with single product. Invoked when Fill Balance is selected with no other product values entered.
            function onFillTankerSelected( evt )
            {
                var maxWeight       = 440000;
                var productData     = currentTerminal.getProductData( evt.detail.productToFill );

                var maxLitres       = maxWeight * productData.density;
                var maxCapacity     = currentTerminal.getTankerCapacity();

                var amountToFill    = Math.min( maxLitres, maxCapacity );

                console.log("Filling Tanker With: " + evt.detail.productToFill + ". Other Products: ");
                console.log("Max L by weight = " + maxLitres + ": Max Capacity by L " + maxCapacity );

                potProduct( {id:evt.detail.productToFill, amount:amountToFill }, currentTerminal.pots.slice() );
            }

            function getPotString( pots )
            {
                return pots.reduce( function( debugString, potData )
                {   
                    return debugString+ "[" + potData.id +"]:" + potData.contents + "/" + potData.capacity + " " + potData.product;
                },'');
            }

            function potProduct( product, pots )
            {
                var pottingUsed = potter.doPottingWithProduct( {id:product.productToFill, amount:product.amountToFill }, pots );
                var bestPotting = pottingUsed[ 0 ];

                view.updatePotting( bestPotting.getUsedPots() );
            }

            function onPotTankerSelected( evt )
            {
                console.log( "Potting Tanker With:"  );

                console.table( evt.detail );

                var products        = evt.detail.enteredProducts;
                var availablePots   = currentTerminal.pots.slice();
                var usedPottingSets;
                var bestPottingSet;
                var usedPotIds;
                var filledPotsToShow;
             
                var results = [];

                /*products.forEach( function( productDetails )
                {
                    if ( availablePots.length === 0 )
                    {
                        results.push( PottingResults.noPotsLeft( productDetails ));
                        return;
                    }

                    if ( pottingResults.alreadyPotted( productDetails ) )
                });

                products.every( function( productData )
                {
                    console.log("Available Pots: " + getPotString(availablePots));

                    if ( availablePots.length < 1 )
                    {
                        return false;
                    }

                    console.log("Next product. Potting " + productData.amount + " of " + productData.id );

                    usedPottingSets     = potter.doPottingWithProduct( productData, availablePots.slice() );
                    bestPottingSet      = usedPottingSets[ 0 ];
                    usedPotIds          = bestPottingSet.getUsedPotsById();

                    availablePots       = availablePots.filter( function getRemainingPots( potData )
                    {
                        if (  usedPotIds.indexOf( potData.id ) === -1 )
                        {
                            return true;
                        }
                    });

                    filledPotsToShow = bestPottingSet.getUsedPots();

                    view.updatePotting( filledPotsToShow );

                    return true;
                });*/
                
            }
}());            