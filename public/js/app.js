/* globals PottingSetList:false, PottingController:false */
           var potInput;
            var amount;
            
            var permMax     = 2;
            var permCurrent = 0;
            var currentProduct;
            var pottingController;

            var uiRefs = {};

            var products = [    {id:"1051512", amount:22800, pottingUsed:[] },
                                {id:"1051510", amount:12000, pottingUsed:[] }];

            var basePots = [    {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                {id:3,capacity:7000, contents:0, product:"", minimum:3500},
                                {id:4,capacity:7600, contents:0, product:"", minimum:3800},
                                {id:5,capacity:6000, contents:0, product:"", minimum:3000},
                                {id:6,capacity:7000, contents:0, product:"", minimum:6000}];

            var testPots =  [    {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                
                                {id:4,capacity:7600, contents:0, product:"", minimum:3800}];

            var testProduct = {id:"1051510", amount:18000, pottingUsed:[] };

            var uiElements = {};

            window.onload = function()
            {
                pottingController = new PottingController( basePots );
                initUI();
                //test()
            };

            function initUI()
            {
                var arrayCopy = Array.prototype.slice;

                uiElements.pottingButtons      = arrayCopy.call( document.querySelectorAll(".btn_fillTanker")   );
                uiElements.productInputSets    = arrayCopy.call( document.querySelectorAll(".productInputSet")  );
                uiElements.potDisplays         = arrayCopy.call( document.querySelectorAll("div[id*='pot'"));
                
                //   
                basePots.forEach( function( potData )
                {
                    document.getElementById("pot"+ potData.id ).getElementsByTagName("h1")[0].innerHTML = potData.capacity;
                });

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

            function fillTankerWithProduct( productToFill )
            {
                resetPotDisplays();

                var selectedProducts    = getEnteredProductAmounts();
                var usedPottingSets 	= [];

                //usedPottingSets.push( pottingController.doPottingWithProduct( selectedProducts[0] ));
                //debugger;
                usedPottingSets         =  pottingController.doPottingWithProduct( selectedProducts[0], basePots.slice() );
                
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

            function potProducts()
            {
                var usedPottingSets = pottingController.doPottingWithProducts( products );
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
                    })*/
                });
            }