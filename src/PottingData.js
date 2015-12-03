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

	module.exports = PottingData;

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

	function getPotting( forProducts, limitToPots )
	{
		console.log("Get Potting ");

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

			var potsUsedForProduct =  pottingResult.pottingUsed.getPotArray();
			
			usedPots			= usedPots.concat( potsUsedForProduct );

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

	function getProductTotals()
	{
		var log = {};

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

		}, log );
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
