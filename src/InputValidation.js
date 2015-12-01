(function(){

	var _allowedKeys 	= [ 8,9,13,27,35,38,45,46 ]; //backspace, delete, insert, home, end
	var _allowedChars 	= "0123456789 /";

	module.exports.checkValueInput 		= checkValueInput;
	module.exports.checkSplits 			= checkSplits;
	module.exports.isAllowedInput 		= isAllowedInput;
	module.exports.parseValueAndSplits 	= parseValueAndSplits;
	module.exports.parseSpaces 			= parseSpaces;

	function isAllowedInput( inputEvt )
	{	
		var keyChar 		= String.fromCharCode( inputEvt.which );
		
		var isSpecialKey = function( keyCode )
		{
			return keyCode === inputEvt.which;
		};

		console.log( inputEvt.target.value );

		return _allowedKeys.some( isSpecialKey ) || _allowedChars.indexOf( keyChar ) !== -1;
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
		var amounts = inputValue.split(" ").filter( function notEmptyString( s )
		{
			return String( s ) !== '';
		});

		amounts = amounts.map( function checkInput( value )
		{
			return checkValueInput( value );
		});

		return amounts;
	}

	function parseValueAndSplits( inputValue )
	{
		var separated = inputValue.split("/");
		if ( separated.length > 2 )
		{
			return [];//
		} 

		var leftSide = inputValue.split("/");

	}

	function potifyNumber( number )
	{
		var numberLength = String( Number( number ) ).length;

		if ( String( Number( number ) ).length >= 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
	}
}());