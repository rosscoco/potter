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

	module.exports			= PottingData;

	function PottingData()
	{	
		_terminals	= [];
		_potting	= [];

		return {	loadProductData:	loadProductData,
					changeTerminal:		changeTerminal,
					potProducts:		potProducts,
					changePotPosition:	changePotPosition,
					getProductTotals:	getProductTotals,
					balanceTanker:		balanceTanker };
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

		resetPots();

		return _currentTerminal;
	}

	function increasePot( potId )
	{

	}

	function balanceTanker( productToFill, productArray )
	{
		resetPots();

		productToFill = _currentTerminal.getBalance( productToFill, productArray );

		productArray.push( productToFill );
		
		/*var potsToFill = _potting.filter( function isFixedPot( potData )
		{
			return !potData.isFixed;
		});*/

		return getPotting( productArray);

		//return getPotting( [ productToFill ], potsToFill.length > 0 ? potsToFill : undefined );
	}

	function potProducts( forProducts, limitToPots )
	{
		resetPots();
		return getPotting( forProducts, limitToPots );
	}

	function getPotting( forProducts, limitToPots )
	{
		var usedPots		= [];
		var availablePots	= limitToPots ?  limitToPots : _currentTerminal.pots.slice();
		//var availablePots	= Utils.getUnusedPots( limitToPots, _currentTerminal.pots.slice() );
		
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

	function changePotPosition( fromPotId, toPotId )
	{
		var fromPot		= _potting[ fromPotId - 1 ];
		var toPot		= _potting[ toPotId - 1 ];

		var fromPotCopy	= JSON.parse( JSON.stringify( fromPot ));

		fromPot.contents= Math.min( fromPot.capacity, toPot.contents );
		fromPot.product	= toPot.product;
		fromPot.isFixed	= false;
		
		toPot.contents	= Math.min( toPot.capacity, fromPotCopy.contents );
		toPot.product	= fromPotCopy.product;
		toPot.isFixed	= true;

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
