
(function()
{
	"use strict";

	var Utils 			= require("./Utils.js");
	var PottingSetList	= require("./PottingSetList.js");

	module.exports = function PottingController( listOfPots )
	{
	    var _basePots   = listOfPots;
	    var _activePots,_products;
	    
	    return {
	        doPottingWithProduct   : doPottingWithProduct,
	        usedPots :_basePots
	    };

	    function putProductIntoPots( product )
	    {

	    }

	    function doPottingWithProduct( withProduct, withPots )
	    {
	        _activePots             = withPots;        

	        var productRemainder    = {};
	        var pottingUsed         = [];
	        var usedPottingSet      = '';

	         var spaceAvailable     = _activePots.reduce( function ( count, potData )
	         {
	            return count + potData.capacity;
	         }, 0 );

	         if ( spaceAvailable < withProduct.amount )
	         {
	            withProduct.amount = spaceAvailable;
	            productRemainder[ withProduct.id ] = withProduct.amount - spaceAvailable;
	         }

	        usedPottingSet = getBestPotsForProduct( _activePots, withProduct );

	        pottingUsed.push( usedPottingSet );

	        return pottingUsed;
	    }

	    function getBestPotsForProduct( withPots, product )
	    {
	        var allPotPermutations  = Utils.getPotPermutations( withPots );

	        //var allPottingSets      = new PottingSetList( allPotPermutations );
	        var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var validPottingSets    = [];
	        var invalidPottingSets  = [];

	        var bestPottingSet      = allPottingSets.getBestPottingSet();

	        console.log( "Best Potting Set: ");
	        
	        return bestPottingSet;
	    }
	};
}());