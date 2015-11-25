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
			pottedProduct: 		pottedProduct,
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

	function isAlreadyPotted( product, usedPotIds )
	{
		if ( pottedProduct.hasOwnProperty( product.id ) )
		{
			var cachedResults = pottedProduct[ product.id ];
			if ( cachedResults.potsUsed === usedPotIds )
			{
				return cachedResults;
			}
		}

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

	function pottedProduct( product, pots )
	{
		var potsUsed = pots.reduce( function(id, pot )
		{
			return id + pot.id + " ";
		},'');

		var data 			= {};
		data.product		= product.id;
		data.pottingStatus 	= this.SUCCESS;
		data.potsUsed		= pots.join('');
		data.message 		= product.id + " successfully potted in pots " + potsUsed;
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
	}
}());	