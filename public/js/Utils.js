
/*function Pot()
{
    var _id, 
        _capacity,
        _contents,
        _product,
        _minimum;
    
    return {
        getId       : function capacity()     { return _id;         },
        getCapacity : function capacity()     { return _capacity;   },
        getProduct  : function product()      { return _product;    },
        getContents : function contents()     { return _contents;   },
        getMinimum  : function minimum()      { return _minimum;    },
        getAvailable: function available()    { return _capacity - _content; }
    };
}*/

var PotSorter = {

    sortPotsByAmountNeeded: function sortPotsByAmountNeeded( aPot, bPot )
    {
        if ( aPot.contents )
    }

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
}

function PotRuleChecker( pots )
{

}

function PottingController( listOfPots )
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

            var potCombinations = 


             

            usedPottingSet = getBestPotsForProduct( _activePots, _products[ i ] );

            //usedPots = doPotting( _activePots, _products[ i ]);

            pottingUsed.push( usedPottingSet );

            //remove the pots used in the last product potting before we try and pot the next product
            _activePots = _activePots.reduce( function reduceToUnusedPots( potCheckingData, nextPotToCheck )
                {
                    if ( potCheckingData.usedPots.getUsedPotsById().indexOf( nextPotToCheck.id ) < 0 )
                    {
                        potCheckingData.unusedPots.push( nextPotToCheck );
                    }

                 return potCheckingData; },  ).unusedPots;
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
                    invalidPottingSets.push( pottingSet ));
                    return;
                }

                //validPottingSets.push( pott`ingSet.data );
                validPottingSets.push( pottingSet );
            });
        });

        var fixablePottingSets = invalidPottingSets.filter( 
        {
            for ( var i = 0; i < pottingSet.data.length; )
        });

        {
            var potToFix;
            potArray.sort( PotSorter.sortPotsBy)
            
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
            })    

            var productToMove = potArray.reduce( function( count, nextPot )
            {
               //return count + nextPot.getCapacity() - nextPot.getContents();
               return count + nextPot.capacity - nextPot.contents;
            }, 0);
            
        });



        //allPottingSets.removeDuplicates();
        //allPottingSets.removeInvalid();

        //allPottingSets.debug();
        


        var bestPottingSet = allPottingSets.getBestPottingSet();



        console.log("Best Potting Set: ");
        


        //console.table( bestPottingSet.data );
        
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
        sendProductToPottingSets    : sendProductToPottingSets
    };

    function removeDuplicates()
    {
        var uniquePotCombos = [];
        var listOfPotCombos = {};

        _listOfPottingSets.forEach ( function( pottingSet )
        {
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
            pottingSet.putProductIntoPots( product );
        });

        removeDuplicates();
        removeInvalid();

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
            else if ( pottingSet)
            else
            {
                return pottingSet.checkRules(); 
            }            
        });
    }

    function getBestPottingSet()
    {
        _listOfPottingSets.sort( PotSorters.sortPotSetsByRemainder );
        return _listOfPottingSets[ 0 ];
    }
}

function ProductMover( pottingSet )
{

}

function PottingSet( fromPotArr )
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

        }, true )

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

        },[])

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
        var mustBeGreaterThan = checkAgainst 

        return function( amountToCheck )
        {
            return amountToCheck > checkAgainst;
        }
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
                amountToMove = helperPot.contents  - helperPot.minimum
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
            

