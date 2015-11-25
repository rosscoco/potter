(function(){

	var SUCCESS 	= 1;
	var ERROR		= -1;
	var	WARN		= 0;

	var pottedProducts = {};

	module.exports = PottingResults;

	function PottingResults()
	{
		return {
			noPotsLeft: 		noPotsLeft,
			pottingSuccess: 	pottingSuccess,
			pottingFail: 		pottingFail, 
			pottedSomeProduct: 	pottedSomeProduct,
			overMaxWeight: 		overMaxWeight,
			isAlreadyPotted: 	isAlreadyPotted,
			clearResults: 		clearResults
		};
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

	function overMaxWeight( product, limitTo )
	{
		var data 			= {};
		data.product 		= product.id;
		data.pottingStatus 	= this.ERROR;
		data.message 		= product.amount + " of " + product.id + " is over max allowed weight. Reducing to " + limitTo;

		return data;
	}

	function noPotsLeft( product )
	{
		var data 			= {};
		data.product 		= product.id;
		data.pottingStatus 	= this.ERROR;
		data.message 		= "Could not pot " + product.amount + " of " + product.id + ". No Pots left on tanker";

		return data;
	}

	function pottingFail( product, pots )
	{
		var failedPot 		= pots[ pots.length - 1 ];
		var amountNeeded 	= failedPot.minimum - failedPot.contents;

		var data 			= {};
		data.product		= product.id;
		data.amount 		= product.amount;
		data.pottingStatus 	= this.ERROR;
		data.potsUsed		= pots.join('');
		data.message 		= "Could not pot " + product.amount + " of " + product.id;
		data.message 		+= "Need " + amountNeeded + "L in Pot " + failedPot.id;

		return data;
	}

	function pottingSuccess( product, pots )
	{
		/*var potsUsed = pots.reduce( function(id, pot )
		{
			return id + pot.id + " ";
		},'');*/

		var data 			= {};
		data.product		= product.id;
		data.amount 		= product.amount;
		data.pottingStatus 	= this.SUCCESS;
		data.potsUsed		= pots.join('');
		data.message 		= product.id + " successfully potted in pots " + data.potsUsed;

		return data;
	}

	function pottedSomeProduct( product, pots )
	{
		var potSummary 			= {};
		potSummary.potsUsed 	= '';
		potSummary.amountPotted = 0;

		var potsUsed = pots.reduce( function( data, pot )
		{
			data.potsUsed += pot.id;
			data.amountPotted += pot.contents;

			return data;

		}, potSummary );

		potSummary.remainingProduct = product.amount - potSummary.amountPotted; 

		var data 			= {};
		data.product		= product.id;
		data.pottingStatus 	= this.WARN;
		data.message 		= potSummary.remainingProduct + " of " + product.id + " put into pots " + potSummary.potsUsed;
		data.message 		+= ". " + potSummary.remainingProduct  + " could not be potted.";
		data.potSummary 	= potSummary;

		return data;
	}
}());	