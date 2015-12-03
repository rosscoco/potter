(function()
{
	PottingResult.prototype.SUCCESS = 0;
	PottingResult.prototype.ERROR 	= 1;
	PottingResult.prototype.WARN 	= 2;

	module.exports = PottingResult;

	function PottingResult( forProduct, pottingSetUsed, productLeftOver )
	{
		this.pottingUsed 	= pottingSetUsed;
		this.productDetails = forProduct;
		this.remainder 		= productLeftOver;
	}

	function updatePot( potId )
	{
		
	}
}());