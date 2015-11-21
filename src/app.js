/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function(){
            var potInput;
            var amount;
            
            var permMax     = 2;
            var permCurrent = 0;
            var currentProduct;            

            var PottingController       = require("./PottingController.js");
            var PotDisplayController    = require("./PotDisplayController.js");
            var PotInputController      = require("./PotInputController.js");
            var Tabs                    = require('./Tabs.js');

            var potter;
            var formController;
            var pottingDisplay;
            var tabController;

            var uiRefs      = {};

            var availableProducts = [   {id:1051510, density:0.83,name:"Blah"},
                                        {id:1051485, density:0.83,name:"Blah"},
                                        {id:1051643, density:0.83,name:"Blah"}] ;

            var products    = [     {id:"1051512", amount:22800, pottingUsed:[] },
                                    {id:"1051510", amount:12000, pottingUsed:[] }];

            var basePots    = [     {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                    {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                    {id:3,capacity:7000, contents:0, product:"", minimum:3500},
                                    {id:4,capacity:7600, contents:0, product:"", minimum:3800},
                                    {id:5,capacity:6000, contents:0, product:"", minimum:3000},
                                    {id:6,capacity:7000, contents:0, product:"", minimum:6000}];

            var testPots    =  [    {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                    {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                    {id:4,capacity:7600, contents:0, product:"", minimum:3800}];

            var testProduct =       {id:"1051510", amount:18000, pottingUsed:[] };

            var uiElements  = {};

            window.onload   = function()
            {
                potter          = new PottingController( basePots );
                tabController   = Tabs();

                tabController.init( document.querySelector('.tabs'));
                
                console.log("loading");
                initUI();
            };

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
            }

            function onClearTankerSelected( evt )
            {
                console.log("Removing Product from tanker. Products Left: ");
                pottingDisplay.reset();
                
            }

            function initUI()
            {
                var arrayCopy       = Array.prototype.slice;

                var formNode        = document.querySelector("#productInputs");
                formController  = PotInputController( formNode, availableProducts );

                formNode.addEventListener("fillTanker", onFillTankerSelected );
                formNode.addEventListener("potTanker", onPotTankerSelected );
                formNode.addEventListener("clearTanker", onClearTankerSelected );

                var potDisplayNode  = document.querySelector("#pottingDisplay");
                pottingDisplay      = PotDisplayController( potDisplayNode );

                pottingDisplay.init( basePots );
            }



}());            