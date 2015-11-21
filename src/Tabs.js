(function()
{
	module.exports = Tabs;

	function Tabs( domNode )
	{
		var _tabs = [];
		var _domElement;

		init( domNode );

		//return { init: init };

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
		}

		function onTabClicked( evt )
		{
			_tabs.forEach( function( tab )
			{
				tab.className = '';
			});

			evt.currentTarget.className = 'tabActive';
			var terminal = evt.currentTarget.id.split("_")[1];

			var changeEvent = new CustomEvent("onChangeTerminal",{detail:terminal});

			_domElement.dispatchEvent( changeEvent );
		}
	}
}());