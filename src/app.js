/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            var PottingController       = require("./PottingController.js");
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");

            var potter;
            var data;
            var view;
            var currentTerminal;

            window.onload   = function()
            {
                data            = new PottingData();
                view            = new ViewController( document.querySelector(".content") );

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

                view.init( currentTerminal.pots, currentTerminal.products );
            }

            function onFillTankerSelected( evt )
            {
                console.log("Filling Tanker With: " + evt.detail.productToFill + ". Other Products: ");

                var maxWeight = 440000;
                var productData = currentTerminal.getProductData( evt.detail.productToFill );

                var maxLitres = 44000 * productData.density;
                var maxCapacity = currentTerminal.getTankerCapacity();

                var amountToFill = Math.min( maxLitres, currentTerminal.getTankerCapacity() );
                console.log("Max L by weight = " + maxLitres + ": Max Capacity by L " + maxCapacity );

                var pottingUsed = potter.doPottingWithProduct( {id:evt.detail.productToFill, amount:amountToFill }, currentTerminal.pots.slice() );
                var bestPotting = pottingUsed[ 0 ];

                view.updatePotting( bestPotting.getUsedPots() );
            }

            function getPotString( pots )
            {
                return pots.reduce(function( debugString, potData )
                {   
                    return debugString+ "[" + potData.id +"]:" + potData.contents + "/" + potData.capacity + " " + potData.product;
                },'');
            }

            function onPotTankerSelected( evt )
            {
                console.log("Potting Tanker With: ");

                var products        = evt.detail.enteredProducts;
                var availablePots   = currentTerminal.pots.slice();
                var usedPottingSets;
                var bestPottingSet;
                var usedPotIds;
                var filledPotsToShow;
                
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
                });
                
            }
}());            