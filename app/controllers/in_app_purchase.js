var storekit = require('ti.storekit');

var transactionStateChanged = function(evt) {
	console.log("transactionStateChanged");
    switch (evt.state) {
        case storekit.TRANSACTION_STATE_FAILED:
            if (evt.cancelled) {
                alert('Purchase cancelled');
            } else {
                alert(evt.message); 
            }
   
            evt.transaction && evt.transaction.finish();
            break;
        case storekit.TRANSACTION_STATE_PURCHASED:
            if(storekit.validateReceipt()) {
                Ti.API.info(JSON.stringify(evt.receipt.toString()));
                alert('Purchase completed!');
            }
  
            evt.transaction && evt.transaction.finish();
            break;
    }
    console.log("transactionStateChanged");
};

function init() {
	console.log('init');
    storekit.receiptVerificationSandbox = Ti.App.deployType !== 'production';
    storekit.bundleVersion = '1.0';
    storekit.bundleIdentifier = 'com.geonn.pandoapp';
    console.log('init');
    storekit.addEventListener('transactionState', transactionStateChanged);
    console.log('init');
    storekit.addTransactionObserver();
    console.log('init');
}
// Never forget to remove the transaction observer
// and your event listeners, otherwise you might cause memory leaks and unwanted problems
// Assigned to the close event of my Window element (see XML)
function cleanUp() { 
	console.log("cleanUp");
    storekit.removeTransactionObserver();console.log("cleanUp");
    storekit.removeEventListener('transactionState', transactionStateChanged);console.log("cleanUp");
    storekit = null;
}

init();

function requestProduct() {
	console.log("requestProduct");
    storekit.requestProducts(['premium_account_tier_1'], function (evt) {
    	console.log("requestProduct");
        if (!evt.success) {
            alert('Sorry, the App Store seems to be down right now. Please try again soon.');
        } else if (evt.invalid) {
            alert('Invalid product.');
        } else {
            purchaseProduct(evt.products[0]);
        }
    });
}

function purchaseProduct(product) {
	console.log("purchaseProduct");
    storekit.purchase({product: product});
    console.log("purchaseProduct");
};

requestProduct();