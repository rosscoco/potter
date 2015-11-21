(function()
{
	module.exports = Tabs;

	function Tabs()
	{
		var _tabs = [];
		var _domElement;

		return { init: init };

		function init( withDom )
		{
			_domElement = withDom;

			_tabs = [].slice.call( _domElement.querySelectorAll('li'));

			_tabs.forEach( function( tab )
			{
				tab.addEventListener('click', function( evt )
				{
					onTabClicked( evt );		
				});
			});

			/*_domElement.addEventListener( 'click', function( evt )
			{
				console.log('click');
				if ( evt.target.id.split('_')[0] === 'tab')
				{
					onTabClicked( evt.target );	
				}
			});*/
		}

		function onTabClicked( evt )
		{
			_tabs.forEach( function( tab )
			{
				tab.className = '';
			});

			evt.currentTarget.className = 'tabActive';


		}

	}
}());