/* globals PottingSetList:false, PottingController:false 
# sourceMappingURL=./app.js.map
*/
(function()
{   
            var PottingData             = require('./PottingData.js');
            var ViewController          = require("./ViewController.js");
            
            var data;
            var view;

            window.onload   = function()
            {
                data                = new PottingData();
                view                = new ViewController( document.querySelector(".content") );

                data.loadProductData( onProductDataLoaded );
                
                document.querySelector("#productInputs").addEventListener("fillTanker", onBalanceTankerSelected );
                document.querySelector("#productInputs").addEventListener("potTanker", onPotTankerSelected );                
                document.querySelector(".tabs").addEventListener("onChangeTerminal", onChangeTerminal );
                document.querySelector("#pottingContainer").addEventListener("swapPots", onSwapPotContents );
            };

            function onChangeTerminal( evt )
            {
                console.log("Changing terminal to " + evt.detail );

                var newTerminal = data.changeTerminal( evt.detail );
                    
                view.updateTerminal( newTerminal.pots, newTerminal.products );
            }

            function onProductDataLoaded( )
            {
                console.log("Product Data Loaded!!");
                var currentTerminal = data.changeTerminal("bramhall");

                view.init( currentTerminal.pots, currentTerminal.products );
            }

            function onSwapPotContents( evt )
            {
                var newPotting = data.movePots( evt.detail.pot1, evt.detail.pot2 );
                view.showResults( newPotting );
            }

            function onPottingChanged(pots)
            {
                /*I want to respond to potting changing manually, without invoking the potting controller
                    -accept a list of potting results
                        PottingSet
                        Product
                */
            }

             //Filling all pots with single product. Invoked when Fill Balance is selected with no other product values entered.
            function onBalanceTankerSelected( evt )
            {
                var results = data.balanceTanker( evt.detail.productToFill ,evt.detail.enteredProducts );
                
                view.showResults( results );

                view.updateProductInputs( data.getProductTotals() );
            }


            function onPotTankerSelected( evt )
            {
                var forProducts     = evt.detail.enteredProducts;
                var results         = [];
                var potList         = data.getPotting( forProducts );

                view.showResults( potList );
            }
}());            