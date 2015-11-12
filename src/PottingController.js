
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
	        doPottingWithProducts   : doPottingWithProducts,
	        usedPots :_basePots
	    };

	    function putProductIntoPots( product )
	    {

	    }

	    function doPottingWithProducts( withProducts )
	    {
	        _activePots         = _basePots.slice();        
	        _products           = withProducts;

	        var productRemainder = {};
	        var pottingUsed     = [];
	        var usedPottingSet  = '';

	        function reduceToUnusedPots( potCheckingData, nextPotToCheck )
            {
                if ( potCheckingData.usedPots.getUsedPotsById().indexOf( nextPotToCheck.id ) < 0 )
                {
                    potCheckingData.unusedPots.push( nextPotToCheck );
                }

            	return potCheckingData; 
         	}

	       withProducts.sort( function( a, b ) { return a.amount - b.amount; });

	        for ( var i = 0; i < _products.length; i++ )
	        {
	             var spaceAvailable = _activePots.reduce( function ( count, potData )
	             {
	                return count + potData.capacity;
	             }, 0);

	             if ( spaceAvailable < _products[ i ].amount )
	             {
	                products[i].amount = spaceAvailable;
	                productRemainder[ products[i].id ] = _products[i].amount - spaceAvailable;
	             }

	            usedPottingSet = getBestPotsForProduct( _activePots, _products[ i ] );

	            //usedPots = doPotting( _activePots, _products[ i ]);

	            pottingUsed.push( usedPottingSet );

	            //remove the pots used in the last product potting before we try and pot the next product
	            _activePots = _activePots.reduce( function ,  ).unusedPots;
	        }                                           

	        return pottingUsed;
	    }


	    function potSingleProduct( remainingPots, product )
	    {
	        currentProduct = product;

	       return doPotting( remainingPots, product );
	    }

	    function potSingleProduct( withPots, product )
	    {
	        var allPotPermutations  = Utils.getPotPermutations( withPots );

	        var allPottingSets      = new PottingSetList( );
	        var uniquePottingSets   = allPottingSets.sendProductToPottingSets( product );

	        var validPottingSets    = [];
	        var invalidPottingSets  = [];

	        uniquePottingSets.forEach( function( pottingSet )
	        {
	            pottingSet.data.forEach( function( potData )
	            {
	                if ( potData.contents < potData.minimum )
	                {
	                    //invalidPottingSets.push( pottingSet.data ));
	                    invalidPottingSets.push( pottingSet ););
	                    return;
	                }

	                //validPottingSets.push( pott`ingSet.data );
	                validPottingSets.push( pottingSet );
	            });
	        });

	        var fixablePottingSets = invalidPottingSets.filter( 
	        {
	            for ( var i = 0;; i < pottingSet.data.length; );
	        });

	        {
	            var potToFix;
	            potArray.sort( PotSorter.sortPotsBy);
	            
	            potArray = potArray.filter( function( potData ) 
	            { 
	                if ( potData.contents > potData.capacity )
	                {
	                    return true;
	                }
	                else
	                {
	                    potToFix = potData;
	                    return false;
	                }
	            });    

	            var productToMove = potArray.reduce( function( count, nextPot )
	            {
	               //return count + nextPot.getCapacity() - nextPot.getContents();
	               return count + nextPot.capacity - nextPot.contents;
	            }, 0);
	            
	        });

	        var bestPottingSet = allPottingSets.getBestPottingSet();



	        console.log("Best Potting Set: ");
	        


	        //console.table( bestPottingSet.data );
	        
	        return bestPottingSet;
	    };
	}
}();}