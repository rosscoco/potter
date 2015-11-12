(function()
{
	"use strict";
	
	module.exports.PottingSetList = PottingSetList;

	function PottingSetList( withListOfPots )
	{
	   var _listOfPottingSets = withListOfPots.map( function( potArray ) 
	    {
	        return new PottingSet( potArray );
	    });

	    return {
	        sendProductToPottingSets    : sendProductToPottingSets
	    };

	    function removeDuplicates()
	    {
	        var uniquePotCombos = [];
	        var listOfPotCombos = {};

	        _listOfPottingSets.forEach ( function( pottingSet )
	        {
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
	            pottingSet.putProductIntoPots( product );
	        });

	        removeDuplicates();
	        removeInvalid();

	        return _listOfPottingSets;
	    }

	    function removeInvalid()
	    {
	        _listOfPottingSets = _listOfPottingSets.filter( function( pottingSet )
	        {
	            if ( pottingSet.isValid() )
	            {
	                return true;
	            }
	            else if ( pottingSet)
	            else;
	            {
	                return pottingSet.checkRules(); 
	            }            
	        });
	    }

	    function getBestPottingSet()
	    {
	        _listOfPottingSets.sort( PotSorters.sortPotSetsByRemainder );
	        return _listOfPottingSets[ 0 ];
	    }
	}
}());