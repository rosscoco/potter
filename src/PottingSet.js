/* globals debugger:false */
(function()
{
	"use strict";
	var Utils 			=	require("./Utils.js");
	var PotSorter 		=	Utils.PotSorter;
	
	module.exports = function PottingSet( fromPotArr, isFixed )
	{
		var _isFixed 		= isFixed;
	    var _availablePots 	= fromPotArr;// ? fromPotArr : [];
	    var _remainder 		= 0;
	    

	    return {
	        putProductIntoPots      : putProductIntoPots,
	        fillSinglePot 			: fillSinglePot,
	        isValid                 : isValid,

	        getRemainingSpace       : getRemainingSpace,
	        getUsedPotsById         : getUsedPotsById,
	        getPotArray             : getPotArray,
	        getRemainder			: getRemainder,
	        getSplitsString 		: getSplitsString
	    };

	    function getRemainder()
	    {
	    	return _remainder;
	    }

	    function getPotArray()
	    {
	        return _availablePots;
	    }

	    function isValid()
	    {
	    	if ( _availablePots.length === 0 ) return false;

	        var valid = _availablePots.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else if ( _isFixed )
	        {
	        	return false;
	        }
	        else
	        {
	        	var fillData = getPotToFix();
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function checkPotCapacityAgainstContents( isWithinRules, potData )
	    {
	    	var willPot = potData.contents >= potData.minimum;

	        return isWithinRules && willPot;
	    }

	    function fillSinglePot( withProduct, pot )
	    {
	        pot.product 	= withProduct.id;
	        var leftToPot 	= withProduct.amount - withProduct.potted;

	        if ( pot.capacity > leftToPot  )
	        {
	            pot.contents = leftToPot;
			}
	        else
	        {
	            pot.contents = pot.capacity;
	        }

	        return pot.contents;
	    }

	    function putProductIntoPots( product )
	    {
	        var usedPots	= [];
	        product.potted	= 0;
	        product.toPot	= product.amount;

	        _availablePots.forEach( function( nextPot )
	        {
	            if ( product.amount > product.potted ) 
	            {
	            	product.potted += fillSinglePot( product, nextPot );
	            	
	                usedPots.push( nextPot );
	            }	        
	        });

	        _remainder		= product.amount - product.potted;
	        _availablePots	= usedPots;
	    }

	    function getSplitsString()
	    {
	    	var splits = [];

	    	_availablePots.forEach( function( pot )
	    	{
	    		splits.push( Utils.potifyString( String( parseInt( pot.contents ))));
	    	});

	    	return splits.join(" / ");
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

	    function getPotToFix()
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = _availablePots.length - 1; i >= 0; i--) 
	    	{
	    		pot = _availablePots[i];

	    		if ( pot.contents >= pot.minimum )
	    		{
	    			otherPots.push( pot );
	    		}
	    		else
	    		{
	    			if ( potToFill )
	    			{
	    				debugger;
	    				console.log("SOMETHIGN HAS GONE WRONG!!");
	    			}

	    			potToFill = pot;
	    		}
	    	}

	    	return { potToFill:potToFill, otherPots:otherPots };
	    }

	    function fixLastPot( lastPot, remainingPots)
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

	        return false;
	    }

	    function toString()
	    {
	    	return;
	    }
	};

}());