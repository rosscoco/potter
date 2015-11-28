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
	                <h1>7600</h1>   
	            </div>
	            */

				var container 		= document.createElement('div');
				var txtContents 	= document.createElement('h2');
				var pot 			= document.createElement('div');
				var potContents 	= document.createElement('div');
				var txtCapacity 	= document.createElement('h2');

				container.className = "potContainer";
				container.id 		= "pot" + ( i + 1 );

				txtContents.innerHTML = 0;
				txtCapacity.innerHTML = potData.capacity;

				txtContents.className = 'potText';
				txtCapacity.className = 'potText';

				pot.className 		= "pot";
				pot.setAttribute('draggable', 'true');
				pot.setAttribute('data-id', i + 1);

				potContents.setAttribute('data-id', ( i + 1 ));
				potContents.className = "potContents";
				potContents.setAttribute('data-product', 'none');
				
				pot.addEventListener('dragstart', 	onPotDragStart );
				pot.addEventListener("dragenter", 	onPotDragEnter );
				pot.addEventListener("dragover", 	onPotDragOver );
				pot.addEventListener("dragleave", 	onPotDragLeave );
				pot.addEventListener('drop', 		onPotDrop );
				pot.addEventListener('dragend', 	onPotDragEnd );


				_potContents[ '' + ( i + 1 ) ] = { pot:potContents, text:txtContents, container:pot };
				

				container.appendChild( txtContents );
				container.appendChild( pot );
				pot.appendChild( potContents );
				container.appendChild( txtCapacity );


				_displayNode.appendChild( container );
			});

			insertSpacesBetweenPots();

			_container.appendChild( _displayNode );

			return _displayNode;
		} 

		function onPotDragStart( evt, potContainer )
		{
			evt.dataTransfer.effectAllowed = 'move';
			evt.dataTransfer.setData('originPotId', evt.target.getAttribute('data-id'));
  			evt.dataTransfer.setData('text/html', this.innerHTML );
		}

		function onPotDragEnter( evt, potContents  )
		{
			evt.preventDefault();  
			_potContents[ evt.target.getAttribute('data-id') ].container.classList.add('dragOver');
			console.log("Enter:", evt.target.getAttribute('data-id'));
		}

		function onPotDragOver( evt )
		{
			evt.preventDefault();
		}

		function onPotDragLeave( evt, potContents  )
		{
			evt.preventDefault();

			var potId = evt.target.getAttribute('data-id');
			_potContents[ potId ].container.classList.remove('dragOver');

			console.log("Leave:", potId );
 		}


		function onPotDrop( evt, potContents )
		{
			//evt.dataTransfer.setData('targetPotId', evt.target.getAttribute('data-id'));
			evt.target.classList.remove('dragOver');
			console.log('OnDragDrop: Moving from ' + evt.dataTransfer.getData('originPotId') + " to " + evt.target.getAttribute('data-id') );
			swapPots( evt.dataTransfer.getData('originPotId'),  evt.target.getAttribute('data-id'));
		}

		function swapPots( pot1, pot2 )
		{
			var swapEvent = new CustomEvent("swapPots", { detail:{pot1:pot1, pot2:pot2 }});

			_container.dispatchEvent( swapEvent );
		}

		function onPotDragEnd( evt, potContents )
		{
			console.log("DragEnd:" + evt.target.getAttribute('data-id'));

			var origin = evt.dataTransfer.getData('originPotId');

			evt.dataTransfer.getData('targetPotId');
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

            var potContents = _potContents[ potData.id ].pot;
            var potTextContents = _potContents[ potData.id ].text;

            potTextContents.innerHTML = parseInt(potData.contents);

            if ( potData.contents < potData.minimum )
            {
				potTextContents.className += " warningText";
            }

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
					_potContents[ potId ].pot.setAttribute('data-product','none');
					_potContents[ potId ].pot.style.height = 0;

					_potContents[ potId ].text.innerHTML = 0;
					_potContents[ potId ].text.className = "potText";
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
					updateProductList: updateProductList,
					updateInput:updateInput };

		function updateInput( withInfo )
		{
			var txtInput = _domElement.querySelector('#productInput_' + withInfo.id );

			if ( !txtInput )
			{
				console.error("Tried to update value of #productInput_" + withInfo.id + '. Does not exist.');
				return;
			}

			txtInput.value = parseInt( withInfo.amount );
		}

		function getEnteredProductAmounts( putLast )
        {
        	//the product just entered will be potted last
        	var lastProduct;

        	var selectedProducts = _inputGroups.map( function getProductAmounts( inputGroup ) 
                {
					var amount = inputGroup.querySelector("[id^=productInput").value;

                	//if ( amount < 1000 ) amount = potifyNumber( amount );

                    return {    id      :inputGroup.getAttribute("id").split("_")[1], 
                                amount  :potifyNumber( amount ) };
                })

                .filter( function removeZeroValues( inputValues )
                {
                    if ( inputValues.amount > 0 ) return true;                                  	
                })
                .filter( function removeSpecificProduct( inputValues )
                {
                	if ( inputValues.id === putLast )
                	{
                		lastProduct = inputValues;
                		return false;                		
                	} 

                	return true;
                });

            if ( lastProduct ) selectedProducts.push( lastProduct );
            //if ( lastProduct ) selectedProducts.unshift( lastProduct );

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

				inputGroup.addEventListener("input", function( evt )
				{
					if ( evt.target.id.split("_")[0] === "productInput" )
					{
						evt.stopPropagation();
						onPotTanker( this );
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

		function onPotTanker( selectedInputGroup )
		{
			console.log("PotInputController::onPotTanker()");

			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var enteredProducts	= getEnteredProductAmounts( productToFill );

            if ( txtInput.value < 1000 ) return;

            console.log("After Sort:" + enteredProducts );

            var detail			= { enteredProducts : enteredProducts };

			var fillEvent 		= new CustomEvent( "potTanker",{ detail:detail });

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

		function potifyNumber( number )
		{
			var numberLength = String( Number( number ) ).length;

			if ( String( Number( number ) ).length >= 4 ) return number;

			return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
		}
	};
}());
},{}],3:[function(require,module,exports){

(function()
{
	"use strict";

	var Utils 			= require("./Utils.js");
	var PottingSetList	= require("./PottingSetList.js");
	var PottingResult 	= require("./data/PottingResult.js");

	module.exports = function PottingController( listOfPots )
	{
	    var _basePots   = listOfPots;
	    var _activePots,_products;
	    
	    return {
	        doPottingWithProduct   : doPottingWithProduct
	    };

	    function doPottingWithProduct( withProduct, withPots )
	    {
	        _activePots             = withPots;        

	        var productNotPotted 	= 0;
	        var pottingSetUsed;			//PottingSet;
	        var usedPottingSet      = '';

	         var spaceAvailable     = _activePots.reduce( function ( count, potData )
	         {
	            return count + potData.capacity;
	         }, 0 );

	         if ( spaceAvailable < withProduct.amount )
	         {
	            withProduct.amount 	= spaceAvailable;
	            productNotPotted 	= withProduct.amount - spaceAvailable;
	         }

	        pottingSetUsed = getBestPotsForProduct( _activePots, withProduct );

	        withProduct.remainder = productNotPotted;
	        //return { pottingSetUsed:pottingSetUsed, remainder: productNotPotted, product:withProduct };
	        var result = new PottingResult( withProduct, pottingSetUsed );
	        return result;
	    }

	    function getBestPotsForProduct( withPots, product )
	    {
	        var allPotPermutations  = Utils.getPotPermutations( withPots );

	        var allPottingSets      = new PottingSetList( allPotPermutations );
	        //var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        //var allPottingSets      = new PottingSetList( [ JSON.parse( JSON.stringify( withPots ))]);
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var bestPottingSet      = allPottingSets.getBestPottingSet();
	        
	        return bestPottingSet;
	    }
	};
}());
},{"./PottingSetList.js":6,"./Utils.js":8,"./data/PottingResult.js":11}],4:[function(require,module,exports){
(function()
{
	"use strict";
	var PRODUCT_DATA_URL 	= './resources/products.json?' + Math.random().toFixed(4);
	
	var Terminal 			= require('./data/Terminal.js');
	var Utils				= require('./Utils.js');
	var PottingController 	= require('./PottingController.js');
	var _terminals;
	var _potting;
	var _currentTerminal;
	var _potConfiguration;
	var _potter;

	module.exports = PottingData;

	function PottingData()
	{	
		_terminals 	= [];
		_potting 	= [];

		return { 	loadProductData: 	loadProductData,
					changeTerminal: 	changeTerminal,
					getPotting: 		getPotting,
					getProductTotals: 	getProductTotals,
					balanceTanker: 		balanceTanker,
					movePots: 			movePots };
	}

	function movePots( pot1Id, pot2Id )
	{
		var pot1 		= _potting[ pot1Id - 1 ];
		var pot2 		= _potting[ pot2Id - 1 ];

		var pot1Copy 	= JSON.parse( JSON.stringify( pot1 ));

		pot1.contents 	= Math.min( pot1.capacity, pot2.contents );
		pot1.product 	= pot2.product;
		
		pot2.contents 	= Math.min( pot2.capacity, pot1Copy.contents );
		pot2.product 	= pot1Copy.product;

		return _potting;
	}

	function changeTerminal( terminalName )
	{
		_currentTerminal 	= _terminals[ terminalName ];
		_potter 			= new PottingController( _currentTerminal.pots );

		return _currentTerminal;
	}

	function getPotConfig( potting )
	{
		return _potConfiguration;
	}

	function balanceTanker( productToFill, productArray )
	{
		productToFill = _currentTerminal.getBalance( productToFill, productArray );

		productArray.push( productToFill );

		return getPotting( productArray );
	}

	function getPotting( forProducts, limitToPots )
	{
		_potConfiguration 	= [];
		_potting			= [];

		var availablePots 	= limitToPots ?  limitToPots : _currentTerminal.pots.slice();
		var pottingResult;
		var currentWeight;

		forProducts.forEach( function( productDetails )
        {
            if ( availablePots.length === 0 ) return;

            productDetails      = _currentTerminal.checkWeight( productDetails, _potting );
            pottingResult       = _potter.doPottingWithProduct( productDetails, availablePots.slice() );
            _potting			= _potting.concat( pottingResult.pottingUsed.getPotArray() );
            availablePots      	= Utils.filterRemainingPots( _potting, availablePots );

            _potConfiguration.push( pottingResult );
        });

        return _potting;
	}

	function getProductTotals()
	{
		var pi = {};

		return _potting.reduce( function( productInfo, potData )
		{
			if ( productInfo.hasOwnProperty( potData.product ) )
			{
				productInfo[ potData.product ] += potData.contents;
			}
			else
			{
				productInfo[ potData.product ] = potData.contents;
			}


			return productInfo;

		}, pi );
	}

	function updatePotting( newPotConfiguration )
	{

	}

	function onProductDataLoaded( data, onComplete )
	{
		var terminalData = JSON.parse( data );
		
		for ( var id in terminalData )
		{
			if ( terminalData.hasOwnProperty( id ) )
			{
				var terminal = new Terminal( id, terminalData[ id ]);
				_terminals[ id ] = terminal;	
				console.log( _terminals[ id ].toString());
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

},{"./PottingController.js":3,"./Utils.js":8,"./data/Terminal.js":12}],5:[function(require,module,exports){
/* globals debugger:false */
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
	        getRemainingSpace       : getRemainingSpace,
	        getPotArray             : getPotArray,
	        isValid                 : isValid
	    };

	    function getPotArray()
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
	        	var fillData = getPotToFix();
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function checkPotCapacityAgainstContents( isWithinRules, potData )
	    {
	    	var willPot = potData.contents >= potData.minimum;

	        return isWithinRules && willPot;
	    }

	    function fillSinglePot( withProduct, pot )
	    {
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

	    function getPotToFix()
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = _availablePots.length - 1; i >= 0; i--) 
	    	{
	    		pot = _availablePots[i];

	    		if ( pot.contents >= pot.minimum )
	    		{
	    			otherPots.push( pot );
	    		}
	    		else
	    		{
	    			if ( potToFill )
	    			{
	    				debugger;
	    				console.log("SOMETHIGN HAS GONE WRONG!!");
	    			}

	    			potToFill = pot;
	    		}
	    	}

	    	return {potToFill:potToFill, otherPots:otherPots};
	    }

	    function fixLastPot( lastPot, remainingPots)
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

	        return false;
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
	        return PottingSet( potArray );
	    });

	   var _validPottingSets;

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
	        _validPottingSets = _listOfPottingSets.filter( function( pottingSet )
	        {
	            if ( pottingSet.isValid() )
	            {
	                return true;
	            }
	        });

	        _validPottingSets.sort( PotSorter.sortPotSetsByRemainder );

	        var debugResult = _validPottingSets.map( function( pottingSet )
	        {
	        	return pottingSet.getUsedPotsById() + ": " + pottingSet.getRemainingSpace();  

				/*return pottingSet.getPotArray.reduce( function( potString, pots )
				{
					return 
				}, )	        	*/
	        });

	        console.table( debugResult );
	    }

	    function getBestPottingSet()
	    {
	    	if ( _validPottingSets.length > 0 )
	    	{
	    		return _validPottingSets[ 0 ];

	    	}
	    	else
	    	{
	    		//best failure;
	    		_listOfPottingSets.sort( PotSorter.sortPotSetsByRemainder );
	    		return _listOfPottingSets[ 0 ];
	    	}
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

    exports.filterRemainingPots = function( usedPots, availablePots )
    {
    	var usedPotIds = usedPots.reduce( function( idString, potData )
		{	
			return idString + potData.id;
    	}, '');

        return availablePots.filter( function( potData )
        {
            if (  usedPotIds.indexOf( potData.id ) === -1 )
            {
                return true;
            }
        });
    };

	exports.getPotString = function getPotString( pots )
    {
        return pots.reduce( function( debugString, potData )
        {   
            return debugString+ "[" + potData.id +"]:" + potData.contents + "/" + potData.capacity + " " + potData.product;
        },'');
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

	    sortPotSetsByRemainder: function sortPotSetsByRemainder( aPottingSet, bPottingSet  )
	    {   
	    	var aRemainder = aPottingSet.getRemainingSpace();
	    	var bRemainder = bPottingSet.getRemainingSpace();

	    	/*if ( aRemainder === bRemainder )
	    	{
	    		return getClosenessRating( aPottingSet ) - getClosenessRating( bPottingSet )
	    	}*/

	        return aRemainder - bRemainder;
	    },

	    getClosenessRating: function getClosenessRating( forPottingList )
	    {
	    	/*var pots = forPottingList.getUsedPotsById().split("");
	    	var count = 0;
	    	
	    	for ( var i = 0 i < pots.length - 1; i++)*/
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

		return { 	init: 			init, 
					updateTerminal: updateTerminal,
					showResults: 	showResults,
					updateProductInputs:updateProductInputs };
	}

	function updatePotting( potDataArray )
	{
		
	}

	function showResults( potDataArray, messages  )
	{
		_pottingDisplay.reset();

		if ( potDataArray )
		{
			potDataArray.forEach( function( singlePotData )
	        {
	            _pottingDisplay.updatePot( singlePotData );
	        });
		}

		if ( messages )
		{
			
		}
	}

	function updateProductInputs( productData )
	{
		for ( var prodId in productData )
		{
			if ( productData.hasOwnProperty( prodId ))
			{
				_formController.updateInput( { id:prodId, amount: productData[ prodId ] });	
			}			
		}
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
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");
            
            var data;
            var view;

            window.onload   = function()
            {
                data                = new PottingData();
                view                = new ViewController( document.querySelector(".content") );

                data.loadProductData( onProductDataLoaded );
                
                document.querySelector("#productInputs").addEventListener("fillTanker", onBalanceTankerSelected );
                document.querySelector("#productInputs").addEventListener("potTanker", onPotTankerSelected );                
                document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );
                document.querySelector("#pottingContainer").addEventListener("swapPots", onSwapPotContents );
            };

            function onChangeTerminal( evt )
            {
                console.log("Changing terminal to " + evt.detail );

                var newTerminal = data.changeTerminal( evt.detail );
                    
                view.updateTerminal( newTerminal.pots, newTerminal.products );
            }

            function onProductDataLoaded( )
            {
                console.log("Product Data Loaded!!");
                var currentTerminal = data.changeTerminal("bramhall");

                view.init( currentTerminal.pots, currentTerminal.products );
            }

            function onSwapPotContents( evt )
            {
                var newPotting = data.movePots( evt.detail.pot1, evt.detail.pot2 );
                view.showResults( newPotting );
            }

            function onPottingChanged(pots)
            {
                /*I want to respond to potting changing manually, without invoking the potting controller
                    -accept a list of potting results
                        PottingSet
                        Product
                */
            }

             //Filling all pots with single product. Invoked when Fill Balance is selected with no other product values entered.
            function onBalanceTankerSelected( evt )
            {
                var results = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );
                
                view.showResults( results );

                view.updateProductInputs( data.getProductTotals() );
            }


            function onPotTankerSelected( evt )
            {
                var forProducts     = evt.detail.enteredProducts;
                var results         = [];
                var potList         = data.getPotting( forProducts );

                view.showResults( potList );
            }
}());            
},{"./PottingData.js":4,"./ViewController.js":9}],11:[function(require,module,exports){
(function()
{
	

	module.exports = PottingResult;

	function PottingResult(forProduct, pottingSetUsed )
	{


		/*

		var _pottingSet;
		var _isValidPottingSet;
		var _productDetails;
		var _potsUsed;
		var _potIds;

		*/
		
		this.pottingUsed 	= pottingSetUsed;
		this.product 		= forProduct;

/*
		function movePots( potToInsert, pot2Move )
		{

		}

		function getPotsUsed()
		{

		}

		function isUsingPot( potId )
		{
			var results = _potsUsed.filter( function( pot )
			{
				return pot.id === potId;
			});

			return results.length === 1; 
		}*/
	}
}());
},{}],12:[function(require,module,exports){
(function()
{	
	"use strict";

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
		this.maxWeight 	= 30000;

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
		if ( String( Number( number ) ).length === 4 ) return number;

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
				return this.products[ i ];
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

	Terminal.prototype.getBalance = function( productToBalance, otherProducts )
	{
		var weight = 0;

		for ( var i = 0; i < otherProducts.length; i++ ) 
		{
			weight += this.getProductData( otherProducts[ i ].id ).density * otherProducts[ i ].amount;
		}

		var litresAvailable = Math.max( this.maxWeight - weight, 0 ) *  ( 1 / this.getProductData( productToBalance ).density );

		return {id:productToBalance, amount: litresAvailable };
	};



	//Checks the weight of an amount of product and will reduce it to a number of litres that is below the maximum weight.
	//If products have already been potted then this function will subtract the already potted weight from the maximum allowed weight first.
	Terminal.prototype.checkWeight = function( productToPot, alreadyPotted )
	{
		var currentWeight = 0;
		var maxWeight;
		var toPotDensity;
		var litresAvailable;

		if ( alreadyPotted )
		{	
			for ( var i = 0; i < alreadyPotted.length; i++ )
			{
				currentWeight += this.getProductData( alreadyPotted[ i ].product ).density * alreadyPotted[ i ].contents;
			}
		}

        toPotDensity 	= this.getProductData( productToPot.id ).density;

        if ( toPotDensity * productToPot.amount + currentWeight > this.maxWeight )
        {
            litresAvailable = Math.max( this.maxWeight - currentWeight, 0 ) *  ( 1 / toPotDensity );
            
            productToPot.remainder 	= productToPot.amount - litresAvailable;
            productToPot.amount 	= litresAvailable;
        }

        return productToPot;
	};

}());
},{}]},{},[10])
//# sourceMappingURL=app.js.map
