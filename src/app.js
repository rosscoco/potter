/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            //
            //var PotDisplayController    = require("./PotDisplayController.js");
            //var PotInputController      = require("./PotInputController.js");
            //var Tabs                    = require('./Tabs.js');

            var PottingController       = require("./PottingController.js");
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");

            var potter;
            var data;
            var view;

            window.onload   = function()
            {
                //potter          = new PottingController( basePots );
                
                data            = new PottingData();
                view            = new ViewController( document.querySelector(".content") );

                data.loadProductData( onProductDataLoaded );
                
                document.addEventListener("fillTanker", onFillTankerSelected );
                document.addEventListener("potTanker", onPotTankerSelected );
                document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );

                console.log("loading");
            };

            function onChangeTerminal( evt )
            {
                console.log("Changing terminal to " + evt.detail );
                var terminal = data.getTerminalData(evt.detail);

                view.updateTerminal( terminal.pots, terminal.products );
            }

            function onProductDataLoaded( )
            {
                console.log("Product Data Loaded!!");
                var terminal = data.getTerminalData("bramhall");

                view.init( terminal.pots, terminal.products );
            }

            function onFillTankerSelected( evt )
            {
                console.log("Filling Tanker With: " + evt.detail.productToFill + ". Other Products: ");
                console.table( evt.detail.enteredProducts );
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
                /*
                console.log("Potting Tanker With: ");

                var products = evt.detail.enteredProducts;

                console.table( evt.detail.enteredProducts );

                var availablePots = basePots.slice();
                var usedPottingSets;
                var bestPottingSet;
                var usedPotIds;

                var filledPotsToShow;

                pottingDisplay.reset();

                products.every( function( productData )
                {
                    console.log("Available Pots: " + getPotString(availablePots));

                    if ( availablePots.length < 1 )
                    {
                        return false;
                    }

                    console.log("Next product. Potting " + productData.amount + " of " + productData.id );

                    usedPottingSets     = potter.doPottingWithProduct( productData, availablePots.slice() );
                    bestPottingSet      = usedPottingSets[0];
                    usedPotIds          = bestPottingSet.getUsedPotsById();

                    availablePots       = availablePots.filter( function getRemainingPots( potData )
                    {
                        if (  usedPotIds.indexOf( potData.id ) === -1 )
                        {
                            return true;
                        }
                    });

                    filledPotsToShow = bestPottingSet.getUsedPots();

                    filledPotsToShow.forEach( function( singlePotData )
                    {
                        pottingDisplay.updatePot( singlePotData );
                    });

                    return true;
                });
                */
            }
}());            