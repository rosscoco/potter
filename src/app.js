/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            var PottingController       = require("./PottingController.js");
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");
            var PottingResults          = require("./PottingResults.js");
            var Utils                   = require("./Utils.js");
            
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

                //potProduct( {id:evt.detail.productToFill, amount:amountToFill }, currentTerminal.pots.slice() );
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
                var products        = evt.detail.enteredProducts;
                var availablePots   = currentTerminal.pots.slice();
                var messages        = [];
                var allUsedPots     = [];
                var currentWeight   = 0;
                
                var currentUsedPots;                
                var bestPottingSet;
                var pottingResult;

                view.showResults( null );

                products.forEach( function( productDetails )
                {
                    console.log("onPotTankerSelected()::Potting " + productDetails.id + " using " + availablePots.join(" & "));

                    if ( availablePots.length === 0 ) return;

                    productDetails      = currentTerminal.checkWeight( productDetails, currentWeight );

                    pottingResult       = potter.doPottingWithProduct( productDetails, availablePots.slice() );
                    currentUsedPots     = pottingResult.pottingUsed.getUsedPots();

                    //pottingResult       = results.getPottingResults( forProduct, bestPottingSet );
                    
                    messages.push( results.getPottingResults( productDetails, pottingResult ) );

                    currentWeight       += currentUsedPots.reduce( function reduceToProductWeight( total, potData )
                    {
                        var density = currentTerminal.getProductData( potData.product ).density;
                        var amount = potData.contents;
                        var potWeight = density * amount;
                        var tally = total + potWeight;

                        return total + potData.contents * currentTerminal.getProductData( potData.product ).density;
                    }, 0 );

                    allUsedPots         = allUsedPots.concat( currentUsedPots );                    
                    availablePots       = Utils.filterRemainingPots( allUsedPots, availablePots );
                });

                //view.updatePotting( filledPots );

                view.showResults( allUsedPots, messages );
            }

           /* function checkWeight( productToPot, alreadyPotted )
            {
                var currentWeight = alreadyPotted.reduce( function countProductWeight(total, product )
                {
                    return total + product.amount * currentTerminal.getProductData( product.id ).density;
                },0);

                var toPotDensity =  currentTerminal.getProductData( productToPot.id ).density;

                if ( toPotDensity * productToPot.amount + currentWeight > currentTerminal.getMaxWeight() )
                {
                    var litresAvailable = Math.max( currentTerminal.getMaxWeight() - currentWeight, 0 ) / toPotDensity;   // * ( 1 / toPotDensity );
                    
                    productToPot.remainder = productToPot.amount - litresAvailable;
                    productToPot.amount = litresAvailable;
                }

                return productToPot;
            }*/

                    /*var alreadyPotted = results.isAlreadyPotted( productDetails, availablePots );

                    if ( alreadyPotted )
                    {
                        messages.push( alreadyPotted );
                        return;
                    }

                    if ( availablePots.length === 0 )
                    {
                        messages.push( results.noPotsLeft( productDetails ));
                        return;
                    }

                    var usedPottingSet = potter.doPottingWithProduct( productDetails, availablePots.slice() );
                    var potsUsed = usedPottingSet.getUsedPots();



                    if ( usedPottingSet.isValid() )
                    {
                        messages.push( results.pottingSuccess( productDetails, potsUsed  ));
                    }
                    else
                    {
                        messages.push( results.pottingFail( productDetails, potsUsed ));
                    }

                    usedPotIds          = usedPottingSet.getUsedPotsById();

                    filledPots  = filledPots.concat( potsUsed );

                    availablePots       = availablePots.filter( function getRemainingPots( potData )
                    {
                        if (  usedPotIds.indexOf( potData.id ) === -1 )
                        {
                            return true;
                        }
                    });                     
                });

                view.updatePotting( filledPots );
                //view.showResults( messages );
                
            }*/
}());            