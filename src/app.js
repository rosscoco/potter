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

            var potter;
            var formController;
            var pottingDisplay;

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
                potter = new PottingController( basePots );

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

                     //getRemainingPots( availablePots, bestPottingSet.getUsedPotsById() );
                });
                
                


            }

            function onClearTankerSelected( evt )
            {
                console.log("Removing Product from tanker. Products Left: ");
                potDisplay.reset();
                
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

                /*formDisplay.addEventListener("onFillTankerWithProduct", onFillTankerWithProduct );

                uiElements.pottingButtons      = arrayCopy.call( document.querySelectorAll(".btn_fillTanker"));
                uiElements.productInputSets    = arrayCopy.call( document.querySelectorAll(".productInputSet"));
                //uiElements.potDisplays         = arrayCopy.call( document.querySelectorAll("div[id*='pot'"));
                

                document.querySelector("#wrapper").appendChild( domelement );

                uiElements.productInputSets.forEach( function( inputSet )
                {
                    inputSet.addEventListener("click", function( evt )
                    {
                        if ( evt.target && evt.target.className === "btn_fillTanker" )
                        {
                            //remove any input values from the selected input set as we are filling the tanker to capacity, not by the entered value
                            var txtInput        = this.querySelector(".txt_inputAmount");
                            //txtInput.value      = 0;
                            var productToFill   = evt.target.getAttribute( "id" ).split( "_" )[ 1 ];

                            fillTankerWithProduct( productToFill );
                        }
                    });
                });
            }



            function getEnteredProductAmounts( ignoreProduct )
            {
                var selectedProducts = uiElements.productInputSets.map( function getProductAmounts( inputGroup ) 
                    {
                        return {    id      :inputGroup.getAttribute("id").split("_")[1], 
                                    amount  :inputGroup.querySelector(".txt_inputAmount").value };
                    })
                    .filter( function removeZeroValues( inputValues )
                    {
                        if ( inputValues.amount > 0 ) return true;
                    });

                return selectedProducts;
            }

            function getRemainingPots( fromListOfPots, usedPotIds )
            {
                return fromListOfPots.filter( function removeUsedPots( potData )
                {
                    if (  usedPotIds.indexOf( potData.id ) === -1 )
                    {
                        return true;
                    }
                });
            }

            function fillTankerWithProduct( productToFill )
            {
                resetPotDisplays();

                var selectedProducts    = getEnteredProductAmounts();
                var usedPottingSets 	= [];

                var availablePots = basePots.slice();
                var bestPottingSet;
                
                selectedProducts.every( function( productData )
                {
                    if ( availablePots.length < 1 )
                    {
                        return false;
                    }

                    usedPottingSets     = controller.doPottingWithProduct( productData, availablePots );
                    bestPottingSet      = usedPottingSets[0];
                    availablePots       = getRemainingPots( availablePots, bestPottingSet.getUsedPotsById() );
                });
                
                var usedPotIds          = usedPottingSets.reduce( function( potIdList, pottingSet )
                                            {
                                                return potIdList + pottingSet.getUsedPotsById();
                                            },'');
                    
                var remainingPots       = basePots.filter( function( pot )
                                            {
                                                return usedPotIds.indexOf( pot.id ) === -1;
                                            });


                var bestPotting = usedPottingSets[0].getUsedPots();

                bestPotting.forEach( showPottingData );

                //var fillPottingController = new PottingController( remainingPots );

                /*usedPottingSets.forEach( function( pottingSetForProduct )
                {
                    var potsUsedForProduct = pottingSetForProduct.data;
                    potsUsedForProduct.forEach( showPottingData );
                });*/
            }

            function potSingleProduct( product, usingPots )
            {

            }

            function sortAscending( a, b)
            {

            }
            /*
            *@param potData - object containign pot id, product and volume
            */
            function showPottingData( potData )
            {
                console.log( "Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

                var potId = potData.id;

                var potDisplay = document.getElementById( 'pot' + potData.id );
                
                var potContents = potDisplay.querySelector(".potContents");

                potContents.setAttribute( "data-product", potData.product );

                potContents.style.height = Math.round( potData.contents / potData.capacity * 100 ) + "%";
            }

           /* function potProducts()
            {
                var usedPottingSets = controller.doPottingWithProducts( products );
                var potData;
                
                usedPottingSets.forEach( function( pottingSet )
                {
                    potData = pottingSet.getUsedPots();
                    potData.forEach( showPottingData );
                });
            }

            function getPotDisplays()
            {
                var potNodeList = document.querySelectorAll("div [id*]=pot");    //find all divs with *pot* in the id.

                var forEach = Array.prototype.forEach;

                forEach.call( potNodeList, function( potDiv ) 
                {

                });
            }

            function resetPotDisplays()
            {
                uiElements.potDisplays.forEach( function( potDomElement )
                {
                    potDomElement.querySelector('.potContents').setAttribute('data-product','');

                    /*var classes = potDomElement.querySelector('.potContents').className.split(' ').filter( function( className )
                    {
                        return className.indexOf('product') !== 0;  //remove product-****** from class name
                    })
                });
            }*/
}());            