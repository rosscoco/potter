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
	    var _isValid;

	    if ( _isFixed )	_pottingValidator = StaticPottingSetValidator();
	    else			_pottingValidator = DynamicPottingSetValidator();
	    
	    
	    return {
	        putProductIntoPots      : putProductIntoPots,
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
	    }	   

	    function putProductIntoPots( product )
	    {
	    	if ( product.splits )
	    	{	    		
	    		_pottingValidator 		= StaticPottingSetValidator();
	    		var splitsResult 		= _pottingValidator.putProductIntoPots( product, _pottingArray.slice() );
	    		
	    		_pottingArray 			= splitsResult.usedPots;

	    		if ( splitsResult.amountPotted < product.amount )
	    		{
	    			var remainingProduct 	= {id:product.id, amount: product.amount - splitsResult.amountPotted };
	    			var remainingPots 		= DynamicPottingSetValidator();
	    			var remainingResult 	= remainingPots.putProductIntoPots( remainingProduct, splitsResult.remainingPots );
	    			
	    			_pottingArray 			= splitsResult.usedPots.concat( remainingResult.usedPots );
	    		}
	    	}
	    	else
	    	{
	    		_pottingValidator	= DynamicPottingSetValidator();
	    		var result			= _pottingValidator.putProductIntoPots( product, _pottingArray.slice() );
	    		_pottingArray		= result.usedPots;
	    	}
	    }

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
	};

	function checkPotCapacityAgainstContents( isWithinRules, potData )
	{
		var willPot = potData.contents >= potData.minimum;

	    return isWithinRules && willPot;
	}

	function DynamicPottingSetValidator()
	{
		return { isValid:isValid, putProductIntoPots: putProductIntoPots };

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

	    function putProductIntoPots( product, availablePots )
	    {
	    	var usedPots		= [];
	        
			product.potted		= 0;
			product.toPot		= product.amount;

			availablePots.forEach( function( nextPot )
			{
				if ( product.amount > product.potted ) 
				{
					product.potted += fillSinglePot( product, nextPot );
					usedPots.push( nextPot );
				}
			});

	        return { remainder:product.amount - product.potted, usedPots:usedPots };
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

	    function fixLastPot( lastPot, remainingPots)
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
	    }
	}

	function StaticPottingSetValidator()
	{
		return { isValid:isValid, putProductIntoPots: putProductIntoPots };

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

	    function putProductIntoPots( product, availablePots )
	    {
			var fixedPots 		= [];
			var amountPotted 	= 0;
			var usedPots 		= [];
			
			
			//The smallest pot split will give the most wasted space, sort in ascending order to reduce this.
	    	var splits = product.splits.sort( function( a, b )
    		{
    			return parseInt( a ) - parseInt( b );
    		});

    		splits.forEach( function assignPot( split )
    		{
    			var bestPot 		= getBestPotForSplit( split, availablePots );
    			bestPot.product 	= product.id;
    			bestPot.contents 	= Math.min( split, bestPot.capacity );
    			bestPot.isFixed 	= true;
    			amountPotted 		+= bestPot.contents;

    			usedPots.push( bestPot );

    			availablePots = Utils.getUnusedPots( usedPots, availablePots );
    		});

	    	return { usedPots:usedPots, amountPotted:amountPotted, remainingPots:availablePots };
	    }

	    function getBestPotForSplit( split, availablePots )
		{
			var OK 				= 0;
			var MUST_INCREASE 	= 1;
			var MUST_REDUCE 	= 2;
			
			var bestPot;
			var comparison;
			var checkingArr = [];

			//console.log( "Finding Best Pot for split " + split );


			availablePots.forEach( function( potData )
			{
				comparison			= {};
				comparison.potData	= potData;
				//comparison.diff		= Math.abs( potData.capacity - split );
				 
				if ( split > potData.capacity )
				{
					comparison.status	= MUST_REDUCE;
					comparison.diff		= split - potData.capacity;
				}
				else if ( split < potData.minimum )
				{
					comparison.status	= MUST_INCREASE;
					comparison.diff		= potData.minimum - split;
				}
				else
				{
					comparison.status 	= OK;
					comparison.diff		= potData.capacity - split;
				}
				
				checkingArr.push( comparison );
			});

			checkingArr.sort( Utils.PotSorter.sortPotsByBestFit );

			/*console.log( "best pot is :");
			console.log( checkingArr[0] );
			console.log( checkingArr[0].potData );*/

			return checkingArr[0].potData;
		}
	}
}());