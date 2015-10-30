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
    function payment_method_1() {
        requestProduct("premium_account_tier_1", function(product) {
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
            $.win.add(buySingleItem);
        });
    }
    function closeWindow() {
        $.win.hide();
    }
    function init() {
        $.win.show();
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
    var __defers = {};
    $.__views.win = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundImage: "/images/transparent-background.png",
        id: "win"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId44 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        borderColor: "#d2d3ce",
        backgroundColor: "#f6f6f6",
        borderRadius: 4,
        width: "80%",
        id: "__alloyId44"
    });
    $.__views.win.add($.__views.__alloyId44);
    $.__views.__alloyId45 = Ti.UI.createLabel({
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
        id: "__alloyId45"
    });
    $.__views.__alloyId44.add($.__views.__alloyId45);
    var __alloyId47 = [];
    $.__views.__alloyId48 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId48"
    });
    __alloyId47.push($.__views.__alloyId48);
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
    $.__views.__alloyId51 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId51"
    });
    __alloyId47.push($.__views.__alloyId51);
    $.__views.__alloyId52 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId52"
    });
    $.__views.__alloyId51.add($.__views.__alloyId52);
    $.__views.__alloyId53 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId53"
    });
    $.__views.__alloyId51.add($.__views.__alloyId53);
    $.__views.__alloyId54 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId54"
    });
    __alloyId47.push($.__views.__alloyId54);
    $.__views.__alloyId55 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId55"
    });
    $.__views.__alloyId54.add($.__views.__alloyId55);
    $.__views.__alloyId56 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId56"
    });
    $.__views.__alloyId54.add($.__views.__alloyId56);
    $.__views.__alloyId46 = Ti.UI.createScrollableView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        views: __alloyId47,
        showPagingControl: "true",
        pagingControlColor: "transparent",
        id: "__alloyId46"
    });
    $.__views.__alloyId44.add($.__views.__alloyId46);
    $.__views.__alloyId57 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$0.99 FOR ONE MONTH",
        backgroundColor: "#75d0cb",
        height: "40",
        id: "__alloyId57"
    });
    $.__views.__alloyId44.add($.__views.__alloyId57);
    payment_method_1 ? $.addListener($.__views.__alloyId57, "click", payment_method_1) : __defers["$.__views.__alloyId57!click!payment_method_1"] = true;
    $.__views.__alloyId58 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$1.99 FOR ONE YEAR",
        backgroundColor: "#7fdcd7",
        height: "40",
        id: "__alloyId58"
    });
    $.__views.__alloyId44.add($.__views.__alloyId58);
    $.__views.__alloyId59 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "NOT NOW",
        backgroundColor: "#c2e8e6",
        height: "40",
        id: "__alloyId59"
    });
    $.__views.__alloyId44.add($.__views.__alloyId59);
    closeWindow ? $.addListener($.__views.__alloyId59, "click", closeWindow) : __defers["$.__views.__alloyId59!click!closeWindow"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var Storekit = require("ti.storekit");
    Storekit.receiptVerificationSandbox = "production" !== Ti.App.deployType;
    Storekit.receiptVerificationSharedSecret = "<YOUR STOREKIT SHARED SECRET HERE>";
    Storekit.autoFinishTransactions = false;
    Storekit.bundleVersion = "1.0.0";
    Storekit.bundleIdentifier = "com.geonn.pandoapp";
    var verifyingReceipts = false;
    var loading = Ti.UI.createActivityIndicator({
        bottom: 10,
        height: 50,
        width: 50,
        backgroundColor: "black",
        borderRadius: 10,
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
    });
    var loadingCount = 0;
    $.win.add(loading);
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
                        $.win.remove(iv);
                        iv = null;
                    });
                    $.win.add(iv);
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
    IOS7 && $.win.addEventListener("postlayout", function() {
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
    Storekit.canMakePayments || alert("This device cannot make purchases!");
    init();
    __defers["$.__views.__alloyId57!click!payment_method_1"] && $.addListener($.__views.__alloyId57, "click", payment_method_1);
    __defers["$.__views.__alloyId59!click!closeWindow"] && $.addListener($.__views.__alloyId59, "click", closeWindow);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;