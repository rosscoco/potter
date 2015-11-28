
(function()
{
	"use strict";

	var Utils 			= require("./Utils.js");
	var PottingSetList	= require("./PottingSetList.js");
	var PottingResult 	= require("./data/PottingResult.js");

	module.exports = function PottingController( listOfPots )
	{
	    var _basePots   = listOfPots;
	    var _activePots,_products;
	    
	    return {
	        doPottingWithProduct   : doPottingWithProduct
	    };

	    function doPottingWithProduct( withProduct, withPots )
	    {
	        _activePots             = withPots;        

	        var productNotPotted 	= 0;
	        var pottingSetUsed;			//PottingSet;
	        var usedPottingSet      = '';

	         var spaceAvailable     = _activePots.reduce( function ( count, potData )
	         {
	            return count + potData.capacity;
	         }, 0 );

	         if ( spaceAvailable < withProduct.amount )
	         {
	            withProduct.amount 	= spaceAvailable;
	            productNotPotted 	= withProduct.amount - spaceAvailable;
	         }

	        pottingSetUsed = getBestPotsForProduct( _activePots, withProduct );

	        withProduct.remainder = productNotPotted;
	        //return { pottingSetUsed:pottingSetUsed, remainder: productNotPotted, product:withProduct };
	        var result = new PottingResult( withProduct, pottingSetUsed );
	        return result;
	    }

	    function getBestPotsForProduct( withPots, product )
	    {
	        var allPotPermutations  = Utils.getPotPermutations( withPots );

	        //var allPottingSets      = new PottingSetList( allPotPermutations );
	        var allPottingSets      = new PottingSetList( [JSON.parse(JSON.stringify(withPots)), JSON.parse( JSON.stringify( withPots.reverse() ))] );
	        //var allPottingSets      = new PottingSetList( [ JSON.parse( JSON.stringify( withPots ))]);
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var bestPottingSet      = allPottingSets.getBestPottingSet();
	        
	        return bestPottingSet;
	    }
	};
}());