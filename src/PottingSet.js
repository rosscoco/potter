(function()
{
	"use strict";
	var PotSorter = require("./Utils.js").PotSorter;
	
	module.exports = function PottingSet( fromPotArr )
	{
	    var _availablePots = fromPotArr;

	    return {
	        putProductIntoPots      : putProductIntoPots,
	        getUsedPotsById         : getUsedPotsById,
	        willPotWithinRules      : willPotWithinRules,
	        getRemainingSpace       : getRemainingSpace,
	        getUsedPots             : getUsedPots,
	        isValid                 : isValid
	    };

	    function getUsedPots()
	    {
	        return _availablePots;
	    }

	    function isValid()
	    {
	        var valid = _availablePots.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	        	var fillData = getPotToFill();
	            return fillLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function checkPotCapacityAgainstContents( isWithinRules, potData )
	    {
	    	var willPot = potData.contents > potData.minimum;
	    	console.log( potData.contents, potData.minimum, potData.contents > potData.minimum );

	        return isWithinRules && willPot;
	    }

	    function fillSinglePot( withProduct, pot )
	    {
	        console.log("Filling Pot " + pot.id + " with " + withProduct.amount + " of " + withProduct.id );

	        pot.product = withProduct.id;

	        if ( pot.capacity > withProduct.amount )
	        {
	            pot.contents = withProduct.amount;

	            return withProduct.amount;
	        }
	        else
	        {
	            pot.contents = pot.capacity;
	            withProduct.amount -= pot.capacity;
	            return pot.capacity;
	        }
	    }

	    function putProductIntoPots( product )
	    {
	        var usedPots = [];

	        _availablePots.forEach( function( nextPot )
	        {
	            if ( product.amount > 0 ) 
	            {
	                product.amount -= fillSinglePot( product, nextPot );
	                usedPots.push( nextPot );
	            }	        
	        });

	        _availablePots = usedPots;
	        //console.log( _availablePots );

	       // return product;        
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
	        _availablePots.sort( PotSorter.sortPotsById );
	        
	        return _availablePots.reduce( function( idList , nextPot  )
	        {
	            //return idList + nextPot.getId();
	            return idList + nextPot.id;
	        }, '');
	    }

	    function willPotWithinRules( potCombination )
	    {
	        var potToFill;
	        var otherPots = potCombination.filter( function( potData )
	        {
	            if ( potData.contents > potData.minimum )
	            {
	                return true;
	            }
	            else
	            {
	                potToFill = potData;
	            }
	        });

	        //count how much product is over each pots minimum amount. This will give us the total we can move to the last pot
	        var available = otherPots.reduce( function( productAvailable, nextPotToCheck )
	        {
	            return productAvailable + ( nextPotToCheck.contents - nextPotToCheck.minimum );
	        }, 0 );

	        //check there's enough product to move away from other pots
	        if ( potToFill.contents + available >= potToFill.minimum ) 
	        {
	            //If product available then move from other pots into the last pot
	            fillLastPot( potToFill, otherPots );

	            return true;
	        }
	        else
	        {
	            return false;   //cannot pot within rules
	        }
	    }


	    function getPotToFill()
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	for (var i = _availablePots.length - 1; i >= 0; i--) 
	    	{
	    		pot = _availablePots[i];

	    		if ( pot.contents > pot.minimum )
	    		{
	    			otherPots.push( pot );
	    		}
	    		else
	    		{
	    			if ( potToFill )
	    			{
	    				console.log("SOMETHIGN HAS GONE WRONG!!");
	    			}

	    			potToFill = pot;
	    		}
	    	}

	    	return {potToFill:potToFill, otherPots:otherPots};
	    }

	    function IsGreaterThan( checkAgainst )
	    {
	        var mustBeGreaterThan = checkAgainst;

	        return function( amountToCheck )
	        {
	            return amountToCheck > checkAgainst;
	        };
	    }
 
	    function fillLastPot( lastPot, remainingPots)
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
	            	return true;	                
	            }
	        }
	    }
	};
}());