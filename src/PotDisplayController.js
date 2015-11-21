(function()
{
	module.exports = function PotDisplayController( _domElement )
	{
		var _potContents = {};	//cache of all .potContents elements
		var _displayNode = _domElement;

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

			//_displayNode = document.createElement('div');
			//_displayNode.id = "pottingDisplay";

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

				var container 		= document.createElement('div');
				var header 			= document.createElement('h1');
				var pot 			= document.createElement('div');
				var potContents 	= document.createElement('div');

				container.className = "potContainer";
				container.id 		= "pot" + ( i + 1 );

				header.innerHTML	= potData.capacity;

				pot.className 		= "pot";

				potContents.className = "potContents";
				potContents.setAttribute('data-product', 'none');
				_potContents[ '' + ( i + 1 ) ] = potContents;
				
				container.appendChild( header );
				container.appendChild( pot );
				pot.appendChild( potContents );

				_displayNode.appendChild( container );
			});

			return _displayNode;
			
			//intoDomNode.appendChild( potDisplay );
		} 

	    function updatePot( potData )
        {
        	console.log( "PotDisplayController::Filling " + potData.id + " with " + potData.contents + "/" + potData.capacity + " of " + potData.product );

            var potId = potData.id;

            //var potDisplay = document.getElementById( 'pot' + potData.id );
            
            var potContents = _potContents[ potData.id ];//potDisplay.querySelector(".potContents");

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
				//_displayNode.parentNode.removeChild( _displayNode );	
			}
		}

		function reset()
		{
			for ( var potId in _potContents )
			{
				if ( _potContents.hasOwnProperty( potId ))
				{	
					_potContents[ potId ].setAttribute('data-product','none');
					_potContents[ potId ].style.height = 0;
				}
			}
		}
	};

}());