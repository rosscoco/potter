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