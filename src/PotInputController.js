(function()
{
	var inputValidator		= require('./InputValidation.js');

	module.exports = function PotInputController( usingDom, availableProducts )
	{
		var _domElement 	= usingDom;
		var _inputGroups	= [].slice.call( _domElement.querySelectorAll( "[id^='input']" ));
		var _products		= availableProducts;

		init( availableProducts );

		if ( _inputGroups.length === 0 )
		{
			console.log("PotInputController::No inputs");
		}

		return { 	init: init,
					updateProductList: updateProductList,
					showProductFeedback: showProductFeedback,
					clearFeedback: clearFeedback,
					updateInput:updateInput };

		function updateInput( withInfo )
		{
			var txtInput = _domElement.querySelector('#productInput_' + withInfo.id );

			if ( !txtInput )
			{
				console.error("Tried to update value of #productInput_" + withInfo.id + '. Does not exist.');
				return;
			}

			txtInput.value = parseInt( withInfo.amount );
		}

		function clearFeedback( onlyForProduct )
		{
			if ( onlyForProduct )
			{
				var inputGroup = _domElement.querySelector("#input_" + onlyForProduct );
				inputGroup.className = "form-horizontal productInputGroup";
				inputGroup.querySelector(".help-block").innerHTML = "";	
				return;
			}


			[].slice.call( _domElement.querySelectorAll("[id^='input']")).forEach( function( inputGroup )
			{
				inputGroup.className = "form-horizontal productInputGroup";
				inputGroup.querySelector(".help-block").innerHTML = "";
			});
		}

		function showProductFeedback( feedback )
		{
			var inputGroup = _domElement.querySelector("#input_" + feedback.product );
			var helperText = inputGroup.querySelector(".help-block");

			helperText.innerHTML = feedback.message;

			inputGroup.classList.add.apply( inputGroup.classList, feedback.classes );
		}

		function getEnteredProductAmounts( putLast )
        {
        	//the product just entered will be potted last
        	var lastProduct;

			var textInput;
			var parsedAmount;
			var value;

			var usedInputs = _inputGroups.filter( function removeZeroValues( inputGroup )
            {
            	var textInput = inputGroup.querySelector("[id^=productInput");
            	value = textInput.value;

            	return value !== '' && value !== 0;
            })
			.map( function extractValuesFromTextInputs( inputGroup ) 
            {
            	textInput 		= inputGroup.querySelector("[id^=productInput");
				parsedAmount 	= inputValidator.parseInput( textInput.value );
            	parsedAmount.id = textInput.getAttribute("id").split("_")[1];

            	return parsedAmount;
            });

            if ( putLast  )
            {
				usedInputs = usedInputs.filter( function removeSpecificProduct( inputValues )
                {
                	if ( inputValues.id === putLast )
                	{
                		lastProduct = inputValues;
                		return false;                		
                	} 

                	return true;
                });

                usedInputs.push( lastProduct );
            }
				
            return usedInputs;
        }

        function updateProductList( availableProducts )
        {
        	var usedProductIds = availableProducts.reduce( function getProductIds( list, nextProduct )
			{
				return list + ' ' + nextProduct.id;
			},'');

        	console.log("PotInputController:: checking inputs against " + usedProductIds );

        	_inputGroups.forEach( function hideUnusedProducts( inputGroup )
			{
				var forProduct 		= inputGroup.id.split('_')[1];
				var txtInput        = inputGroup.querySelector("[id^=productInput]");
				
				txtInput.onkeypress = function( evt )
				{
					return inputValidator.isAllowedInput( evt );
				};

            	txtInput.value      = "";

				if ( usedProductIds.indexOf( forProduct ) < 0 )
				{
					inputGroup.style.display = "none";
				}
				else
				{
					inputGroup.style.display = "block";
				}
			});
        }

		function init( availableProducts )
		{
			updateProductList( availableProducts );

			_inputGroups.forEach( function( inputGroup )
			{
				inputGroup.addEventListener("click", function( evt )
		            {
		            	var isFillBtn	= evt.target.id.split("_")[0] === "btnFill";
		            	var isClearBtn 	= evt.target.id.split("_")[0] === "btnClear";

		                if ( isFillBtn )
		                {	evt.stopPropagation();
		                	onFillTanker( this );	                    
		                	return;
		                }

		                if ( isClearBtn )
		                {
		                	evt.stopPropagation();
		                	onClearProduct( this );
		                	return;
		                }
		            });


				inputGroup.addEventListener("input", function( evt )
				{
					if ( evt.target.id.split("_")[0] === "productInput" )
					{
						evt.stopPropagation();
						onPotTanker( this );
					}
				});
			});
		}

		function onFillTanker( selectedInputGroup )
		{
			console.log("PotInputController::onFillTanker()");

			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = '';
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var otherProducts	= getEnteredProductAmounts();

            var detail			= { enteredProducts:otherProducts, productToFill:productToFill };

			var fillEvent 		= new CustomEvent("fillTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onPotTanker( selectedInputGroup )
		{
			console.log("PotInputController::onPotTanker()");

            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var productValue	= selectedInputGroup.querySelector("#productInput_" + productToFill ).value;
            
            if ( !productValue  )
            {
            	productToFill = undefined;
            }

            var enteredProducts	= getEnteredProductAmounts( productToFill );

            if ( enteredProducts.length === 0 ) return;

            var detail			= { enteredProducts : enteredProducts };

			var fillEvent 		= new CustomEvent( "potTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onClearProduct( selectedInputGroup )
		{
			console.log("PotInputController::onClearProduct()");
			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = "";

            clearFeedback( selectedInputGroup.id.split("_")[ 1 ]);

            var enteredProducts	= getEnteredProductAmounts();

            var evt;
            var detail = { enteredProducts : enteredProducts };

            if ( enteredProducts.length === 0 )
            {
            	evt = new CustomEvent("clearTanker");
            }
            else
            {
            	evt = new CustomEvent("potTanker", { detail:detail } );
            }

            _domElement.dispatchEvent( evt );
		}

		function potifyNumber( number )
		{
			var numberLength = String( Number( number ) ).length;

			if ( String( Number( number ) ).length >= 4 ) return number;

			return Math.ceil( Number('.' + number ).toFixed( 4 ) * 10000 );
		}
	};
}());