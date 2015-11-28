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
		_potConfiguration 	=[];

		var potsUsed 		= [];
		var availablePots 	= limitToPots ?  limitToPots : _currentTerminal.pots.slice();
		var pottingResult;
		var currentWeight;

		forProducts.forEach( function( productDetails )
        {
            if ( availablePots.length === 0 ) return;

            productDetails      = _currentTerminal.checkWeight( productDetails, potsUsed );
            pottingResult       = _potter.doPottingWithProduct( productDetails, availablePots.slice() );
            potsUsed			= potsUsed.concat( pottingResult.pottingUsed.getPotArray() );
            availablePots      	= Utils.filterRemainingPots( potsUsed, availablePots );

            _potConfiguration.push( pottingResult );

        });

        return potsUsed;
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
