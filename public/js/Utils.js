function PotUtils()
{
    function countAvailableSpace( prev, next, index, array )
    {
        if ( next.contents === 0 )
        {
            return prev + next.capacity;
        }

        if ( next.minimum > next.contents ) 
        {
            prev += next.contents - next.minimum;
        }

        return prev;
    }

   function countRemainingSpace( prev, next, index, array )
    {
        return prev + next.capacity - next.contents;
    }

    function getAllPotIds( prev, next, index, array )
    {
        return prev + next.id;
    }

    function sortById( a, b )
    {
        return a.id - b.id;
    }

    function sortByAmountMoveable( a, b )
    {
        return ( b.capacity - b.minimum ) - ( a.capacity - a.minimum );
    }

    function sortByRemaining( a, b )
    {
        var aRemainder = a.reduce( countRemainingSpace, 0 );
        var bRemainder = b.reduce( countRemainingSpace, 0 );

        return aRemainder - bRemainder;
    }

    function checkForUniquePotCombos( allPotCombos )
    {
        var uniquePotCombos = [];
        var listOfPotCombos = {};

        allPotCombos.forEach ( function( potsToCheck )
        {
            potsToCheck.sort( sortById );
            
            var id = potsToCheck.reduce( getAllPotIds, '' );

            console.log( id );

            if ( listOfPotCombos[ id ] )
            {
                listOfPotCombos[ id ].push( potsToCheck );                    
            }
            else
            {
                listOfPotCombos[ id ] = [ potsToCheck ];                                    
                uniquePotCombos.push( potsToCheck );
            }    
        });

        return uniquePotCombos;
    }

    function getPotCombinations( fromList )
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
    }

    return {
        countAvailableSpace     : countAvailableSpace,
        countRemainingSpace     : countRemainingSpace,
        getAllPotIds            : getAllPotIds,
        sortById                : sortById,
        sortBySpace             : sortBySpace,
        sortByRemaining         : sortByRemaining,
        sortByAmountMoveable    : sortByAmountMoveable,
        checkForUniquePotCombos : checkForUniquePotCombos,
        getPotCombinations      : getPotCombinations
    };
}

var Utils = new PotUtils();
Utils.permute = function permute(list, ret)
            {
                if (list.length === 0) {
                    var row = document.createTextNode(ret.join(' '));
                    d.appendChild(row);
                    d.appendChild(document.createElement('br'));
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    var x = list.splice(i, 1);
                    ret.push(x);
                    perm(list, ret);
                    ret.pop();
                    list.splice(i, 0, x);
                }
            };
            

