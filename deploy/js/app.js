(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

	        //var allPottingSets      = new PottingSetList( allPotPermutations );
	        var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var validPottingSets    = [];
	        var invalidPottingSets  = [];

	        var bestPottingSet      = allPottingSets.getBestPottingSet();

	        console.log( "Best Potting Set: ");
	        
	        return bestPottingSet;
	    }
	};
}());
},{"./PottingSetList.js":3,"./Utils.js":4}],2:[function(require,module,exports){
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
	            withProduct.amount = 0;
	        }
	        else
	        {
	            pot.contents = pot.capacity;
	            withProduct.amount -= pot.capacity;
	        }
	    }

	    function putProductIntoPots( product )
	    {
	        var usedPots = [];	

	        _availablePots.forEach( function( nextPot )
	        {
	            if ( product.amount > 0 ) 
	            {
	                fillSinglePot( product, nextPot );
	                usedPots.push( nextPot );
	            }
	            

	        });

	        _availablePots = usedPots;
	        console.log( _availablePots );

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
},{"./Utils.js":4}],3:[function(require,module,exports){
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
	            console.log( pottingSet.getUsedPots() );
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
},{"./PottingSet.js":2,"./Utils.js":4}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
/* globals PottingSetList:false, PottingController:false */
(function(){
            var potInput;
            var amount;
            
            var permMax     = 2;
            var permCurrent = 0;
            var currentProduct;

            var PottingController = require("./PottingController.js");

            var controller;

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
                controller = new PottingController( basePots );
                initUI();
                //test()
            };

            function initUI()
            {
                var arrayCopy = Array.prototype.slice;

                uiElements.pottingButtons      = arrayCopy.call( document.querySelectorAll(".btn_fillTanker"));
                uiElements.productInputSets    = arrayCopy.call( document.querySelectorAll(".productInputSet"));
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

            function getRemainingPots( fromListOfPots, usedPotIds )
            {
                return fromListOfPots.filter( function removeUsedPots( potData )
                {
                    if ( potData.id.indexOf( usedPotIds ) === -1 )
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

                //usedPottingSets.push( pottingController.doPottingWithProduct( selectedProducts[0] ));
                //debugger;

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
                    availablePots       = getRemainingPots( availablePots, bestPottingSet );
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

            function potProducts()
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
                    })*/
                });
            }
}());            
},{"./PottingController.js":1}]},{},[5]);
