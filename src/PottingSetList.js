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
	        var debugCounter 	= 0;

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