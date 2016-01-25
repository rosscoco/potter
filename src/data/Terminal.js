(function()
{	
	"use strict";

            /*var basePots    = [   {id:1,capacity:7600, contents:0, product:"", minimum:7500},
                                    {id:2,capacity:7600, contents:0, product:"", minimum:6600},
                                    {id:3,capacity:7000, contents:0, product:"", minimum:3500},
                                    {id:4,capacity:7600, contents:0, product:"", minimum:3800},
                                    {id:5,capacity:6000, contents:0, product:"", minimum:3000},
                                    {id:6,capacity:7000, contents:0, product:"", minimum:6000}];*/

	module.exports = Terminal;

	Terminal.prototype.switchTanker = function ( tankerName )
	{		
		var activeTanker;

		this.tankers.forEach( function getTanker( tankerData )
		{
			if ( tankerName === tankerData.name )
			{
				activeTanker = tankerData;
			}
		});

		if ( !activeTanker )
		{
			activeTanker = this.tankers[0];
		}
		
		this.pots			= activeTanker.pots;
		this.maxWeight		= activeTanker.maxWeight;
	};

	Terminal.prototype.parseTankerData = function ( tankerData )
	{
		var dataObj			= {};
		dataObj.name		= tankerData.name;
		dataObj.maxWeight	= parseInt(tankerData.max_prod_weight);
		dataObj.pots		= this.parsePotData( tankerData.pots );

		return dataObj;
	};

	Terminal.prototype.parsePotData = function( potArray )
	{
		var pots = [];

		for ( var i = 0; i < potArray.length; i++ )
		{
			pots.push({	id:			i+1,
						capacity:	this.potifyNumber( potArray[i].max ),
						minimum:	this.potifyNumber( potArray[i].min ), 
						contents:	0,
						product:	'' });
		}

		return pots;
	};

	function Terminal( id, data )
	{
		this.name		= id;
		this.pots		= [];
		this.maxWeight	= 30000;
		this.tankers	= [];

		this.potIds		= '';
		this.productIds	= '';
		this.products	= [];

		for ( var i = 0; i < data.pot_configs.length; i++ )
		{
			this.tankers.push( this.parseTankerData( data.pot_configs[ i ] ));
		}

		for ( var product in data.products )
		{
			if ( data.products.hasOwnProperty(product))
			{
				this.products.push({id:product, name:data.products[product].name,density:data.products[product].density });
				this.productIds += product + " ";
			}
		}

		this.switchTanker();
		console.log("Terminal Created");

	}

	//Convert 3 to 3000, 69 to 6900 etc
	Terminal.prototype.potifyNumber = function( number )
	{
		if ( String( Number( number ) ).length === 4 ) return number;

		return Math.ceil( Number('.' + number ).toFixed(4) * 10000 );
	};

	Terminal.prototype.toString = function()
	{
		var s = "-------" + this.name +"-------\n";
		s+= "Pots: " + this.potIds + "\n";
		s+= "Products: " + this.productIds + "\n";
		
		return s;
	};


	Terminal.prototype.getProductData = function( forProduct )
	{
		for ( var i = 0; i < this.products.length;i++ )
		{
			if ( this.products[i].id === forProduct )
			{
				return this.products[ i ];
			}
		}
	};

	Terminal.prototype.getTankerCapacity = function()
	{
		var capacity = this.pots.reduce( function( amount, potData )
		{
			return amount + potData.capacity;
		},0);

		return capacity;
	};

	Terminal.prototype.getBalance = function( productToBalance, otherProducts )
	{
		var weight = 0;

		for ( var i = 0; i < otherProducts.length; i++ ) 
		{
			weight += this.getProductData( otherProducts[ i ].id ).density * otherProducts[ i ].amount;
		}

		var litresAvailable = Math.max( this.maxWeight - weight, 0 ) *  ( 1 / this.getProductData( productToBalance ).density );

		return {id:productToBalance, amount: litresAvailable };
	};

	//Checks the weight of an amount of product and will reduce it to a number of litres that is below the maximum weight.
	//If products have already been potted then this function will subtract the already potted weight from the maximum allowed weight first.
	Terminal.prototype.checkWeight = function( productToPot, alreadyPotted )
	{
		var currentWeight = 0;
		var maxWeight;
		var toPotDensity;
		var litresAvailable;

		if ( alreadyPotted )
		{	
			for ( var i = 0; i < alreadyPotted.length; i++ )
			{
				currentWeight += this.getProductData( alreadyPotted[ i ].product ).density * alreadyPotted[ i ].contents;
			}
		}

        toPotDensity = this.getProductData( productToPot.id ).density;

        if ( toPotDensity * productToPot.amount + currentWeight > this.maxWeight )
        {
            litresAvailable			= Math.max( this.maxWeight - currentWeight, 0 ) *  ( 1 / toPotDensity );
            productToPot.remainder	= productToPot.amount - litresAvailable;
            productToPot.amount		= litresAvailable;
        }

        return productToPot;
	};

}());