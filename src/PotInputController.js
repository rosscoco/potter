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
				inputGroup.className = "form-group productInputGroup";
				inputGroup.querySelector(".help-block").innerHTML = "";	
				return;
			}


			[].slice.call( _domElement.querySelectorAll("[id^='input']")).forEach( function( inputGroup )
			{
				inputGroup.className = "form-group productInputGroup";
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

        	var selectedProducts = _inputGroups.map( function getProductAmounts( inputGroup ) 
                {
					var amount = inputGroup.querySelector("[id^=productInput").value;

                	//if ( amount < 1000 ) amount = potifyNumber( amount );

                    return {    id      :inputGroup.getAttribute("id").split("_")[1], 
                                amount  :potifyNumber( amount ) };
                })

                .filter( function removeZeroValues( inputValues )
                {
                    if ( inputValues.amount > 0 ) return true;
                    //if ( isValidInput( amount )) return true;
                })
                .filter( function removeSpecificProduct( inputValues )
                {
                	if ( inputValues.id === putLast )
                	{
                		lastProduct = inputValues;
                		return false;                		
                	} 

                	return true;
                });

            if ( lastProduct ) selectedProducts.push( lastProduct );
            //if ( lastProduct ) selectedProducts.unshift( lastProduct );

            return selectedProducts;
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
						onParseProductInput( this );
					}
				});
			});
		}

		



		function onFillTanker( selectedInputGroup )
		{
			console.log("PotInputController::onFillTanker()");

			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = 0;
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var otherProducts	= getEnteredProductAmounts();

            var detail			= { enteredProducts:otherProducts, productToFill:productToFill };

			var fillEvent 		= new CustomEvent("fillTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		//return an array of valid inputs to account for pots being defined.
		function isValidInput( txtInput )
		{
			var withSpaces = txtInput.split(" ");

			if ( withSpaces.length !== 0 )
			{
				var allAreNumbers = withSpaces.every( function( isNumber )
				{
					return isNaN( isNumber );
				});

				if ( !allAreNumbers )
				{
					return false;
				} 	
				else
				{
					return withSpaces;
				} 	
			}

			if ( isNaN( parseInt( txtInput )) || txtInput < 1000 )
			{
				return false;
			}
			
			return [ parseInt( txtInput )];
			
		}

		function onParseProductInput( selectedInputGroup )
		{
			var inputCheckers 	= [];
			var amountInput;
			var pottingInput;
			var inputValue      = selectedInputGroup.querySelector("[id^=productInput]").value;

			console.log( new Array(24).join("\n"));

			if ( inputValue.indexOf('/') !== -1 )
			{	
				inputCheckers = inputValidator.parseValueAndSplits( inputValue );
			}
			else if ( inputValue.indexOf(" ") !== -1 )
			{
				inputCheckers = inputValidator.parseSpaces( inputValue );
			}
			else
			{
				inputCheckers = [ inputValidator.checkValueInput( inputValue ) ];
			}

			var validInputs = inputCheckers.filter( function( inputChecker )
			{
				console.log( "Checking Input: ", inputChecker.type, inputChecker.getInput(), inputChecker.isValidInput());

				return inputChecker.isValidInput();
			});


			
            //var isValid 		= isValidInput( txtInput.value );

            //if ( txtInput.value < 1000 ) return;

			if ( validInputs.length > 0 )
			{
				//onPotTanker( validInputs  );	
			}
		}

		function onPotTanker( selectedInputGroup )
		{
			console.log("PotInputController::onPotTanker()");

			

            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var enteredProducts	= getEnteredProductAmounts( productToFill );

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