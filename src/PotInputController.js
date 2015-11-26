(function()
{
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

		function getEnteredProductAmounts( putLast )
        {
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

            //if ( lastProduct ) selectedProducts.push( lastProduct );
            if ( lastProduct ) selectedProducts.unshift( lastProduct );

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
            	txtInput.value      = 0;

				if ( usedProductIds.indexOf( forProduct ) < 0 )
				{
					console.log("Hiding " + forProduct );
					inputGroup.style.display = "none";
				}
				else
				{
					console.log("Showing " + forProduct );
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
            txtInput.value      = 0;
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var otherProducts	= getEnteredProductAmounts();

            var detail			= { enteredProducts:otherProducts, productToFill:productToFill };

			var fillEvent 		= new CustomEvent("fillTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onPotTanker( selectedInputGroup )
		{
			console.log("PotInputController::onPotTanker()");

			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            var productToFill   = selectedInputGroup.id.split( "_" )[ 1 ];
            var enteredProducts	= getEnteredProductAmounts( productToFill );

            if ( txtInput.value < 1000 ) return;

            console.log("After Sort:" + enteredProducts );

            var detail			= { enteredProducts : enteredProducts };

			var fillEvent 		= new CustomEvent( "potTanker",{ detail:detail });

            _domElement.dispatchEvent( fillEvent );
		}

		function onClearProduct( selectedInputGroup )
		{
			console.log("PotInputController::onClearProduct()");
			var txtInput        = selectedInputGroup.querySelector("[id^=productInput]");
            txtInput.value      = 0;

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