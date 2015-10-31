function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
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
    function init() {
        $.win.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "Copy of in_app_purchase";
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
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var Storekit = require("ti.storekit");
    Storekit.receiptVerificationSandbox = "production" !== Ti.App.deployType;
    Storekit.receiptVerificationSharedSecret = "<YOUR STOREKIT SHARED SECRET HERE>";
    Storekit.autoFinishTransactions = false;
    Storekit.bundleVersion = "1.0";
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
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;