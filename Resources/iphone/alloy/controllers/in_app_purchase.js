function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function showLoading() {
        loadingCount += 1;
        1 == loadingCount && loading.show();
    }
    function hideLoading() {
        if (loadingCount > 0) {
            loadingCount -= 1;
            0 == loadingCount && loading.hide();
        }
    }
    function isIOS7Plus() {
        var version = Titanium.Platform.version.split(".");
        var major = parseInt(version[0], 10);
        if (major >= 7) return true;
        return false;
    }
    function markProductAsPurchased(identifier) {
        Ti.API.info("Marking as purchased: " + identifier);
        tempPurchasedStore[identifier] = true;
        Ti.App.Properties.setBool("Purchased-" + identifier, true);
    }
    function checkIfProductPurchased(identifier) {
        Ti.API.info("Checking if purchased: " + identifier);
        void 0 === tempPurchasedStore[identifier] && (tempPurchasedStore[identifier] = Ti.App.Properties.getBool("Purchased-" + identifier, false));
        return tempPurchasedStore[identifier];
    }
    function requestProduct(identifier, success) {
        showLoading();
        Storekit.requestProducts([ identifier ], function(evt) {
            hideLoading();
            evt.success ? evt.invalid ? alert("ERROR: We requested an invalid product!") : success(evt.products[0]) : alert("ERROR: We failed to talk to Apple!");
        });
    }
    function purchaseProduct(product) {
        product.downloadable && Ti.API.info("Purchasing a product that is downloadable");
        showLoading();
        Storekit.purchase({
            product: product
        });
    }
    function restorePurchases() {
        showLoading();
        Storekit.restoreCompletedTransactions();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "in_app_purchase";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        {
            __processArg(arguments[0], "__parentSymbol");
        }
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.win = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundImage: "/images/transparent-background.png",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId38 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        borderRadius: 4,
        width: "80%",
        id: "__alloyId38"
    });
    $.__views.win.add($.__views.__alloyId38);
    $.__views.__alloyId39 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        text: "Get Premium Account",
        id: "__alloyId39"
    });
    $.__views.__alloyId38.add($.__views.__alloyId39);
    var __alloyId41 = [];
    $.__views.__alloyId42 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId42"
    });
    __alloyId41.push($.__views.__alloyId42);
    $.__views.__alloyId43 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId43"
    });
    $.__views.__alloyId42.add($.__views.__alloyId43);
    $.__views.__alloyId44 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId44"
    });
    $.__views.__alloyId42.add($.__views.__alloyId44);
    $.__views.__alloyId45 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId45"
    });
    __alloyId41.push($.__views.__alloyId45);
    $.__views.__alloyId46 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId46"
    });
    $.__views.__alloyId45.add($.__views.__alloyId46);
    $.__views.__alloyId47 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId47"
    });
    $.__views.__alloyId45.add($.__views.__alloyId47);
    $.__views.__alloyId48 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId48"
    });
    __alloyId41.push($.__views.__alloyId48);
    $.__views.__alloyId49 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId49"
    });
    $.__views.__alloyId48.add($.__views.__alloyId49);
    $.__views.__alloyId50 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId50"
    });
    $.__views.__alloyId48.add($.__views.__alloyId50);
    $.__views.__alloyId40 = Ti.UI.createScrollableView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        views: __alloyId41,
        showPagingControl: "true",
        pagingControlColor: "transparent",
        id: "__alloyId40"
    });
    $.__views.__alloyId38.add($.__views.__alloyId40);
    $.__views.__alloyId51 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$0.99 FOR ONE MONTH",
        backgroundColor: "#75d0cb",
        height: "40",
        id: "__alloyId51"
    });
    $.__views.__alloyId38.add($.__views.__alloyId51);
    $.__views.__alloyId52 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$1.99 FOR ONE YEAR",
        backgroundColor: "#7fdcd7",
        height: "40",
        id: "__alloyId52"
    });
    $.__views.__alloyId38.add($.__views.__alloyId52);
    $.__views.__alloyId53 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "NOT NOW",
        backgroundColor: "#c2e8e6",
        height: "40",
        id: "__alloyId53"
    });
    $.__views.__alloyId38.add($.__views.__alloyId53);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var Storekit = require("ti.storekit");
    Storekit.receiptVerificationSandbox = "production" !== Ti.App.deployType;
    Storekit.receiptVerificationSharedSecret = "<YOUR STOREKIT SHARED SECRET HERE>";
    Storekit.autoFinishTransactions = false;
    Storekit.bundleVersion = "1.0";
    Storekit.bundleIdentifier = "com.geonn.pandoapp";
    var verifyingReceipts = false;
    var win = Ti.UI.createWindow({
        backgroundColor: "#fff"
    });
    var loading = Ti.UI.createActivityIndicator({
        bottom: 10,
        height: 50,
        width: 50,
        backgroundColor: "black",
        borderRadius: 10,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
    });
    var loadingCount = 0;
    win.add(loading);
    var tempPurchasedStore = {};
    var IOS7 = isIOS7Plus();
    Storekit.addEventListener("transactionState", function(evt) {
        hideLoading();
        switch (evt.state) {
          case Storekit.TRANSACTION_STATE_FAILED:
            alert(evt.cancelled ? "Purchase cancelled" : "ERROR: Buying failed! " + evt.message);
            evt.transaction && evt.transaction.finish();
            break;

          case Storekit.TRANSACTION_STATE_PURCHASED:
            if (verifyingReceipts) if (IOS7) {
                var msg = Storekit.validateReceipt() ? "Receipt is Valid!" : "Receipt is Invalid.";
                alert(msg);
            } else Storekit.verifyReceipt(evt, function(e) {
                if (e.success) if (e.valid) {
                    alert("Thanks! Receipt Verified");
                    markProductAsPurchased(evt.productIdentifier);
                } else alert("Sorry. Receipt is invalid"); else alert(e.message);
            }); else {
                alert("Thanks!");
                markProductAsPurchased(evt.productIdentifier);
            }
            evt.downloads ? Storekit.startDownloads({
                downloads: evt.downloads
            }) : evt.transaction && evt.transaction.finish();
            break;

          case Storekit.TRANSACTION_STATE_PURCHASING:
            Ti.API.info("Purchasing " + evt.productIdentifier);
            break;

          case Storekit.TRANSACTION_STATE_RESTORED:
            Ti.API.info("Restored " + evt.productIdentifier);
            evt.downloads && Ti.API.info("Downloads available for restored product");
            evt.transaction && evt.transaction.finish();
        }
    });
    Storekit.addEventListener("updatedDownloads", function(evt) {
        var download;
        for (var i = 0, j = evt.downloads.length; j > i; i++) {
            download = evt.downloads[i];
            Ti.API.info("Updated: " + download.contentIdentifier + " Progress: " + download.progress);
            switch (download.downloadState) {
              case Storekit.DOWNLOAD_STATE_FINISHED:
              case Storekit.DOWNLOAD_STATE_FAILED:
              case Storekit.DOWNLOAD_STATE_CANCELLED:
                hideLoading();
            }
            switch (download.downloadState) {
              case Storekit.DOWNLOAD_STATE_FAILED:
              case Storekit.DOWNLOAD_STATE_CANCELLED:
                download.transaction && download.transaction.finish();
                break;

              case Storekit.DOWNLOAD_STATE_FINISHED:
                var file = Ti.Filesystem.getFile(download.contentURL, "Contents", download.contentIdentifier + ".jpeg");
                if (file.exists()) {
                    Ti.API.info("File exists. Displaying it...");
                    var iv = Ti.UI.createImageView({
                        bottom: 0,
                        left: 0,
                        image: file.read()
                    });
                    iv.addEventListener("click", function() {
                        win.remove(iv);
                        iv = null;
                    });
                    win.add(iv);
                } else Ti.API.error("Downloaded File does not exist at: " + file.nativePath);
                download.transaction && download.transaction.finish();
            }
        }
    });
    Storekit.addEventListener("restoredCompletedTransactions", function(evt) {
        hideLoading();
        if (evt.error) alert(evt.error); else if (null == evt.transactions || 0 == evt.transactions.length) alert("There were no purchases to restore!"); else {
            IOS7 && verifyingReceipts && (Storekit.validateReceipt() ? Ti.API.info("Restored Receipt is Valid!") : Ti.API.error("Restored Receipt is Invalid."));
            for (var i = 0; i < evt.transactions.length; i++) !IOS7 && verifyingReceipts ? Storekit.verifyReceipt(evt.transactions[i], function(e) {
                e.valid ? markProductAsPurchased(e.productIdentifier) : Ti.API.error("Restored transaction is not valid");
            }) : markProductAsPurchased(evt.transactions[i].productIdentifier);
            alert("Restored " + evt.transactions.length + " purchases!");
        }
    });
    Storekit.addTransactionObserver();
    IOS7 && win.addEventListener("open", function() {
        function validate() {
            Ti.API.info("Validating receipt.");
            Ti.API.info("Receipt is Valid: " + Storekit.validateReceipt());
        }
        if (Storekit.receiptExists) {
            Ti.API.info("Receipt does exist.");
            validate();
        } else {
            Ti.API.info("Receipt does not exist yet. Refreshing to get one.");
            Storekit.refreshReceipt(null, function() {
                validate();
            });
        }
    });
    if (Storekit.canMakePayments) {
        var whatHaveIPurchased = Ti.UI.createButton({
            title: "What Have I Purchased?",
            top: 10,
            left: 5,
            right: 5,
            height: 40
        });
        whatHaveIPurchased.addEventListener("click", function() {
            alert({
                "Single Item": checkIfProductPurchased("DigitalSodaPop") ? "Purchased!" : "Not Yet",
                Subscription: checkIfProductPurchased("MonthlySodaPop") ? "Purchased!" : "Not Yet",
                Downloadable: checkIfProductPurchased("DownloadablePop") ? "Purchased!" : "Not Yet"
            });
        });
        win.add(whatHaveIPurchased);
        requestProduct("DigitalSodaPop", function(product) {
            var buySingleItem = Ti.UI.createButton({
                title: "Buy " + product.title + ", " + product.formattedPrice,
                top: 60,
                left: 5,
                right: 5,
                height: 40
            });
            buySingleItem.addEventListener("click", function() {
                purchaseProduct(product);
            });
            win.add(buySingleItem);
        });
        requestProduct("MonthlySodaPop", function(product) {
            var buySubscription = Ti.UI.createButton({
                title: "Buy " + product.title + ", " + product.formattedPrice,
                top: 110,
                left: 5,
                right: 5,
                height: 40
            });
            buySubscription.addEventListener("click", function() {
                purchaseProduct(product);
            });
            win.add(buySubscription);
        });
        requestProduct("DownloadablePop", function(product) {
            var buySubscription = Ti.UI.createButton({
                title: "Buy " + product.title + ", " + product.formattedPrice,
                top: 160,
                left: 5,
                right: 5,
                height: 40
            });
            buySubscription.addEventListener("click", function() {
                purchaseProduct(product);
            });
            win.add(buySubscription);
        });
        var restoreCompletedTransactions = Ti.UI.createButton({
            title: "Restore Lost Purchases",
            top: 210,
            left: 5,
            right: 5,
            height: 40
        });
        restoreCompletedTransactions.addEventListener("click", function() {
            restorePurchases();
        });
        win.add(restoreCompletedTransactions);
        var view = Ti.UI.createView({
            layout: "horizontal",
            top: 260,
            left: 10,
            width: "auto",
            height: "auto"
        });
        var verifyingLabel = Ti.UI.createLabel({
            text: "Verify receipts:",
            height: Ti.UI.SIZE || "auto",
            width: Ti.UI.SIZE || "auto"
        });
        var onSwitch = Ti.UI.createSwitch({
            value: false,
            isSwitch: true,
            left: 4,
            height: Ti.UI.SIZE || "auto",
            width: Ti.UI.SIZE || "auto"
        });
        onSwitch.addEventListener("change", function(e) {
            verifyingReceipts = e.value;
        });
        view.add(verifyingLabel);
        view.add(onSwitch);
        win.add(view);
    } else alert("This device cannot make purchases!");
    win.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;