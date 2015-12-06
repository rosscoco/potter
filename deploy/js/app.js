//# sourceMappingURL=./app.js.map
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){

	var _allowedKeys 	= [ 8,9,13,27,35,38,45,46 ]; //backspace, delete, insert, home, end

	module.exports.parseInput 		= parseInput;
	module.exports.isAllowedInput 	= isAllowedInput;

	/*module.exports.checkValueInput 		= checkValueInput;
	module.exports.checkSplits 			= checkSplits;
	module.exports.isAllowedInput 		= isAllowedInput;
	module.exports.parseValueAndSplits 	= parseValueAndSplits;
	module.exports.parseSpaces 			= parseSpaces;*/

	function isAllowedInput( inputEvt )
	{	
		console.log( inputEvt.which );

		var keyChar 		= String.fromCharCode( inputEvt.which );
		var allowedChars 	= "0123456789 /";

		var isSpecialKey = function( keyCode )
		{
			return keyCode === inputEvt.which;
		};

		//prevent second / character being input
		if ( inputEvt.target.value.indexOf('/') >= 0 )
		{
			allowedChars  = "0123456789 ";
		}

		return _allowedKeys.some( isSpecialKey ) || allowedChars.indexOf( keyChar ) !== -1;
	}

	function parseInput( inputValue )
	{
		var checker;

		if ( inputValue.indexOf('/') !== -1 )
		{	
			checker = parseValueAndSplits;
		}
		else if ( inputValue.indexOf(" ") !== -1 && inputValue.length > 2 )
		{
			checker =  parseSplits;
		}
		else
		{
			checker = parseValue;
		}

		return checker( inputValue );
	}

	


	function parseValue( value )
	{
		var _isValid 	= false;
		var _value 		= validate( value );

		return { 	isValid: _isValid,
					type: 	"total",
					amount:_value };


		function validate( amount )
		{
			if ( isNaN( parseInt( amount ) ))
			{
				_isValid = false;
				return 0;
			}

			_isValid = true;

			return potifyNumber( amount );
		}
	}

	function parseSplits( inputValue )
	{
		var data 		= {};
		data.pots 		= parseSpaces( inputValue );
		data.amount 	= 0;
		data.hasPotting	= data.pots.length > 0;

		data.pots = data.pots.map ( function( potSplit )
		{
			data.amount += potSplit.amount;
			return potSplit.amount;
		});

		return data;
	}

	function parseValueAndSplits( inputValue )
	{
		var separated 	= inputValue.split("/");
		var data 		= {};
		var total 		= separated[ 0 ];
		var splits 		= separated[ 1 ];

		//if multiple entries before / then only take the first one
		var leftSide 	= removeSpaces( total )[0];
		var rightSide 	= parseSplits( splits  );
		
		data.amount 	= leftSide.amount;
		data.potTotal 	= rightSide.amount;
		data.pots 		= rightSide.pots;
		data.hasPotting	= data.pots.length > 0;

		return data;
	}

	function parseSpaces( inputValue )
	{	
		var amounts = removeSpaces( inputValue );

		amounts = amounts.map( function checkInput( value )
		{
			return parseValue( value );
		});

		return amounts;
	}

	function removeSpaces( inputValue )
	{
		return inputValue.split(" ").filter( function notEmptyString( s )
		{
			return String( s ) !== '';
		});
	}

	function potifyNumber( number )
	{
		var numberLength = String( Number( number ) ).length;

		if ( String( Number( number ) ).length >= 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
	}
}());
},{}],2:[function(require,module,exports){
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

				pot.addEventListener("wheel", onMouseWheel );

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

		function onMouseWheel( evt )
		{
			evt.preventDefault();

			console.log("wheeeeel");
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
 		}


		function onPotDrop( evt, potContents )
		{
			//evt.dataTransfer.setData('targetPotId', evt.target.getAttribute('data-id'));
			evt.target.classList.remove('dragOver');
			swapPots( evt.dataTransfer.getData('originPotId'),  evt.target.getAttribute('data-id'));
		}

		function swapPots( pot1, pot2 )
		{
			var swapEvent = new CustomEvent("swapPots", { detail:{pot1:pot1, pot2:pot2 }});

			_container.dispatchEvent( swapEvent );
		}

		function onPotDragEnd( evt, potContents )
		{
		
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
        	//console.log( "PotDisplayController::Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

            var potContents = _potContents[ potData.id ].pot;
            var potTextContents = _potContents[ potData.id ].text;

            potTextContents.innerHTML = parseInt(potData.contents);

            if ( potData.contents < potData.minimum && potData.contents > 0 )
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
},{}],3:[function(require,module,exports){
(function()
{
	var inputValidator		= require('./InputValidation.js');

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
					showProductFeedback: showProductFeedback,
					clearFeedback: clearFeedback,
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

		function clearFeedback( onlyForProduct )
		{
			if ( onlyForProduct )
			{
				var inputGroup = _domElement.querySelector("#input_" + onlyForProduct );
				inputGroup.className = "form-horizontal productInputGroup";
				inputGroup.querySelector(".help-block").innerHTML = "";	
				return;
			}


			[].slice.call( _domElement.querySelectorAll("[id^='input']")).forEach( function( inputGroup )
			{
				inputGroup.className = "form-horizontal productInputGroup";
				inputGroup.querySelector(".help-block").innerHTML = "";
			});
		}

		function showProductFeedback( feedback )
		{
			var inputGroup = _domElement.querySelector("#input_" + feedback.product );
			var helperText = inputGroup.querySelector(".help-block");

			helperText.innerHTML = feedback.message;

			inputGroup.classList.add.apply( inputGroup.classList, feedback.classes );
		}

		function getEnteredProductAmounts( putLast )
        {
        	//the product just entered will be potted last
        	var lastProduct;

			var textInput;
			var parsedAmount;
			var value;

			var usedInputs = _inputGroups.filter( function removeZeroValues( inputGroup )
            {
            	var textInput = inputGroup.querySelector("[id^=productInput");
            	value = textInput.value;

            	return value !== '' && value !== 0;
            })
			.map( function extractValuesFromTextInputs( inputGroup ) 
            {
            	textInput 		= inputGroup.querySelector("[id^=productInput");
				parsedAmount 	= inputValidator.parseInput( textInput.value );
            	parsedAmount.id = textInput.getAttribute("id").split("_")[1];

            	return parsedAmount;
            });

            if ( putLast  )
            {
            	usedInputs = usedInputs.filter( function removeSpecificProduct( inputValues )
                {
                	if ( inputValues.id === putLast )
                	{
                		lastProduct = inputValues;
                		return false;                		
                	} 

                	return true;
                });

                usedInputs.push( lastProduct );
            }
				
            return usedInputs;
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
				
				txtInput.onkeypress = function( evt )
				{
					return inputValidator.isAllowedInput( evt );
				};

            	txtInput.value      = "";

				if ( usedProductIds.indexOf( forProduct ) < 0 )
				{
					inputGroup.style.display = "none";
				}
				else
				{
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
            txtInput.value      = '';
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var otherProducts	= getEnteredProductAmounts();

            var detail			= { enteredProducts:otherProducts, productToFill:productToFill };

			var fillEvent 		= new CustomEvent("fillTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onPotTanker( selectedInputGroup )
		{
			console.log("PotInputController::onPotTanker()");

            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var productValue	= selectedInputGroup.querySelector("#productInput_" + productToFill ).value;
            
            if ( !productValue  )
            {
            	productToFill = undefined;
            }

            var enteredProducts	= getEnteredProductAmounts( productToFill );

            if ( enteredProducts.length === 0 ) return;

            var detail			= { enteredProducts : enteredProducts };

			var fillEvent 		= new CustomEvent( "potTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onClearProduct( selectedInputGroup )
		{
			console.log("PotInputController::onClearProduct()");
			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = "";

            clearFeedback( selectedInputGroup.id.split("_")[ 1 ]);

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
},{"./InputValidation.js":1}],4:[function(require,module,exports){

(function()
{
	"use strict";

	var Utils 			= require("./Utils.js");
	var PottingSetList	= require("./PottingSetList.js");
	var PottingResult 	= require("./data/PottingResult.js");
	var PottingSet 		= require("./PottingSet.js");

	module.exports = function PottingController( listOfPots )
	{
		var _basePots   = listOfPots;
		var _activePots,_products;
		
		return {
			doPottingWithProduct   	: doPottingWithProduct,
			changeProductConfiguration	: changeProductConfiguration
		};

		function changeProductConfiguration( updatedPotArray )
		{
			var productsPotted  = Utils.getProductsFromPots( updatedPotArray );

			var potConfiguration = [];
			var pottingResult;
			var pottingSet;

			for ( var productId in productsPotted )
			{	
				if ( productsPotted.hasOwnProperty( productId ))
				{
					pottingSet		= PottingSet( productsPotted[ productId ].pots, true );
					pottingResult	= new PottingResult( productsPotted[ productId ], pottingSet );

					potConfiguration.push( pottingResult );
				}
			}

			return potConfiguration;
		}

		//don't perform any calculations on best potting, just create the results objects for the provided potting
		function doPottingWithPots( withProduct, staticPotting )
		{
			//var 
		}

		function doPottingWithProduct( withProduct, withPots, splits )
		{
			_activePots             = withPots;

			var productNotPotted 	= 0;
			var pottingSetUsed;			//PottingSet;
			var usedPottingSet      = '';

			var spaceAvailable		= _activePots.reduce( function ( count, potData )
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
			var result = new PottingResult( withProduct, pottingSetUsed, productNotPotted );
			return result;
		}

		function fixPotSizes( basePots, toSplits )
		{
			var potsLeft 		= Utils.copyPotArray( basePots );
			var assignedPots 	= [];

			toSplits = toSplits.sort( function( a, b )
			{
				return parseInt( a ) - parseInt( b );
			});

			toSplits.forEach( function( split )
			{
				var bestPot = getBestPotForSplit( split, potsLeft );

				if ( bestPot ) 
				{
					assignedPots[ bestPot.id ] = bestPot;
				}

				potsLeft = Utils.getUnusedPots( assignedPots, basePots );
			});
		}

		function getBestPotForSplit( split, availablePots )
		{
			var bestPot;

			availablePots.forEach( function( potData )
			{
				if ( potData.minimum > split ) return;
				if ( potData.capacity < split ) return;

				var diff = potData.capacity - split;

				if ( bestPot.capacity - split > diff )
				{
					bestPot = potData;
				}
			});

			return bestPot;
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
},{"./PottingSet.js":7,"./PottingSetList.js":8,"./Utils.js":10,"./data/PottingResult.js":13}],5:[function(require,module,exports){
(function()
{
	"use strict";
	var PRODUCT_DATA_URL	= './resources/products.json?' + Math.random().toFixed(4);
	
	var Terminal			= require('./data/Terminal.js');
	var Utils				= require('./Utils.js');
	var PottingController	= require('./PottingController.js');
	var PottingResult		= require("./data/PottingResult.js");
	var PottingSet			= require("./PottingSet.js");

	var _terminals;					
	var _currentTerminal;			
	var _potting;					//array of pots on the tanker and their content
	var _productConfiguration;		//array of PottingResult objects that contain the PottingSet object used for a product
	var _potter;					//PottingController object that converts products and pots into an array of PottingResults

	module.exports 			= PottingData;

	function PottingData()
	{	
		_terminals	= [];
		_potting	= [];

		return {	loadProductData: 	loadProductData,
					changeTerminal: 	changeTerminal,
					getPotting: 		getPotting,
					changePotPosition: 	changePotPosition,
					getProductTotals: 	getProductTotals,
					balanceTanker: 		balanceTanker };
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

	function changeTerminal( terminalName )
	{
		_currentTerminal	= _terminals[ terminalName ];
		_potter				= new PottingController( _currentTerminal.pots );

		return _currentTerminal;
	}

	function getBestPotForSplit( split, availablePots )
	{
		var bestPot;

		availablePots.forEach( function( potData )
		{
			if ( potData.minimum > split ) return;
			if ( potData.capacity < split ) return;

			var diff = potData.capacity - split;

			if ( bestPot.capacity - split > diff )
			{
				bestPot = potData;
			}
		});

		return bestPot;
	}

	function splitsTest( productDetails )
	{


		//productDetails

	}

	function getFixedPots( productDetails, availablePots )
	{
		var bestPot;
		var potDifference 	= 10000;
		var potsToUse 		= {};

		productDetails.pots.forEach( function( fixedPotSize )
		{
			availablePots.forEach( function( potToCheck )
			{		
				var potDiffTemp = Math.max( 0, potToCheck.capacity - fixedPotSize );

				if ( potDiffTemp < potDifference && potToCheck.minimum < fixedPotSize )
				{
					potDifference 				= potDiffTemp;
					potsToUse[ fixedPotSize ] 	= potToCheck;
				}
			});
		});

		for ( var split in potsToUse )
		{
			if ( potsToUse.hasOwnProperty( split ))
			{
				availablePots[ split ].capacity = split;
				availablePots[ split ].minimum = split;
			}
		}

		return availablePots;
	}

	function getPotting( forProducts, limitToPots )
	{
		resetPots();

		var usedPots		= [];
		var availablePots	= limitToPots ?  limitToPots : _currentTerminal.pots.slice();
		
		var pottingResult;

		forProducts.forEach( function( productDetails )
		{
			if ( availablePots.length === 0 ) 
			{
				_productConfiguration.push( new PottingResult( productDetails, PottingSet([]), productDetails.amount ));
				return;
			}



			productDetails		= _currentTerminal.checkWeight( productDetails, usedPots );
			pottingResult		= _potter.doPottingWithProduct( productDetails, availablePots.slice() );
			usedPots			= usedPots.concat( pottingResult.pottingUsed.getPotArray() );
			availablePots		= Utils.getUnusedPots( usedPots, availablePots );

			_productConfiguration.push( pottingResult );
		});

		//put the used pots into the correct position in the _potting array;
		usedPots.forEach( function( potData )
		{
			_potting[ potData.id - 1 ] = potData;
		});

		return { potsUsed:_potting, pottedProducts: _productConfiguration };
	}

	function changePotPosition( pot1Id, pot2Id )
	{
		var pot1		= _potting[ pot1Id - 1 ];
		var pot2		= _potting[ pot2Id - 1 ];

		var pot1Copy	= JSON.parse( JSON.stringify( pot1 ));

		pot1.contents	= Math.min( pot1.capacity, pot2.contents );
		pot1.product	= pot2.product;
		pot1.fixed		= true;
		
		pot2.contents	= Math.min( pot2.capacity, pot1Copy.contents );
		pot2.product	= pot1Copy.product;
		pot2.fixed		= true;

		_productConfiguration = _potter.changeProductConfiguration( _potting );

		return { potsUsed:_potting, pottedProducts: _productConfiguration };
	}

	function getProductTotals( filterByProduct )
	{
		var log = _potting.reduce( function( productInfo, potData )
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

		}, {} );

		return log;
	}

	function balanceTanker( productToFill, productArray )
	{
		productToFill = _currentTerminal.getBalance( productToFill, productArray );

		productArray.push( productToFill );

		return getPotting( productArray );
	}

	function getPotConfig( potting )
	{
		return _productConfiguration;
	}

	/*======= Private Methods ==========*/
	

	function resetPots()
	{
		_potting				= [];
		_productConfiguration	= [];

		_currentTerminal.pots.forEach( function( potData, i )
		{
			_potting[ i ] = JSON.parse( JSON.stringify( potData ));
		});
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


}());

},{"./PottingController.js":4,"./PottingSet.js":7,"./Utils.js":10,"./data/PottingResult.js":13,"./data/Terminal.js":14}],6:[function(require,module,exports){
(function(){

	var cPottingResult 	= require("./data/PottingResult.js");
	var PottingResult 	= new cPottingResult();
	var pottedProducts 	= {};

	module.exports = PottingResponse;

	function PottingResponse()
	{
		return {
			getPottingResponse: getPottingResponse
		};
	}

	function getPottingResponse( pottingResult )
	{
		var response;
		
		if ( pottingResult.pottingUsed.isValid() )
		{
			//if ( forProduct.remainder > 0 || result.remainder > 0 )
			if ( pottingResult.productDetails.remainder > 0  )
			{
				response = pottingOverWeight;
			}
			else if ( pottingResult.pottingUsed.getRemainder() > 0 ) 
			{
				response = pottedSomeProduct;
			}
			else
			{
				response = pottingSuccess;
			}
		}
		else
		{
			if ( pottingResult.pottingUsed.getPotArray().length === 0 )
			{
				response = noPotsLeft;
			}
			else
			{
				response = pottingFail;	
			}
		}

		return getMessage( pottingResult, response );
	}

	function isAlreadyPotted( product, availablePots )
	{
		return false;
	}

	function getMessage( pottingResult, messageFunction )
	{
		var data 			= {};

		data.product 		= pottingResult.productDetails.id;
		data.potsUsed 		= pottingResult.pottingUsed.getPotArray();
		data.potIds 		= pottingResult.pottingUsed.getUsedPotsById();
		data.amountPotted	= parseInt( pottingResult.productDetails.amount );

		return messageFunction( data, pottingResult );
	}

	function pottingOverWeight( messageData, pottingResult )
	{
		var amountNeeded 			= pottingResult.productDetails.amount + pottingResult.productDetails.remainder;
		messageData.pottingStatus 	= PottingResult.WARN;
		messageData.message 		= amountNeeded + " of " + messageData.product + " is over max weight. Reduced by " + pottingResult.productDetails.remainder + " to " + messageData.amountPotted + "L total.";

		return messageData;
	}


	function noPotsLeft( messageData )
	{
		messageData.pottingStatus 	= PottingResult.ERROR;
		messageData.message 		= "Could not pot " + messageData.amountPotted + " of " + messageData.product + ". No Pots left on tanker";
		
		return messageData;
	}

	function pottingFail( messageData, pottingResult )
	{
		var pots 			= messageData.potsUsed;
		var failedPot 		= pots[ pots.length - 1 ];
		var amountNeeded 	= failedPot.minimum - failedPot.contents;

		messageData.pottingStatus 	= PottingResult.ERROR;
		
		messageData.message 		= "Could not pot " + messageData.amountPotted + " of " + messageData.product + " as " + pottingResult.pottingUsed.getSplitsString();

		return messageData;
	}

	function pottingSuccess( messageData, pottingResult )
	{
		messageData.pottingStatus 	= PottingResult.SUCCESS;
		
		messageData.message 		= messageData.amountPotted + "L of " + messageData.product + " potted as " + pottingResult.pottingUsed.getSplitsString();
		return messageData;
	}

	function pottedSomeProduct( messageData, pottingResult  )
	{
		messageData.pottingStatus 	= PottingResult.WARN;
		messageData.message 		= messageData.amountPotted + " of " + messageData.product + " potted as " + pottingResult.pottingUsed.getSplitsString();
		messageData.message 		+= ".\n " + pottingResult.remainder  + " could not be potted.";

		return messageData;
	}
}());	
},{"./data/PottingResult.js":13}],7:[function(require,module,exports){
/* globals debugger:false */
(function()
{
	"use strict";
	var Utils 			=	require("./Utils.js");
	var PotSorter 		=	Utils.PotSorter;
	
	module.exports = function PottingSet( fromPotArr, isFixed )
	{
		var _isFixed 		= isFixed;
	    var _pottingArray 	= fromPotArr;// ? fromPotArr : [];
	    var _remainder 		= 0;
	    var _pottingValidator;

	    if ( _isFixed ) _pottingValidator = StaticPottingSetValidator();
	    else 			_pottingValidator = DynamicPottingSetValidator();
	    
	    return {
	        putProductIntoPots      : putProductIntoPots,
	        fillSinglePot 			: fillSinglePot,
	        isValid                 : isValid,

	        getRemainingSpace       : getRemainingSpace,
	        getUsedPotsById         : getUsedPotsById,
	        getPotArray             : getPotArray,
	        getRemainder			: getRemainder,
	        getSplitsString 		: getSplitsString
	    };

	    function getRemainder()
	    {
	    	return _remainder;
	    }

	    function getPotArray()
	    {
	        return _pottingArray;
	    }

	    function isValid()
	    {
	    	var result = _pottingValidator.isValid( _pottingArray );
	    	return result;

	    	/*if ( _pottingArray.length === 0 ) return false;

	        var valid = _pottingArray.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else if ( _isFixed )
	        {
	        	return false;
	        }
	        else
	        {
	        	var fillData = getPotToFix( _pottingArray );
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }*/
	    }	   

	    function fillSinglePot( withProduct, pot )
	    {
	        pot.product 	= withProduct.id;
	        var leftToPot 	= withProduct.amount - withProduct.potted;

	    	if ( pot.isFixed ) return 0;

	        if ( pot.capacity > leftToPot  )
	        {
	            pot.contents = leftToPot;
			}
	        else
	        {
	            pot.contents = pot.capacity;
	        }

	        return pot.contents;
	    }

	    function putProductIntoPots( product )
	    {
	        var usedPots		= [];
	        var availablePots 	= _pottingArray.slice();

	        product.potted		= 0;
	        product.toPot		= product.amount;

	        /*if ( product.splits ) 
	        {
	        	var splitsUsed 		= forcePotting( product );
	        	usedPots 			= splitsUsed.fixedPots;
	        	product.potted 		= splitsUsed.amountPotted;
	        	product.toPot 		= product.amount - product.potted;
	        	availablePots 		= Utils.getUnusedPots( splitsUsed.fixedPots, _pottingArray );
	        }*/

			availablePots.forEach( function( nextPot )
	        {
				if ( product.amount > product.potted ) 
				{
					product.potted += fillSinglePot( product, nextPot );
					usedPots.push( nextPot );
	            }	        
	        });

	        _remainder		= product.amount - product.potted;
	        _pottingArray	= usedPots;
	    }

	    /*function forcePotting( product, usePots )
	    {
			var fixedPots = [];
			var amountPotted = 0;

	    	var splits = product.splits.sort( function( a, b)
    		{
    			return parseInt( a ) - parseInt( b );
    		});

	    	splits.forEach( function( forceCapacity )
	    	{
	    		var splitAssigned = false;

	    		_pottingArray.forEach( function( potData )
	    		{
	    			if ( splitAssigned ) return;

	    			if ( potData.minimum <= forceCapacity && potData.capacity >= forceCapacity && !potData.isFixed )
	    			{
	    				splitAssigned 		= true;

	    				potData.contents 	= forceCapacity;
	    				amountPotted 		+= forceCapacity;
	    				potData.product 	= product.id;
	    				potData.isFixed 	= true;

	    				fixedPots.push( potData );
	    			}
	    		});
	    	});

	    	return { fixedPots:fixedPots, amountPotted:amountPotted };
	    }*/

	    function getSplitsString()
	    {
	    	var splits = [];

	    	_pottingArray.forEach( function( pot )
	    	{
	    		splits.push( Utils.potifyString( String( parseInt( pot.contents ))));
	    	});

	    	return splits.join(" / ");
	    }
	    
	    function getRemainingSpace()
	    {
	        return _pottingArray.reduce( function( count, nextPot )
	        {
	           //return count + nextPot.getCapacity() - nextPot.getContents();
	           return count + nextPot.capacity - nextPot.contents;
	        }, 0);
	    }

	    function getUsedPotsById()
	    {
	        _pottingArray.sort( PotSorter.sortPotsById );
	        
	        return _pottingArray.reduce( function( idList , nextPot  )
	        {
	            //return idList + nextPot.getId();
	            return idList + nextPot.id;
	        }, '');
	    }

	    /*function getPotToFix( fromPots )
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = fromPots.length - 1; i >= 0; i--) 
	    	{
	    		pot = fromPots[i];

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

	    	return { potToFill:potToFill, otherPots:otherPots };
	    }*/

	    /*function fixLastPot( lastPot, remainingPots)
	    {
			var needed = lastPot.minimum - lastPot.contents;

	        var amountToMove;
	        var helperPot;

	        remainingPots.sort( PotSorter.sortPotsByAmountMoveable );

	        for ( var i = 0; i < remainingPots.length; i++ )
	        {
	            helperPot = remainingPots[ i ];

	            if ( helperPot.isFixed ) continue;

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
	    }*/

	    function toString()
	    {
	    	return;
	    }
	};

	function checkPotCapacityAgainstContents( isWithinRules, potData )
	{
		var willPot = potData.contents >= potData.minimum;

	    return isWithinRules && willPot;
	}

	function DynamicPottingSetValidator()
	{
		return { isValid:isValid };

		function isValid( forPotting )
	    {
	    	if ( forPotting.length === 0 ) return false;

	        var valid = forPotting.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	        	var fillData = getPotToFix( forPotting );
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function getPotToFix( fromPots )
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = fromPots.length - 1; i >= 0; i--) 
	    	{
	    		pot = fromPots[i];

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

	    	return { potToFill:potToFill, otherPots:otherPots };
	    }

	    function fixLastPot( lastPot, remainingPots)
	    {
			var needed = lastPot.minimum - lastPot.contents;

	        var amountToMove;
	        var helperPot;

	        remainingPots.sort( PotSorter.sortPotsByAmountMoveable );

	        for ( var i = 0; i < remainingPots.length; i++ )
	        {
	            helperPot = remainingPots[ i ];

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
	}


	function StaticPottingSetValidator()
	{
		return { isValid:isValid };

		function isValid( forPotting )
	    {
	    	if ( forPotting.length === 0 ) return false;

	        var valid = forPotting.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	            return false;
	        }
	    }

	    function forcePotting( product, usePots )
	    {
			var fixedPots = [];
			var amountPotted = 0;

	    	var splits = product.splits.sort( function( a, b)
    		{
    			return parseInt( a ) - parseInt( b );
    		});

	    	splits.forEach( function( forceCapacity )
	    	{
	    		var splitAssigned = false;

	    		usePots.forEach( function( potData )
	    		{
	    			if ( splitAssigned ) return;

	    			if ( potData.minimum <= forceCapacity && potData.capacity >= forceCapacity && !potData.isFixed )
	    			{
	    				splitAssigned 		= true;

	    				potData.contents 	= forceCapacity;
	    				amountPotted 		+= forceCapacity;
	    				potData.product 	= product.id;
	    				potData.isFixed 	= true;

	    				fixedPots.push( potData );
	    			}
	    		});
	    	});

	    	return { fixedPots:fixedPots, amountPotted:amountPotted };
	    }
	}

}());
},{"./Utils.js":10}],8:[function(require,module,exports){
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
	        	pottingSet.putProductIntoPots( {id:product.id, amount:product.amount, splits:product.pots });
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

	       // console.table( debugResult );
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
},{"./PottingSet.js":7,"./Utils.js":10}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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

	exports.getProductsFromPots = function( usedPots )
	{
		return usedPots.reduce( function getPotConfiguration( configData, potData )
		{
				//ignore empty pots
				if ( !potData.contents ) return configData;

				if ( !configData.hasOwnProperty( potData.product ) )
				{
					configData[ potData.product ]		= {};
					configData[ potData.product ].pots 	= [];
					configData[ potData.product ].id 	= potData.product;
					configData[ potData.product ].amount= 0;
				}

				configData[ potData.product ].pots.push( potData );
				configData[ potData.product ].amount += potData.contents;
				
				return configData;
		},{});
	};

	exports.potifyString = function( s )
	    {
	    	var isTrailingZero = true;
	    	var splits = '';
	    	var charAt;

	    	for ( var i = s.length - 1; i >= 0; i-- )
	    	{
	    		charAt = s.charAt( i );

	    		if ( parseInt( charAt ) > 0 )
	    		{
	    			isTrailingZero = false;
	    		}

	    		if ( isTrailingZero && charAt === '0' ) continue;

	    		splits += charAt;

	    	}

	    	//return splits;//.split("").reverse().join(" /");
	    	return splits.split("").reverse().join("");
	    };

	exports.potifyNumber = function( number )
	{
		var numberLength = String( Number( number ) ).length;

		if ( String( Number( number ) ).length >= 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
	};

	exports.copyPotArray = function( pots )
	{
		var newPots = pots.map( function( potDataObj )
		{
			return JSON.parse( JSON.stringify( potDataObj ));
		});

		return newPots;
	};

    exports.getUnusedPots = function( usedPots, availablePots )
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
	    	if ( aPot.isFixed && bPot.isFixed ) return 0;

	    	if ( aPot.isFixed ) return 1;

	    	if ( bPot.isFixed ) return -1;

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
},{}],11:[function(require,module,exports){
(function()
{
	module.exports = ViewController;

	var PotDisplayController    = require("./PotDisplayController.js");
    var PotInputController      = require("./PotInputController.js");
    var cPottingResult 			= require("./data/PottingResult.js");
    var PottingResult 			= new cPottingResult();
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
					showFeedback: 	showFeedback,
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

	function showFeedback( messageList )
	{
		var classes = [];

		classes[ PottingResult.SUCCESS 	] = [ "has-success","has-feedback"];
		classes[ PottingResult.ERROR 	] = [ "has-error","has-feedback"];
		classes[ PottingResult.WARN 	] = [ "has-warning","has-feedback"];

		_formController.clearFeedback();

		messageList.forEach( function( messageData )
		{
			messageData.classes 	= classes[ messageData.pottingStatus ];
			//using apply allows us to pass an array of arguments to be called as ordered function params
			//messageDiv.classList.add.apply( messageDiv.classList, classes[ messageData.pottingStatus ]);

			_formController.showProductFeedback( messageData );
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

},{"./PotDisplayController.js":2,"./PotInputController.js":3,"./Tabs.js":9,"./data/PottingResult.js":13}],12:[function(require,module,exports){
/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
			var PottingData             = require('./PottingData.js');
			var ViewController          = require("./ViewController.js");
			var PottingResponder 		= require('./PottingResponse.js');

			var data;
			var view;
			var responder;

			window.onload   = function()
			{
				data                = PottingData();
				view                = ViewController( document.querySelector(".content") );
				responder			= PottingResponder();

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
				var currentTerminal = data.changeTerminal( "bramhall" );

				view.init( currentTerminal.pots, currentTerminal.products );
			}

			function onPotTankerSelected( evt )
			{	
				var pottingResult   = data.getPotting( evt.detail.enteredProducts );

				showPotting( pottingResult );
			}

			function onBalanceTankerSelected( evt )
			{
				var pottingResult = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );

				showPotting( pottingResult );
				var totals = data.getProductTotals();

				var prodToUpdate = {};
				
				prodToUpdate[ evt.detail.productToFill ] = totals[ evt.detail.productToFill ];

				view.updateProductInputs( prodToUpdate );
			}

			function showPotting( pottingResult )
			{
				var  messages = [];

				pottingResult.pottedProducts.forEach( function( result )
				{
					messages.push( responder.getPottingResponse( result ));
				});

				view.showResults( pottingResult.potsUsed );
				
				view.showFeedback( messages );
			}

			function onSwapPotContents( evt )
			{
				var pottingResult = data.changePotPosition( evt.detail.pot1, evt.detail.pot2 );

				view.showResults( pottingResult.potsUsed );

				showPotting( pottingResult );

				//view.updateProductInputs( data.getProductTotals() );
			}


			
}());            
},{"./PottingData.js":5,"./PottingResponse.js":6,"./ViewController.js":11}],13:[function(require,module,exports){
(function()
{
	PottingResult.prototype.SUCCESS = 0;
	PottingResult.prototype.ERROR 	= 1;
	PottingResult.prototype.WARN 	= 2;

	module.exports = PottingResult;

	function PottingResult( forProduct, pottingSetUsed, productLeftOver )
	{
		this.pottingUsed 	= pottingSetUsed;
		this.productDetails = forProduct;
		this.remainder 		= productLeftOver;
	}

	function updatePot( potId )
	{
		
	}
}());
},{}],14:[function(require,module,exports){
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
},{}]},{},[12])
//# sourceMappingURL=app.js.map
