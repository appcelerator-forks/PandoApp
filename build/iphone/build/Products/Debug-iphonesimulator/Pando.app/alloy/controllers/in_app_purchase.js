function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function init() {
        console.log("init");
        storekit.receiptVerificationSandbox = "production" !== Ti.App.deployType;
        storekit.bundleVersion = "1.0";
        storekit.bundleIdentifier = "com.geonn.pandoapp";
        console.log("init");
        storekit.addEventListener("transactionState", transactionStateChanged);
        console.log("init");
        storekit.addTransactionObserver();
        console.log("init");
    }
    function requestProduct() {
        console.log("requestProduct");
        storekit.requestProducts([ "premium_account_tier_1" ], function(evt) {
            console.log("requestProduct");
            evt.success ? evt.invalid ? alert("Invalid product.") : purchaseProduct(evt.products[0]) : alert("Sorry, the App Store seems to be down right now. Please try again soon.");
        });
    }
    function purchaseProduct(product) {
        console.log("purchaseProduct");
        storekit.purchase({
            product: product
        });
        console.log("purchaseProduct");
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
    $.__views.__alloyId32 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        borderRadius: 4,
        width: "80%",
        id: "__alloyId32"
    });
    $.__views.win.add($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createLabel({
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
        id: "__alloyId33"
    });
    $.__views.__alloyId32.add($.__views.__alloyId33);
    var __alloyId35 = [];
    $.__views.__alloyId36 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId36"
    });
    __alloyId35.push($.__views.__alloyId36);
    $.__views.__alloyId37 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId37"
    });
    $.__views.__alloyId36.add($.__views.__alloyId37);
    $.__views.__alloyId38 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId38"
    });
    $.__views.__alloyId36.add($.__views.__alloyId38);
    $.__views.__alloyId39 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId39"
    });
    __alloyId35.push($.__views.__alloyId39);
    $.__views.__alloyId40 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/no-ads.png",
        left: "20",
        right: "20",
        id: "__alloyId40"
    });
    $.__views.__alloyId39.add($.__views.__alloyId40);
    $.__views.__alloyId41 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Turn Off Ads",
        textAlign: "center",
        id: "__alloyId41"
    });
    $.__views.__alloyId39.add($.__views.__alloyId41);
    $.__views.__alloyId42 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId42"
    });
    __alloyId35.push($.__views.__alloyId42);
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
    $.__views.__alloyId34 = Ti.UI.createScrollableView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        views: __alloyId35,
        showPagingControl: "true",
        pagingControlColor: "transparent",
        id: "__alloyId34"
    });
    $.__views.__alloyId32.add($.__views.__alloyId34);
    $.__views.__alloyId45 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$0.99 FOR ONE MONTH",
        backgroundColor: "#75d0cb",
        height: "40",
        id: "__alloyId45"
    });
    $.__views.__alloyId32.add($.__views.__alloyId45);
    $.__views.__alloyId46 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "$1.99 FOR ONE YEAR",
        backgroundColor: "#7fdcd7",
        height: "40",
        id: "__alloyId46"
    });
    $.__views.__alloyId32.add($.__views.__alloyId46);
    $.__views.__alloyId47 = Ti.UI.createButton({
        width: Ti.UI.FILL,
        title: "NOT NOW",
        backgroundColor: "#c2e8e6",
        height: "40",
        id: "__alloyId47"
    });
    $.__views.__alloyId32.add($.__views.__alloyId47);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var storekit = require("ti.storekit");
    var transactionStateChanged = function(evt) {
        console.log("transactionStateChanged");
        switch (evt.state) {
          case storekit.TRANSACTION_STATE_FAILED:
            alert(evt.cancelled ? "Purchase cancelled" : evt.message);
            evt.transaction && evt.transaction.finish();
            break;

          case storekit.TRANSACTION_STATE_PURCHASED:
            if (storekit.validateReceipt()) {
                Ti.API.info(JSON.stringify(evt.receipt.toString()));
                alert("Purchase completed!");
            }
            evt.transaction && evt.transaction.finish();
        }
        console.log("transactionStateChanged");
    };
    init();
    requestProduct();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;