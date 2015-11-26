(function()
{
	module.exports = function PotDisplayController( domElement )
	{
		var _potContents 	= {};	//cache of all .potContents elements
		var _container		= domElement;
		var _displayNode;// 	= domElement;

		var alreadyCreated = document.querySelectorAll("#pottingDisplay").length !==0;

		if ( alreadyCreated )
		{
			//do stuff...
			//return false;
		}

		//init();

		return {
			init		: init,
			updatePot	: updatePot,
			reset		: reset,
			clear		: clear 
		};	

		function init( allPotData )
		{
			//clear();

			_displayNode = document.createElement('div');
			_displayNode.className = "pottingDisplay";

			var lastnode;
			allPotData.forEach( function( potData, i )
			{
				/*
				<div class="potContainer" id="pot1">
	                <h1>7600</h1>
	                <div class="pot">
	                    <div class="potContents"></div>
	                </div>    
	            </div>
	            */

	            /*
				<div class="potContainer" id="pot1">
	                <h1>7600</h1>
	                <div class="pot">
	                    <div class="potContents"></div>
	                </div> 
	                <h1>7600</h1>   
	            </div>
	            */

				var container 		= document.createElement('div');
				var txtContents 	= document.createElement('h2');
				var pot 			= document.createElement('div');
				var potContents 	= document.createElement('div');
				var txtCapacity 	= document.createElement('h2');

				container.className = "potContainer";
				container.id 		= "pot" + ( i + 1 );

				txtContents.innerHTML = 0;
				txtCapacity.innerHTML = potData.capacity;


				txtContents.className = 'potText';
				txtCapacity.className = 'potText';

				pot.className 		= "pot";

				potContents.className = "potContents";
				potContents.setAttribute('data-product', 'none');

				_potContents[ '' + ( i + 1 ) ] = { pot:potContents, text:txtContents };
				
				container.appendChild( txtContents );
				container.appendChild( pot );
				pot.appendChild( potContents );
				container.appendChild( txtCapacity );

				_displayNode.appendChild( container );
			});

			insertSpacesBetweenPots();

			_container.appendChild( _displayNode );

			return _displayNode;
		} 


		function insertSpacesBetweenPots()
		{
			var pots = [].slice.call(_displayNode.children);

			var l = pots.length;

			for ( var i = 1; i  < l; i++ )
			{
				var space = document.createElement( "span" );
				space.innerHTML = ' ';
				_displayNode.insertBefore( space, pots[i]);
			}
		}

	    function updatePot( potData )
        {
        	console.log( "PotDisplayController::Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

            var potContents = _potContents[ potData.id ].pot;
            var potTextContents = _potContents[ potData.id ].text;

            potTextContents.innerHTML = parseInt(potData.contents);

            if ( potData.contents < potData.minimum )
            {
				potTextContents.className += " warningText";
            }

            potContents.setAttribute( "data-product", potData.product );

            potContents.style.height = Math.round( potData.contents / potData.capacity * 100 ) + "%";
        }

		function update( withProductData )
		{

		}	

		function clear()
		{
			_potContents = [];

			if ( _displayNode )
			{
				while( _displayNode.firstChild )
				{
					_displayNode.removeChild( _displayNode.firstChild );
				}

				_displayNode.parentNode.removeChild( _displayNode );
				_displayNode = undefined;
			}
		}

		function reset()
		{
			for ( var potId in _potContents )
			{
				if ( _potContents.hasOwnProperty( potId ))
				{	
					_potContents[ potId ].pot.setAttribute('data-product','none');
					_potContents[ potId ].pot.style.height = 0;

					_potContents[ potId ].text.innerHTML = 0;
					_potContents[ potId ].className = "potText";
				}
			}
		}
	};

}());