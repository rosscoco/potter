window.onload = function()
{
	var tabContainer = document.getElementById("tabContainer");
	//var tabContent = document.getElementById("tabsContent");

	var navItem = tabContainer.querySelector(".tabs ul li"); //returns FIRST item

	var ident = navItem.id.split('_')[1];

	navItem.parentNode.setAttribute("data-current", ident );

	//var navItem = container.querySelector(".tabs ul li");

	navItem.setAttribute("class", "tabActiveHeader");

	var pages = tabContainer.querySelectorAll(".tabPage");
	var pagesArray = [].slice.call(pages);

	pagesArray.forEach( function( item, index )
	{
		item.style.display = "none";
	});

	var tabs = tabContainer.querySelectorAll(".tabs ul li");
	var tabsArray = [].slice.call( tabs );

	tabsArray.forEach( function( item, index )
	{
		item.onclick = displayPage;
	});

	pagesArray[0].style.display = "block";


	function displayPage ()
	{
		var currentID = this.parentNode.getAttribute("data-current" );
		var currentTab = document.getElementById("tab_" + currentID );
		var currentPage = document.getElementById("tabPage_" + currentID );

		currentTab.removeAttribute("class");
		currentPage.style.display = "none";

		var thisID = this.id.split("_")[1];
		//var currentTab = document.getElementById("tabHeader_" + currentID );
		var thisPage = document.getElementById("tabPage_" + thisID );

		this.setAttribute("class", "tabActiveHeader");

		thisPage.style.display = "block";
		this.parentNode.setAttribute("data-current", thisID );
	}
};