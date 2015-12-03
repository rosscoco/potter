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
			if ( pottingResult.pottingUsed.getPotArray().length === 0 )
			{
				response = noPotsLeft;
			}
			else
			{
				response = pottingFail;	
			}
		}

		return getMessage( pottingResult, response );
	}

	function isAlreadyPotted( product, availablePots )
	{
		return false;
	}

	function getMessage( pottingResult, messageFunction )
	{
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