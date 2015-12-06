/* globals debugger:false */
(function()
{
	"use strict";
	var Utils 			=	require("./Utils.js");
	var PotSorter 		=	Utils.PotSorter;
	
	module.exports = function PottingSet( fromPotArr, isFixed )
	{
		var _isFixed 		= isFixed;
	    var _pottingArray 	= fromPotArr;// ? fromPotArr : [];
	    var _remainder 		= 0;
	    var _pottingValidator;

	    if ( _isFixed ) _pottingValidator = StaticPottingSetValidator();
	    else 			_pottingValidator = DynamicPottingSetValidator();
	    
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
	        return _pottingArray;
	    }

	    function isValid()
	    {
	    	var result = _pottingValidator.isValid( _pottingArray );
	    	return result;

	    	/*if ( _pottingArray.length === 0 ) return false;

	        var valid = _pottingArray.reduce( checkPotCapacityAgainstContents, true );

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
	        	var fillData = getPotToFix( _pottingArray );
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }*/
	    }	   

	    function fillSinglePot( withProduct, pot )
	    {
	        pot.product 	= withProduct.id;
	        var leftToPot 	= withProduct.amount - withProduct.potted;

	    	if ( pot.isFixed ) return 0;

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
	        var usedPots		= [];
	        var availablePots 	= _pottingArray.slice();

	        product.potted		= 0;
	        product.toPot		= product.amount;

	        /*if ( product.splits ) 
	        {
	        	var splitsUsed 		= forcePotting( product );
	        	usedPots 			= splitsUsed.fixedPots;
	        	product.potted 		= splitsUsed.amountPotted;
	        	product.toPot 		= product.amount - product.potted;
	        	availablePots 		= Utils.getUnusedPots( splitsUsed.fixedPots, _pottingArray );
	        }*/

			availablePots.forEach( function( nextPot )
	        {
				if ( product.amount > product.potted ) 
				{
					product.potted += fillSinglePot( product, nextPot );
					usedPots.push( nextPot );
	            }	        
	        });

	        _remainder		= product.amount - product.potted;
	        _pottingArray	= usedPots;
	    }

	    /*function forcePotting( product, usePots )
	    {
			var fixedPots = [];
			var amountPotted = 0;

	    	var splits = product.splits.sort( function( a, b)
    		{
    			return parseInt( a ) - parseInt( b );
    		});

	    	splits.forEach( function( forceCapacity )
	    	{
	    		var splitAssigned = false;

	    		_pottingArray.forEach( function( potData )
	    		{
	    			if ( splitAssigned ) return;

	    			if ( potData.minimum <= forceCapacity && potData.capacity >= forceCapacity && !potData.isFixed )
	    			{
	    				splitAssigned 		= true;

	    				potData.contents 	= forceCapacity;
	    				amountPotted 		+= forceCapacity;
	    				potData.product 	= product.id;
	    				potData.isFixed 	= true;

	    				fixedPots.push( potData );
	    			}
	    		});
	    	});

	    	return { fixedPots:fixedPots, amountPotted:amountPotted };
	    }*/

	    function getSplitsString()
	    {
	    	var splits = [];

	    	_pottingArray.forEach( function( pot )
	    	{
	    		splits.push( Utils.potifyString( String( parseInt( pot.contents ))));
	    	});

	    	return splits.join(" / ");
	    }
	    
	    function getRemainingSpace()
	    {
	        return _pottingArray.reduce( function( count, nextPot )
	        {
	           //return count + nextPot.getCapacity() - nextPot.getContents();
	           return count + nextPot.capacity - nextPot.contents;
	        }, 0);
	    }

	    function getUsedPotsById()
	    {
	        _pottingArray.sort( PotSorter.sortPotsById );
	        
	        return _pottingArray.reduce( function( idList , nextPot  )
	        {
	            //return idList + nextPot.getId();
	            return idList + nextPot.id;
	        }, '');
	    }

	    /*function getPotToFix( fromPots )
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = fromPots.length - 1; i >= 0; i--) 
	    	{
	    		pot = fromPots[i];

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
	    }*/

	    /*function fixLastPot( lastPot, remainingPots)
	    {
			var needed = lastPot.minimum - lastPot.contents;

	        var amountToMove;
	        var helperPot;

	        remainingPots.sort( PotSorter.sortPotsByAmountMoveable );

	        for ( var i = 0; i < remainingPots.length; i++ )
	        {
	            helperPot = remainingPots[ i ];

	            if ( helperPot.isFixed ) continue;

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
	    }*/

	    function toString()
	    {
	    	return;
	    }
	};

	function checkPotCapacityAgainstContents( isWithinRules, potData )
	{
		var willPot = potData.contents >= potData.minimum;

	    return isWithinRules && willPot;
	}

	function DynamicPottingSetValidator()
	{
		return { isValid:isValid };

		function isValid( forPotting )
	    {
	    	if ( forPotting.length === 0 ) return false;

	        var valid = forPotting.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	        	var fillData = getPotToFix( forPotting );
	            return fixLastPot( fillData.potToFill, fillData.otherPots );
	        }
	    }

	    function getPotToFix( fromPots )
	    {
	    	var potToFill;
	    	var pot;
	    	var otherPots = [];
	    	
	    	for ( var i = fromPots.length - 1; i >= 0; i--) 
	    	{
	    		pot = fromPots[i];

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
	            helperPot = remainingPots[ i ];

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
	}


	function StaticPottingSetValidator()
	{
		return { isValid:isValid };

		function isValid( forPotting )
	    {
	    	if ( forPotting.length === 0 ) return false;

	        var valid = forPotting.reduce( checkPotCapacityAgainstContents, true );

	        if ( valid )
	        {
	            return true;
	        } 
	        else
	        {
	            return false;
	        }
	    }

	    function forcePotting( product, usePots )
	    {
			var fixedPots = [];
			var amountPotted = 0;

	    	var splits = product.splits.sort( function( a, b)
    		{
    			return parseInt( a ) - parseInt( b );
    		});

	    	splits.forEach( function( forceCapacity )
	    	{
	    		var splitAssigned = false;

	    		usePots.forEach( function( potData )
	    		{
	    			if ( splitAssigned ) return;

	    			if ( potData.minimum <= forceCapacity && potData.capacity >= forceCapacity && !potData.isFixed )
	    			{
	    				splitAssigned 		= true;

	    				potData.contents 	= forceCapacity;
	    				amountPotted 		+= forceCapacity;
	    				potData.product 	= product.id;
	    				potData.isFixed 	= true;

	    				fixedPots.push( potData );
	    			}
	    		});
	    	});

	    	return { fixedPots:fixedPots, amountPotted:amountPotted };
	    }
	}

}());