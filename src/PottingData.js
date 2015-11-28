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

		console.log("moving " + debugPot( pot1 ) + " to " + debugPot( pot2) );

		function debugPot( p )
		{
			return "Pot " + p.id + " " + p.contents + " of " + p.product;
		}

		var pot1Copy 	= JSON.parse( JSON.stringify( pot1 ));

		pot1.contents 	= Math.min( pot1.capacity, pot2.contents );
		pot1.product 	= pot2.product;
		
		pot2.contents 	= Math.min( pot2.capacity, pot1Copy.contents );
		pot2.product 	= pot1Copy.product;

		console.log( "Pot " + pot1Id + " now has " + debugPot( _potting[ pot1Id - 1 ]));
		console.log( "And Pot " + pot2Id + " now has " + debugPot( _potting[ pot2Id - 1 ]));

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
		console.log("Get Potting ");

		_potConfiguration	= [];
		_potting 			= new Array( 6 );
		var potStore		= [];

		var availablePots	= limitToPots ?  limitToPots : _currentTerminal.pots.slice();
		var pottingResult;
		var currentWeight;
		var usedPots;

		console.log(new Array(24 + 1).join('\n'));

		forProducts.forEach( function( productDetails )
		{
			if ( availablePots.length === 0 ) return;

			productDetails		= _currentTerminal.checkWeight( productDetails, potStore );
			pottingResult		= _potter.doPottingWithProduct( productDetails, availablePots.slice() );

			var potsUsedForProduct =  pottingResult.pottingUsed.getPotArray();
			console.log("Used " + potsUsedForProduct .length + " Pots : " + pottingResult.pottingUsed.getUsedPotsById() + " for product " + productDetails.id );
			
			potStore			= potStore.concat( potsUsedForProduct );

			console.log( potStore.length + " pots in potStore " );

			availablePots		= Utils.filterRemainingPots( potStore, availablePots );

			console.log( availablePots.length + "Pots Left " + Utils.getPotString( availablePots ));
			console.log("-------------------------");

			_potConfiguration.push( pottingResult );
		});

		//sort the used pots by id 
		potStore.forEach( function( potData )
		{
			_potting[ potData.id - 1] = potData;
		});

		for ( var i = 0; i < _potting.length; i++ )
		{
			console.log("Filling Potting Array: " + i + "   " + _potting[i]);

			if ( !_potting[i] )
			{
				_potting[i] = JSON.parse( JSON.stringify( _currentTerminal.pots[ i ]));
			}
		}

		_potting.forEach( function(p)
		{
			//console.table(p);
		});

		//reset unused pots to their initial state

		console.log("Potting Done. Used " + _potting.length );

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
