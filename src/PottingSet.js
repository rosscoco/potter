(function()
{
	"use strict";
	
	module.exports = function PottingSet( fromPotArr )
	{
	    var _availablePots = fromPotArr;

	    return {
	        putProductIntoPots      : putProductIntoPots,
	        getUsedPotsById         : getUsedPotsById,
	        checkRules              : checkRules,
	        getRemainingSpace       : getRemainingSpace,
	        data                    : _availablePots,
	        isValid                 : isValid
	    };

	    function isValid()
	    {
	        var valid = _availablePots.reduce( function( isWithinRules, potData )
	        {
	            return isWithinRules && potData.capacity > potData.minimum;

	        }, true );

	        if ( !valid )
	        {
	            
	        }

	        if ( valid ) return true;


	    }

	    function fillSinglePot( withProduct, pot )
	    {
	        pot.product = withProduct.id;

	        if ( pot.capacity > withProduct.amount )
	        {
	            pot.contents = withProduct.amount;
	            withProduct.amount = 0;
	        }
	        else
	        {
	            pot.contents = pot.capacity;
	            withProduct.amount -= pot.capacity;
	        }
	    }

	    function putProductIntoPots( product )
	    {
	        _availablePots = _availablePots.reduce( function( usedPots, nextPot )
	        {
	            if ( product.amount > 0 ) usedPots.push( nextPot );

	            product.amount = fillSinglePot( product, nextPot );

	        },[]);

	        return product;        
	    }

	    function getRemainingSpace()
	    {
	        return _availablePots.reduce( function( count, nextPot )
	        {
	           //return count + nextPot.getCapacity() - nextPot.getContents();
	           return count + nextPot.capacity - nextPot.contents;
	        }, 0);
	    }

	    function getUsedPotsById()
	    {
	        _availablePots.sort( PotSorters.sortPotsById );
	        
	        return _availablePots.reduce( function( idList , nextPot  )
	        {
	            //return idList + nextPot.getId();
	            return idList + nextPot.id;
	        }, '');
	    }

	    function checkRules( potCombination )
	    {
	        //last pot in list is always the pot with least in it
	        var lastPot = _availablePots[ _availablePots.length - 1 ];


	        //count how much product is over each pots minimum amount.
	        var available = _availablePots.slice(0,-1).reduce( function( prev, next )
	        {
	            return prev + ( next.contents - next.minimum );
	        }, 0 );

	        //check there's enough product to move away from other pots
	        if ( lastPot.contents + available >= lastPot.minimum ) 
	        {
	            //If product available then move from other pots into the last pot
	            fillLastPot( lastPot, _availablePots.slice( 0, -1 ) );                

	            return true;
	        }
	        else
	        {
	            return false;   //cannot pot within rules
	        }
	    }

	    function IsGreaterThan( checkAgainst )
	    {
	        var mustBeGreaterThan = checkAgainst; 

	        return function( amountToCheck )
	        {
	            return amountToCheck > checkAgainst;
	        };
	    }

	    function fillLastPot( lastPot, remainingPots )
	    {
	        var needed = lastPot.minimum - lastPot.contents;

	        var amountToMove;
	        var helperPot;

	        remainingPots.sort( PotSorter.sortPotsByAmountMoveable );

	        for ( var i = 0; i < remainingPots.length; i++ )
	        {
	            helperPot = remainingPots[i];

	            if ( helperPot.contents - needed > helperPot.minimum )
	            {
	                amountToMove = helperPot.contents - ( helperPot.contents - needed );
	            } 
	            else
	            {
	                //amountToMove = helperPot.contents - ( helperPot.contents - helperPot.minimum );
	                amountToMove = helperPot.contents  - helperPot.minimum;
	            }

	            needed              -= amountToMove;
	            helperPot.contents  -= amountToMove;
	            lastPot.contents    += amountToMove;

	            if ( lastPot.contents >= lastPot.minimum ) 
	            {
	                break;
	            }
	        }
    	}
	};
}());