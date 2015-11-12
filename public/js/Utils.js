var Utils = {};

Utils.getPotPermutations =  function getPotPermutations( fromList )
{
    var permArr     = [];
    var usedChars   = [];

    function permute( input ) 
    {
        var i, ch;

        for (i = 0; i < input.length; i++ ) 
        {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);

            if ( input.length === 0 ) 
            {
                permArr.push( JSON.parse( JSON.stringify( usedChars )));
            }

            permute( input );
            
            input.splice(i, 0, ch);
            usedChars.pop();
        }
        
        return permArr;
    }

    return permute( fromList );
};


var PotSorter = {

    sortPotsByAmountMoveable: function sortPotSetByAmountMoveable( aPot, bPot )
    {
        return ( bPot.capacity - bPot.minimum ) - ( aPot.capacity - aPot.minimum );
    },

    sortPotsById: function sortPotSetById( a, b )
    {        
        return a.id - b.id;
    },

    sortPotSetsByRemainder: function sortPotSetsByRemainder( aPottingList, bPottingList  )
    {   
        return aPottingList.getRemainingSpace() - bPottingList.getRemainingSpace();
    }
};

function PottingController( listOfPots )
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

    return [];
}

function PottingSetList( withListOfPots )
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
}

function PottingSet( fromPotArr )
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
            fillLastPot();
        }
    }

    function checkPotCapacityAgainstContents( isWithinRules, potData )
    {
        return isWithinRules && potData.capacity > potData.minimum;
    }

    function fillSinglePot( withProduct, pot )
    {
        console.log("Filling Pot " + pot.id + " with " + withProduct.amount + " of " + withProduct.id );
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
        var usedPots = []

        _availablePots.forEach( function( nextPot )
        {
            if ( product.amount > 0 ) 
            {
                fillSinglePot( product, nextPot );
                usedPots.push( nextPot );
            }
            

        });

        _availablePots = usedPots;
        console.log( _availablePots );

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
}


