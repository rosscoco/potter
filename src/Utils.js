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

		if ( String( Number( number ) ).length >= 4 ) return parseInt( number );

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
    	if ( !usedPots )				return availablePots;
    	if ( usedPots.length === 0 )	return availablePots;

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

	    /*	potData.status =  	0 : OK
	    						1 : Need to increase contents 
	    						2 : Need to decrease contents

	    	potData.diff = absolute difference between pot min/max and intended contents
	    */ 
	    sortPotsByBestFit : function sortPotsByBestFit( potA, potB )
		{
			if ( potA.status === potB.status )	return potA.diff - potB.diff;
			else								return potA.status - potB.status;
		}
	};
}());