
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

function PottingSetList( withListOfPots )
{
   var _listOfPottingSets = withListOfPots.map( function( potArray ) 
    {
        return new PottingSet( potArray );
    });

    return {
        sortByRemainder         : sortByRemainder,
        getBestPottingSet       : getBestPottingSet,
        removeDuplicates        : removeDuplicates,
        sendToPottingSets       : sendToPottingSets,
        removeInvalid           : removeInvalid,
        get used() { return _listOfPottingSets.length; },
        debug                    : debug
    };

    function debug()
    {
        sortByRemainder();

        _listOfPottingSets.forEach( function( pottingSet )
        {
            console.log( pottingSet.getUsedPotsById() + ': ' + pottingSet.getRemainingSpace() );
        });
    }

    function sortByRemainder()
    {   
        _listOfPottingSets.sort( function( aPottingList, bPottingList )
        {
            return aPottingList.getRemainingSpace() - bPottingList.getRemainingSpace();
        });
    }

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

    function sendToPottingSets( product, potCombinations )
    {
        _listOfPottingSets.forEach( function( pottingSet )
        {  
            pottingSet.potProduct( product );
        });
    }

    function removeInvalid()
    {
        _listOfPottingSets = _listOfPottingSets.filter( function( pottingSet )
        {
            return pottingSet.checkRules();
        });
    }

    function getBestPottingSet()
    {
        sortByRemainder();
        return _listOfPottingSets[0];
    }
}

function PottingSet( fromPotArr )
{
    var _availablePots = fromPotArr;

    return {
        potProduct      : potProduct,
        getUsedPotsById : getUsedPotsById,
        checkRules      : checkRules,
        getRemainingSpace : getRemainingSpace,
        get data() { return _availablePots.slice(); }
    };

    function potProduct( product )
    {
        var amount = product.amount;

        for ( var i = 0; i < _availablePots.length; i++ )
        {
            _availablePots[ i ].product = product.id;

            if ( amount - _availablePots[ i ].capacity > 0 )
            {
                _availablePots[ i ].contents = _availablePots[ i ].capacity;   
            }
            else
            {
                _availablePots[ i ].contents = amount;
            }

            amount = Math.max( 0, amount - _availablePots[ i ].capacity );

            if ( amount === 0 ) 
            {
                _availablePots.splice( i + 1  );                       
                return;
            }
        }
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
        _availablePots.sort( sortById );

        return _availablePots.reduce( function( idList , nextPot  )
        {
            //return idList + nextPot.getId();
            return idList + nextPot.id;
        }, '');
    }

    function sortByAmountMoveable( aPot, bPot )
    {
        //return ( bPot.getCapacity() - bPot.getMinimum ) - ( aPot.getCapacity() - aPot.getMinimum() );
        return ( bPot.capacity - bPot.minimum ) - ( aPot.capacity - aPot.minimum );
    }

    function sortById( a, b )
    {
        //return a.getId() - b.getId();
        return a.id - b.id;
    }

    function checkRules( potCombination )
    {
        //last pot in list is always the pot with least in it
        var lastPot = _availablePots[ _availablePots.length - 1 ];

        if ( lastPot.contents < lastPot.minimum )
        {
            //count how much product is over each pots minimum amount.
            var available = _availablePots.slice(0,-1).reduce( function( prev, next )
            {
                return prev + ( next.contents - next.minimum );
            }, 0);

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
        else
        {
            return true;
        }
    }

    function fillLastPot( lastPot, remainingPots )
    {
        var needed = lastPot.minimum - lastPot.contents;
        var amountMoved;
        var helperPot;

        remainingPots.sort( sortByAmountMoveable );

        for ( var i = 0; i < remainingPots.length; i++ )
        {
        
            helperPot = remainingPots[i];

            if ( helperPot.contents - needed > helperPot.minimum )
            {
                amountMoved = helperPot.contents - ( helperPot.contents - needed );
            } 
            else
            {
                amountMoved = helperPot.contents - ( helperPot.contents - helperPot.minimum );
            }

            needed              -= amountMoved;
            helperPot.contents  -= amountMoved;
            lastPot.contents    += amountMoved;

            if ( lastPot.contents >= lastPot.minimum )
                break;
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
            

