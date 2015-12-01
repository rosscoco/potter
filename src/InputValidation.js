(function(){

	var _allowedKeys 	= [ 8,9,13,27,35,38,45,46 ]; //backspace, delete, insert, home, end

	module.exports.parseInput 		= parseInput;
	module.exports.isAllowedInput 	= isAllowedInput;

	/*module.exports.checkValueInput 		= checkValueInput;
	module.exports.checkSplits 			= checkSplits;
	module.exports.isAllowedInput 		= isAllowedInput;
	module.exports.parseValueAndSplits 	= parseValueAndSplits;
	module.exports.parseSpaces 			= parseSpaces;*/

	function isAllowedInput( inputEvt )
	{	
		var keyChar 		= String.fromCharCode( inputEvt.which );
		var allowedChars 	= "0123456789 /";

		var isSpecialKey = function( keyCode )
		{
			return keyCode === inputEvt.which;
		};

		//prevent second / character being input
		if ( inputEvt.target.value.indexOf('/') >= 0 )
		{
			allowedChars  = "0123456789 ";
		}

		return _allowedKeys.some( isSpecialKey ) || allowedChars.indexOf( keyChar ) !== -1;
	}

	function parseInput( inputValue )
	{
		var checker;

		if ( inputValue.indexOf('/') !== -1 )
		{	
			checker = parseValueAndSplits;
		}
		else if ( inputValue.indexOf(" ") !== -1 && inputValue.length > 2 )
		{
			checker =  parseSplits;
		}
		else
		{
			checker = parseValue;
		}

		return checker( inputValue );
	}



	function parseValue( value )
	{
		var _isValid 	= false;
		var _value 		= validate( value );

		return { 	isValid: _isValid,
					type: 	"total",
					amount:_value };

		function validate( amount )
		{
			if ( isNaN( parseInt( amount ) ))
			{
				_isValid = false;
				return 0;
			}

			_isValid = true;

			return potifyNumber( amount );
		}
	}

	function parseSplits( inputValue )
	{
		var data 		= {};
		data.pots 		= parseSpaces( inputValue );
		data.amount 	= 0;
		data.hasPotting	= data.pots.length > 0;

		data.pots = data.pots.map ( function( potSplit )
		{
			data.amount += potSplit.amount;
			return potSplit.amount;
		});

		return data;
	}

	function parseValueAndSplits( inputValue )
	{
		var separated 	= inputValue.split("/");
		var data 		= {};
		var total 		= separated[ 0 ];
		var splits 		= separated[ 1 ];

		//if multiple entries before / then only take the first one
		var leftSide 	= removeSpaces( total )[0];
		var rightSide 	= parseSplits( splits  );
		
		data.amount 	= leftSide.amount;
		data.potTotal 	= rightSide.amount;
		data.pots 		= rightSide.pots;
		data.hasPotting	= data.pots.length > 0;

		return data;
	}

	function parseSpaces( inputValue )
	{	
		var amounts = removeSpaces( inputValue );

		amounts = amounts.map( function checkInput( value )
		{
			return parseValue( value );
		});

		return amounts;
	}

	function removeSpaces( inputValue )
	{
		return inputValue.split(" ").filter( function notEmptyString( s )
		{
			return String( s ) !== '';
		});
	}

	function potifyNumber( number )
	{
		var numberLength = String( Number( number ) ).length;

		if ( String( Number( number ) ).length >= 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
	}
}());