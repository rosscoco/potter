//# sourceMappingURL=./app.js.map
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function()
{
	module.exports = function PotDisplayController( domElement )
	{
		var _potContents 	= {};	//cache of all .potContents elements
		var _container		= domElement;
		var _displayNode;// 	= domElement;

		var alreadyCreated = document.querySelectorAll("#pottingDisplay").length !==0;

		if ( alreadyCreated )
		{
			//do stuff...
			//return false;
		}

		//init();

		return {
			init		: init,
			updatePot	: updatePot,
			reset		: reset,
			clear		: clear 
		};	

		

		function init( allPotData )
		{
			//clear();

			_displayNode = document.createElement('div');
			_displayNode.className = "pottingDisplay";

			var lastnode;
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
				var header 			= document.createElement('h2');
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

			insertSpacesBetweenPots();

			_container.appendChild( _displayNode );

			return _displayNode;
		} 


		function insertSpacesBetweenPots()
		{
			var pots = [].slice.call(_displayNode.children);

			var l = pots.length;

			for ( var i = 1; i  < l; i++ )
			{
				var space = document.createElement( "span" );
				space.innerHTML = ' ';
				_displayNode.insertBefore( space, pots[i]);
			}
		}

	    function updatePot( potData )
        {
        	console.log( "PotDisplayController::Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

            var potId = potData.id;
            
            var potContents = _potContents[ potData.id ];

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
				while( _displayNode.firstChild )
				{
					_displayNode.removeChild( _displayNode.firstChild );
				}

				_displayNode.parentNode.removeChild( _displayNode );
				_displayNode = undefined;
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

		init( availableProducts );

		if ( _inputGroups.length === 0 )
		{
			console.log("PotInputController::No inputs");
		}

		return { 	init: init,
					updateProductList : updateProductList };

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

        function updateProductList( availableProducts )
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
				else
				{
					console.log("Showing " + forProduct );
					inputGroup.style.display = "block";
				}
			});
        }

		function init( availableProducts )
		{
			updateProductList( availableProducts );

			_inputGroups.forEach( function( inputGroup )
			{
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

	        //var allPottingSets      = new PottingSetList( allPotPermutations );
	        //var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        var allPottingSets      = new PottingSetList( [JSON.parse( JSON.stringify( withPots ))]);
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var validPottingSets    = [];
	        var invalidPottingSets  = [];

	        var bestPottingSet      = allPottingSets.getBestPottingSet();

	        console.log( "Best Potting Set: ");
	        
	        return bestPottingSet;
	    }
	};
}());
},{"./PottingSetList.js":6,"./Utils.js":8}],4:[function(require,module,exports){
(function()
{
	var PRODUCT_DATA_URL 	= './resources/products.json?' + Math.random().toFixed(4);
	
	var Terminal 			= require('./data/Terminal.js');

	var availableProducts 	= [   	{id:1051510, density:0.83,name:"Blah"},
	                                {id:1051485, density:0.83,name:"Blah"},
	                                {id:1051643, density:0.83,name:"Blah"}] ;

    var products    		= [     {id:"1051512", amount:22800, pottingUsed:[] },
									{id:"1051510", amount:12000, pottingUsed:[] }];

    var basePots    		= [     {id:1,capacity:7600, contents:0, product:"", minimum:7500},
		                            {id:2,capacity:7600, contents:0, product:"", minimum:6600},
		                            {id:3,capacity:7000, contents:0, product:"", minimum:3500},
		                            {id:4,capacity:7600, contents:0, product:"", minimum:3800},
		                            {id:5,capacity:6000, contents:0, product:"", minimum:3000},
		                            {id:6,capacity:7000, contents:0, product:"", minimum:6000}];

	var testPots		    =  [    {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                    {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                    {id:4,capacity:7600, contents:0, product:"", minimum:3800}];

	var testProduct 		=       {id:"1051510", amount:18000, pottingUsed:[] };
	var _terminals;

	module.exports = PottingData;

	function PottingData()
	{	
		_terminals = [];

		return { 	loadProductData: loadProductData,
					getTerminalData: getTerminalData };
	}

	function getTerminalData( terminalName )
	{
		return _terminals[terminalName];
	}

	function onProductDataLoaded( data, onComplete )
	{
		var terminalData = JSON.parse( data );
		console.log('onProductDataLoaded');
		console.log(terminalData);
		for ( var id in terminalData )
		{
			if ( terminalData.hasOwnProperty( id ) )
			{
				var terminal = new Terminal( id, terminalData[id]);
				_terminals[id] = terminal;	
				console.log( _terminals[id].toString());
			}
		}

		if ( onComplete )	onComplete();
	}

	function loadProductData( onComplete )
	{
		var xobj = new XMLHttpRequest();
        xobj.overrideMimeType( "application/json" );
    	xobj.open( 'GET', PRODUCT_DATA_URL, true ); 
    	
    	xobj.onreadystatechange = function () 
    	{

          if ( xobj.readyState === 4 && xobj.status === 200 ) {
            onProductDataLoaded( xobj.responseText, onComplete );
          }
    	};

    	xobj.send( null );  
	}


}());

},{"./data/Terminal.js":11}],5:[function(require,module,exports){
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
	        	var fillData = getPotToFill();
	            return fillLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function checkPotCapacityAgainstContents( isWithinRules, potData )
	    {
	    	var willPot = potData.contents > potData.minimum;
	    	console.log( potData.contents, potData.minimum, potData.contents > potData.minimum );

	        return isWithinRules && willPot;
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


	    function getPotToFill()
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	for (var i = _availablePots.length - 1; i >= 0; i--) 
	    	{
	    		pot = _availablePots[i];

	    		if ( pot.contents > pot.minimum )
	    		{
	    			otherPots.push( pot );
	    		}
	    		else
	    		{
	    			if ( potToFill )
	    			{
	    				console.log("SOMETHIGN HAS GONE WRONG!!");
	    			}

	    			potToFill = pot;
	    		}
	    	}

	    	return {potToFill:potToFill, otherPots:otherPots};
	    }

	    function IsGreaterThan( checkAgainst )
	    {
	        var mustBeGreaterThan = checkAgainst;

	        return function( amountToCheck )
	        {
	            return amountToCheck > checkAgainst;
	        };
	    }
 
	    function fillLastPot( lastPot, remainingPots)
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
	            	return true;	                
	            }
	        }
	    }
	};
}());
},{"./Utils.js":8}],6:[function(require,module,exports){
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
},{"./PottingSet.js":5,"./Utils.js":8}],7:[function(require,module,exports){
(function()
{
	module.exports = Tabs;

	function Tabs( domNode )
	{
		var _tabs = [];
		var _domElement;

		init( domNode );

		//return { init: init };

		function init( withDom )
		{
			_domElement = withDom;

			_tabs = [].slice.call( _domElement.querySelectorAll('li'));

			_tabs.forEach( function( tab )
			{
				tab.addEventListener('click', function( evt )
				{
					onTabClicked( evt );	
				});
			});
		}

		function onTabClicked( evt )
		{
			_tabs.forEach( function( tab )
			{
				tab.className = '';
			});

			evt.currentTarget.className = 'tabActive';
			var terminal = evt.currentTarget.id.split("_")[1];

			var changeEvent = new CustomEvent("onChangeTerminal",{detail:terminal});

			_domElement.dispatchEvent( changeEvent );
		}
	}
}());
},{}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
(function()
{
	module.exports = ViewController;

	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var Tabs                    = require('./Tabs.js');

	var _formController;
	var _pottingDisplay;
	var _tabController;
	var _tabs;

	var _domElements;

	function ViewController( withDom )
	{
		_domElements = withDom;

		return { 	init: init, 
					updateTerminal:updateTerminal,
					updatePotting: updatePotting };
	}

	function updatePotting( potDataArray )
	{
		potDataArray.forEach( function( singlePotData )
        {
            _pottingDisplay.updatePot( singlePotData );
        });
	}

	function updateTerminal( withPots, withProducts )
	{
		_formController.updateProductList( withProducts );
		_pottingDisplay.clear();
		_pottingDisplay.init( withPots );
	}

	function init( usingPots, usingProducts )
	{
		var formNode        = _domElements.querySelector("#productInputs");
		var potDisplayNode  = _domElements.querySelector("#pottingContainer");
		var tabsNode		= _domElements.querySelector(".tabs");

		_formController 	= new PotInputController( formNode, usingProducts );
		_pottingDisplay     = new PotDisplayController( potDisplayNode );
		_tabs 				= new Tabs( tabsNode );
       
		updateTerminal( usingPots, usingProducts );
       	
       	tabsNode.addEventListener("onChangeTerminal", onChangeTerminal );
        formNode.addEventListener("clearTanker", onClearTankerSelected );
	}

	function onChangeTerminal( evt )
	{
		console.log("Changed!" + evt.detail);
	}


	function onClearTankerSelected( evt )
	{
	    console.log("Removing Product from tanker. Products Left: ");
	    _pottingDisplay.reset();
	}
}());

},{"./PotDisplayController.js":1,"./PotInputController.js":2,"./Tabs.js":7}],10:[function(require,module,exports){
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

                potter          = new PottingController( currentTerminal.pots );

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
},{"./PottingController.js":3,"./PottingData.js":4,"./ViewController.js":9}],11:[function(require,module,exports){
(function()
{	

            /*var basePots    = [     {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                    {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                    {id:3,capacity:7000, contents:0, product:"", minimum:3500},
                                    {id:4,capacity:7600, contents:0, product:"", minimum:3800},
                                    {id:5,capacity:6000, contents:0, product:"", minimum:3000},
                                    {id:6,capacity:7000, contents:0, product:"", minimum:6000}];*/

	module.exports = Terminal;




	function Terminal( id, data )
	{
		this.name 		= id;
		this.pots 		= [];
		this.products 	= {};

		this.potIds 	= '';
		this.productIds = '';

		for ( var i = 0; i < data.pot_configs[0].pots.length; i++ )
		{
			this.pots.push({	id: i+1,
								capacity:this.potifyNumber( data.pot_configs[0].pots[i] ),
								contents:0,
								product:'',
								minimum:this.potifyNumber( data.pot_configs[0].potMinimums[ i ] )
							});

			this.potIds += data.pot_configs[0].pots[i];
		}

		this.products = [];//data.products;

		for ( var product in data.products )
		{
			if ( data.products.hasOwnProperty(product))
			{
				this.products.push({id:product, name:data.products[product].name,density:data.products[product].density });
				this.productIds += product + " ";
			}
		}
	}

	//Convert 3 to 3000, 69 to 6900 etc
	Terminal.prototype.potifyNumber = function( number )
	{
		if ( String( number ).length === 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed(4) * 10000 );
	};

	Terminal.prototype.toString = function()
	{
		var s = "-------" + this.name +"-------\n";
		s+= "Pots: " + this.potIds + "\n";
		s+= "Products: " + this.productIds + "\n";
		
		return s;
	};


	Terminal.prototype.getProductData = function( forProduct )
	{
		for ( var i = 0; i < this.products.length;i++ )
		{
			if ( this.products[i].id === forProduct )
			{
				return this.products[i];
			}
		}
	};

	Terminal.prototype.getTankerCapacity = function()
	{
		var capacity = this.pots.reduce( function( amount, potData )
		{
			return amount + potData.capacity;
		},0);

		return capacity;
	};

}());
},{}]},{},[10])
//# sourceMappingURL=app.js.map
