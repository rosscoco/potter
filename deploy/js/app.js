(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function()
{
	module.exports = function PotDisplayController( _domElement )
	{
		var _potContents = {};	//cache of all .potContents elements
		var _displayNode = _domElement;

		var alreadyCreated = document.querySelectorAll("#pottingDisplay").length !==0;

		if ( alreadyCreated )
		{
			//do stuff...
			//return false;
		}

		//init();

		return {
			init	: init,
			updatePot: updatePot,
			reset: reset 
		};	

		function init( allPotData )
		{
			//clear();

			//_displayNode = document.createElement('div');
			//_displayNode.id = "pottingDisplay";

			allPotData.forEach( function( potData, i )
			{
				/*
				<div class="potContainer" id="pot1">
	                <h1>7600</h1>
	                <div class="pot">
	                    <div class="potContents"></div>
	                </div>    
	            </div>
	            */

				var container 		= document.createElement('div');
				var header 			= document.createElement('h1');
				var pot 			= document.createElement('div');
				var potContents 	= document.createElement('div');

				container.className = "potContainer";
				container.id 		= "pot" + ( i + 1 );

				header.innerHTML	= potData.capacity;

				pot.className 		= "pot";

				potContents.className = "potContents";
				potContents.setAttribute('data-product', 'none');
				_potContents[ '' + ( i + 1 ) ] = potContents;
				
				container.appendChild( header );
				container.appendChild( pot );
				pot.appendChild( potContents );

				_displayNode.appendChild( container );
			});

			return _displayNode;
			
			//intoDomNode.appendChild( potDisplay );

		} 

	    function updatePot( potData )
        {
        	console.log( "PotDisplayController::Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

            var potId = potData.id;

            //var potDisplay = document.getElementById( 'pot' + potData.id );
            
            var potContents = _potContents[ potData.id ];//potDisplay.querySelector(".potContents");

            potContents.setAttribute( "data-product", potData.product );

            potContents.style.height = Math.round( potData.contents / potData.capacity * 100 ) + "%";
        }

		function update( withProductData )
		{

		}

		function clear()
		{
			_potContents = [];

			if ( _displayNode )
			{
				_displayNode.parentNode.removeChild( _displayNode );	
			}
			
		}

		function reset()
		{
			for ( var potId in _potContents )
			{
				if ( _potContents.hasOwnProperty( potId ))
				{	
					_potContents[ potId ].setAttribute('data-product','none');
					_potContents[ potId ].style.height = 0;
				}
			}

/*			_potContents.forEach( function( potDOMDisplay )
			{
				potDOMDisplay.setAttribute('data-product','none');
				potDOMDisplay.style.height = 0;
			});*/
		}
	};

}());
},{}],2:[function(require,module,exports){
(function()
{
	module.exports = function PotInputController( usingDom, availableProducts )
	{
		

		

		var _domElement 	= usingDom;
		var _inputGroups	= [].slice.call( _domElement.querySelectorAll( "[id^='input']" ));
		var _products		= availableProducts;

		var testElement = _domElement.querySelector( "[id=input_1051510]");
		var textElement = testElement.querySelector("[id^=product]");

		console.log(textElement);

		init( availableProducts );

		if ( _inputGroups.length === 0 )
		{
			console.log("PotInputController::No inputs");
		}

		return { init: init };

		function getEnteredProductAmounts()
        {
        	var selectedProducts = _inputGroups.map( function getProductAmounts( inputGroup ) 
                {
                    return {    id      :inputGroup.getAttribute("id").split("_")[1], 
                                amount  :inputGroup.querySelector("[id^=productInput").value };
                })
                .filter( function removeZeroValues( inputValues )
                {
                    if ( inputValues.amount > 0 ) return true;
                });

            return selectedProducts;
        }

		function init( availableProducts )
		{
			var usedProductIds = availableProducts.reduce( function getProductIds( list, nextProduct )
			{
				return list + ' ' + nextProduct.id;
			},'');

			console.log("PotInputController:: checking inputs against " + usedProductIds );

			_inputGroups.forEach( function hideUnusedProducts( inputGroup )
			{
				var forProduct 		= inputGroup.id.split('_')[1];
				var txtInput        = inputGroup.querySelector("[id^=productInput]");
            	txtInput.value      = 0;


				if ( usedProductIds.indexOf( forProduct ) < 0 )
				{
					console.log("Hiding " + forProduct );
					inputGroup.style.display = "none";
				}

				inputGroup.addEventListener("click", function( evt )
		            {
		            	var isFillBtn	= evt.target.id.split("_")[0] === "btnFill";
		            	var isClearBtn 	= evt.target.id.split("_")[0] === "btnClear";

		                if ( isFillBtn )
		                {	evt.stopPropagation();
		                	onFillTanker( this );	                    
		                	return;
		                }

		                if ( isClearBtn )
		                {
		                	evt.stopPropagation();
		                	onClearProduct( this );
		                	return;
		                }
		            });
			});
		}

		function onFillTanker( selectedInputGroup )
		{
			console.log("PotInputController::onFillTanker()");
			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = 0;
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var otherProducts	= getEnteredProductAmounts();

            var detail			= { enteredProducts:otherProducts, productToFill:productToFill };

			var fillEvent 		= new CustomEvent("fillTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onClearProduct( selectedInputGroup )
		{
			console.log("PotInputController::onClearProduct()");
			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = 0;

            var enteredProducts	= getEnteredProductAmounts();

            var evt;
            var detail = { enteredProducts : enteredProducts };

            if ( enteredProducts.length === 0 )
            {
            	evt = new CustomEvent("clearTanker");
            }
            else
            {
            	evt = new CustomEvent("potTanker", { detail:detail } );
            }

            _domElement.dispatchEvent( evt );	
		}
	};
}());
},{}],3:[function(require,module,exports){

(function()
{
	"use strict";

	var Utils 			= require("./Utils.js");
	var PottingSetList	= require("./PottingSetList.js");

	module.exports = function PottingController( listOfPots )
	{
	    var _basePots   = listOfPots;
	    var _activePots,_products;
	    
	    return {
	        doPottingWithProduct   : doPottingWithProduct,
	        usedPots :_basePots
	    };

	    function putProductIntoPots( product )
	    {
	    		
	    }

	    function doPottingWithProduct( withProduct, withPots )
	    {
	        _activePots             = withPots;        

	        var productRemainder    = {};
	        var pottingUsed         = [];
	        var usedPottingSet      = '';

	         var spaceAvailable     = _activePots.reduce( function ( count, potData )
	         {
	            return count + potData.capacity;
	         }, 0 );

	         if ( spaceAvailable < withProduct.amount )
	         {
	            withProduct.amount = spaceAvailable;
	            productRemainder[ withProduct.id ] = withProduct.amount - spaceAvailable;
	         }

	        usedPottingSet = getBestPotsForProduct( _activePots, withProduct );

	        pottingUsed.push( usedPottingSet );

	        return pottingUsed;
	    }

	    function getBestPotsForProduct( withPots, product )
	    {
	        var allPotPermutations  = Utils.getPotPermutations( withPots );

	        var allPottingSets      = new PottingSetList( allPotPermutations );
	        //var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var validPottingSets    = [];
	        var invalidPottingSets  = [];

	        var bestPottingSet      = allPottingSets.getBestPottingSet();

	        console.log( "Best Potting Set: ");
	        
	        return bestPottingSet;
	    }
	};
}());
},{"./PottingSetList.js":5,"./Utils.js":6}],4:[function(require,module,exports){
(function()
{
	"use strict";
	var PotSorter = require("./Utils.js").PotSorter;
	
	module.exports = function PottingSet( fromPotArr )
	{
	    var _availablePots = fromPotArr;

	    return {
	        putProductIntoPots      : putProductIntoPots,
	        getUsedPotsById         : getUsedPotsById,
	        willPotWithinRules      : willPotWithinRules,
	        getRemainingSpace       : getRemainingSpace,
	        getUsedPots             : getUsedPots,
	        isValid                 : isValid
	    };

	    function getUsedPots()
	    {
	        return _availablePots;
	    }

	    function isValid()
	    {
	        var valid = _availablePots.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	            fillLastPot();
	        }
	    }

	    function checkPotCapacityAgainstContents( isWithinRules, potData )
	    {
	        return isWithinRules && potData.capacity > potData.minimum;
	    }

	    function fillSinglePot( withProduct, pot )
	    {
	        console.log("Filling Pot " + pot.id + " with " + withProduct.amount + " of " + withProduct.id );

	        pot.product = withProduct.id;

	        if ( pot.capacity > withProduct.amount )
	        {
	            pot.contents = withProduct.amount;

	            return withProduct.amount;
	        }
	        else
	        {
	            pot.contents = pot.capacity;
	            withProduct.amount -= pot.capacity;
	            return pot.capacity;
	        }
	    }

	    function putProductIntoPots( product )
	    {
	        var usedPots = [];

	        _availablePots.forEach( function( nextPot )
	        {
	            if ( product.amount > 0 ) 
	            {
	                product.amount -= fillSinglePot( product, nextPot );
	                usedPots.push( nextPot );
	            }	        
	        });

	        _availablePots = usedPots;
	        //console.log( _availablePots );

	       // return product;        
	    }

	    function getRemainingSpace()
	    {
	        return _availablePots.reduce( function( count, nextPot )
	        {
	           //return count + nextPot.getCapacity() - nextPot.getContents();
	           return count + nextPot.capacity - nextPot.contents;
	        }, 0);
	    }

	    function getUsedPotsById()
	    {
	        _availablePots.sort( PotSorter.sortPotsById );
	        
	        return _availablePots.reduce( function( idList , nextPot  )
	        {
	            //return idList + nextPot.getId();
	            return idList + nextPot.id;
	        }, '');
	    }

	    function willPotWithinRules( potCombination )
	    {
	        var potToFill;
	        var otherPots = potCombination.filter( function( potData )
	        {
	            if ( potData.contents > potData.minimum )
	            {
	                return true;
	            }
	            else
	            {
	                potToFill = potData;
	            }
	        });

	        //count how much product is over each pots minimum amount. This will give us the total we can move to the last pot
	        var available = otherPots.reduce( function( productAvailable, nextPotToCheck )
	        {
	            return productAvailable + ( nextPotToCheck.contents - nextPotToCheck.minimum );
	        }, 0 );

	        //check there's enough product to move away from other pots
	        if ( potToFill.contents + available >= potToFill.minimum ) 
	        {
	            //If product available then move from other pots into the last pot
	            fillLastPot( potToFill, otherPots );

	            return true;
	        }
	        else
	        {
	            return false;   //cannot pot within rules
	        }
	    }

	    function IsGreaterThan( checkAgainst )
	    {
	        var mustBeGreaterThan = checkAgainst;

	        return function( amountToCheck )
	        {
	            return amountToCheck > checkAgainst;
	        };
	    }

	    function fillLastPot( lastPot, remainingPots )
	    {
	        var needed = lastPot.minimum - lastPot.contents;

	        var amountToMove;
	        var helperPot;

	        remainingPots.sort( PotSorter.sortPotsByAmountMoveable );

	        for ( var i = 0; i < remainingPots.length; i++ )
	        {
	            helperPot = remainingPots[i];

	            if ( helperPot.contents - needed > helperPot.minimum )
	            {
	                amountToMove = helperPot.contents - ( helperPot.contents - needed );
	            } 
	            else
	            {
	                //amountToMove = helperPot.contents - ( helperPot.contents - helperPot.minimum );
	                amountToMove = helperPot.contents  - helperPot.minimum;
	            }

	            needed              -= amountToMove;
	            helperPot.contents  -= amountToMove;
	            lastPot.contents    += amountToMove;

	            if ( lastPot.contents >= lastPot.minimum ) 
	            {
	                break;
	            }
	        }
	    }
	};
}());
},{"./Utils.js":6}],5:[function(require,module,exports){
(function()
{
	"use strict";
	
	var PotSorter = require('./Utils.js').PotSorter;
	var PottingSet = require('./PottingSet.js');

	module.exports = function PottingSetList( withListOfPots )
	{
	   var _listOfPottingSets = withListOfPots.map( function( potArray ) 
	    {
	        return new PottingSet( potArray );
	    });

	    return {
	        sendProductToPottingSets    : sendProductToPottingSets,
	        getBestPottingSet:getBestPottingSet 
	    };

	    function removeDuplicates()
	    {
	        var uniquePotCombos = [];
	        var listOfPotCombos = {};

	        var debugCounter = 0;

	        _listOfPottingSets.forEach ( function( pottingSet )
	        {
	            debugCounter++;

	            var usedPotIds = pottingSet.getUsedPotsById();

	            if ( listOfPotCombos[ usedPotIds ] )
	            {
	                listOfPotCombos[ usedPotIds ].push( pottingSet );
	            }
	            else
	            {
	                listOfPotCombos[ usedPotIds ] = [ pottingSet ];
	                uniquePotCombos.push( pottingSet );
	            }   
	        });

	        _listOfPottingSets = uniquePotCombos;
	    }

	    function sendProductToPottingSets( product, potCombinations )
	    {        
	        _listOfPottingSets.forEach( function( pottingSet )
	        {  
	        	pottingSet.putProductIntoPots( {id:product.id, amount:product.amount });
	        });

	        removeDuplicates();
	        removeInvalid();

	        //getBestPottingSet();
	        _listOfPottingSets.sort( PotSorter.sortPotSetsByRemainder );

	        return _listOfPottingSets;
	    }

	    function removeInvalid()
	    {
	        _listOfPottingSets = _listOfPottingSets.filter( function( pottingSet )
	        {
	            if ( pottingSet.isValid() )
	            {
	                return true;
	            }
	        });
	    }

	    function getBestPottingSet()
	    {
	        _listOfPottingSets.sort( PotSorter.sortPotSetsByRemainder );
	        return _listOfPottingSets[ 0 ];
	    }
	};
}());
},{"./PottingSet.js":4,"./Utils.js":6}],6:[function(require,module,exports){
(function()
{
	"use strict";
	
	exports.getPotPermutations =  function getPotPermutations( fromList )
	{
	    var permArr     = [];
	    var usedChars   = [];

	    function permute( input ) 
	    {
	        var i, ch;

	        for (i = 0; i < input.length; i++ ) 
	        {
	            ch = input.splice(i, 1)[0];
	            usedChars.push(ch);

	            if ( input.length === 0 ) 
	            {
	                permArr.push( JSON.parse( JSON.stringify( usedChars )));
	            }

	            permute( input );
	            
	            input.splice(i, 0, ch);
	            usedChars.pop();
	        }
	        
	        return permArr;
	    }

	    return permute( fromList );
	};

	exports.PotSorter = {

	    sortPotsByAmountMoveable: function sortPotSetByAmountMoveable( aPot, bPot )
	    {
	        return ( bPot.capacity - bPot.minimum ) - ( aPot.capacity - aPot.minimum );
	    },

	    sortPotsById: function sortPotSetById( a, b )
	    {        
	        return a.id - b.id;
	    },

	    sortPotSetsByRemainder: function sortPotSetsByRemainder( aPottingList, bPottingList  )
	    {   
	        return aPottingList.getRemainingSpace() - bPottingList.getRemainingSpace();
	    }
	};
}());
},{}],7:[function(require,module,exports){
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
                console.table( evt.detail.enteredProducts );
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
},{"./PotDisplayController.js":1,"./PotInputController.js":2,"./PottingController.js":3}]},{},[7]);
