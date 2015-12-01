(function(){

	var _allowedKeys 	= [ 8,9,13,27,35,38,45,46 ]; //backspace, delete, insert, home, end


	module.exports.checkValueInput 		= checkValueInput;
	module.exports.checkSplits 			= checkSplits;
	module.exports.isAllowedInput 		= isAllowedInput;
	module.exports.parseValueAndSplits 	= parseValueAndSplits;
	module.exports.parseSpaces 			= parseSpaces;

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

	function checkValueInput( value )
	{
		var _isValid 	= false;
		var _value 		= validate( value );

		return {
			isValidInput: isValidInput,
			type:"value",
			getInput: getInput };

		function validate( amount )
		{
			if ( isNaN( parseInt( amount ) ))
			{
				_isValid = false;
				return;
			}

			_isValid = true;

			return potifyNumber( amount );
		}

		function isValidInput()
		{
			return _isValid;
		}

		function getInput()
		{

			console.log("Gettign Value: " + _value);
			return _value;


		}
	}

	function checkSplits()
	{
		
	}

	function parseSpaces( inputValue )
	{	
		var amounts = removeSpaces( inputValue );

		amounts = amounts.map( function checkInput( value )
		{
			return checkValueInput( value );
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

	function parseValueAndSplits( inputValue )
	{
		var separated = inputValue.split("/");
		
		if ( separated.length > 2 )
		{
			return [];//this should not happen as we should be preventing a second / character being input.
		} 

		var total 	= separated[0];
		var splits 	= separated[1];

		var leftSide = parseSpaces( total );

		if ( leftSide.length > 1 )
		{
			return []; //Only allow a single input to the left of the / character
		}

		var rightSide = parseSpaces( splits  );

		return leftSide.concat( rightSide );
	}

	function potifyNumber( number )
	{
		var numberLength = String( Number( number ) ).length;

		if ( String( Number( number ) ).length >= 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
	}
}());