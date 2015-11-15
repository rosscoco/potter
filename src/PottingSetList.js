(function()
{
	"use strict";
	
	var PotSorter = require('./Utils.js').PotSorter;
	var PottingSet = require('./PottingSet.js');

	module.exports = function PottingSetList( withListOfPots )
	{
	   var _listOfPottingSets = withListOfPots.map( function( potArray ) 
	    {
	        return new PottingSet( potArray );
	    });

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
	            pottingSet.putProductIntoPots( {id:product.id, amount:product.amount });
	            console.log( pottingSet.getUsedPots() );
	        });

	        

	        removeDuplicates();
	        removeInvalid();

	        //getBestPottingSet();
	        _listOfPottingSets.sort( PotSorter.sortPotSetsByRemainder );

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
	        });
	    }

	    function getBestPottingSet()
	    {
	        _listOfPottingSets.sort( PotSorter.sortPotSetsByRemainder );
	        return _listOfPottingSets[ 0 ];
	    }
	};
}());