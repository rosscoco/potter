(function()
{
	"use strict";
	var PRODUCT_DATA_URL 	= './resources/products.json?' + Math.random().toFixed(4);
	
	var Terminal 			= require('./data/Terminal.js');

	/*var availableProducts 	= [   	{id:1051510, density:0.83,name:"Blah"},
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

	var testProduct 		=       {id:"1051510", amount:18000, pottingUsed:[] };*/
	var _terminals;
	var _potting;

	module.exports = PottingData;

	function PottingData()
	{	
		_terminals = [];
		_potting = [];

		return { 	loadProductData: loadProductData,
					getTerminalData: getTerminalData };
	}

	function setPotting( potting )
	{
		_potting = potting;
	}

	function movePots( pot1Id, pot2Id )
	{
		var pot1 		= _potting[ pot1Id - 1 ];
		var pot2 		= _potting[ pot2Id - 1 ];

		var pot1Copy 	= JSON.parse( JSON.stringify( pot1 ));

		pot1.contents 	= pot2.contents;
		pot1.product 	= pot2.product;
		
		pot2.contents 	= pot1Copy.contents;
		pot2.product 	= pot1Copy.product;

		return _potting;
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
