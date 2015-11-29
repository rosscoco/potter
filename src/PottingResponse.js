(function(){

	var cPottingResult 	= require("./data/PottingResult.js");
	var PottingResult 	= new cPottingResult();
	var pottedProducts 	= {};

	module.exports = PottingResponse;

	function PottingResponse()
	{
		return {
			getPottingResponse: getPottingResponse
		};

		/*return {
			noPotsLeft: 		noPotsLeft,
			pottingSuccess: 	pottingSuccess,
			pottingFail: 		pottingFail, 
			pottedSomeProduct: 	pottedSomeProduct,
			overMaxWeight: 		overMaxWeight,
			isAlreadyPotted: 	isAlreadyPotted,
			clearResults: 		clearResults
		};*/
	}

	function getPottingResponse( pottingResult )
	{
		var response;
		
		if ( pottingResult.pottingUsed.isValid() )
		{
			//if ( forProduct.remainder > 0 || result.remainder > 0 )
			if ( pottingResult.productDetails.remainder > 0  )
			{
				response = pottingOverWeight;
			}
			else if ( pottingResult.pottingUsed.remainder ) 
			{
				response = pottedSomeProduct;
			}
			else
			{
				response = pottingSuccess;
			}
		}
		else
		{
			response = pottingFail;
		}

		return getMessage( pottingResult, response );
	}


	function clearResults()
	{
		pottedProducts = {};
	}

	function getPottedProducts()
	{
		return;
	}

	function isAlreadyPotted( product, availablePots )
	{

		/*
		if ( pottedProduct.hasOwnProperty( product.id ) )
		{
			var cachedResults = pottedProduct[ product.id ];

			if ( product.amount !== cachedResults.amount )
			{
				delete cachedResults[ product.id ];
				return false;
			}

			var potsNeeded	= cachedResults.potsUsed.length;
			var foundPots	= 0;

			availablePots.forEach( function( potDetails )
			{
				if ( potsNeeded.indexOf( potDetails.id ) !== -1 )
				{
					foundPots++ ;
				};
			});

			if ( cachedResults.potsUsed !== usedPotIds )
			{
				delete cachedResults[ product.id ];
				return false;				
			}

			return cachedResults;
		}
		*/
		return false;
	}

	function getMessage( pottingResult, messageFunction )
	{
		/*var product 		= pottingResult.productDetails;
		var potsUsed 		= pottingResult.pottingUsed.getPotArray();
		var potIds 			= pottingResult.pottingUsed.getUsedPotsById();*/
		
		var data 			= {};

		data.product 		= pottingResult.productDetails.id;
		data.potsUsed 		= pottingResult.pottingUsed.getPotArray();
		data.potIds 		= pottingResult.pottingUsed.getUsedPotsById();
		data.amountPotted	= parseInt( pottingResult.productDetails.amount );

		return messageFunction( data, pottingResult );
	}

	function pottingOverWeight( messageData, pottingResult )
	{
		var amountNeeded 	= pottingResult.productDetails.amount + pottingResult.productDetails.remainder;
		messageData.pottingStatus 	= PottingResult.WARN;
		messageData.message 		= amountNeeded + " of " + messageData.product + " is over max weight. Reduced by " + pottingResult.productDetails.remainder + " to " + messageData.amountPotted + "L total.";

		return messageData;
	}


	function noPotsLeft( messageData )
	{
		messageData.pottingStatus 	= PottingResult.ERROR;
		messageData.message 		= "Could not pot " + messageData.amountPotted + " of " + messageData.product + ". No Pots left on tanker";

		return messageData;
	}

	function pottingFail( messageData, pottingResult )
	{
		var pots 			= messageData.potsUsed;
		var failedPot 		= pots[ pots.length - 1 ];
		var amountNeeded 	= failedPot.minimum - failedPot.contents;		

		messageData.pottingStatus 	= PottingResult.ERROR;
		
		messageData.message 		= "Could not pot " + messageData.amountPotted + " of " + messageData.product;
		messageData.message 		+= "Need " + amountNeeded + "L more in Pot " + failedPot.id;

		return messageData;
	}

	function pottingSuccess( messageData, pottingResult )
	{
		messageData.pottingStatus 	= PottingResult.SUCCESS;
		
		messageData.message 		= messageData.amountPotted + "L of " + messageData.product + " successfully potted in pots " + messageData.potIds +".";

		return messageData;
	}

	function pottedSomeProduct( messageData, pottingResult  )
	{
		messageData.pottingStatus 	= PottingResult.WARN;
		messageData.message 		= messageData.amountPotted + " of " + messageData.product + " put into pots " + messageData.potIds;
		messageData.message 		+= ". " + pottingResult.remainder  + " could not be potted.";

		return messageData;
	}
}());	