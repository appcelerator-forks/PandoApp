function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "loading";
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
    $.__views.loadingBar = Ti.UI.createView({
        layout: "vertical",
        id: "loadingBar",
        height: "120",
        width: "120",
        borderRadius: "15",
        backgroundColor: "#2E2E2E"
    });
    $.__views.loadingBar && $.addTopLevelView($.__views.loadingBar);
    $.__views.activityIndicator = Ti.UI.createActivityIndicator({
        top: "30",
        left: "30",
        width: "60",
        id: "activityIndicator",
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
    });
    $.__views.loadingBar.add($.__views.activityIndicator);
    $.__views.__alloyId49 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        textAlign: "center",
        top: "5",
        text: "Loading",
        id: "__alloyId49"
    });
    $.__views.loadingBar.add($.__views.__alloyId49);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    $.loadingBar.hide();
    $.activityIndicator.hide();
    $.start = function() {
        $.loadingBar.show();
        $.activityIndicator.show();
    };
    $.finish = function(_callback) {
        $.loadingBar.hide();
        $.activityIndicator.hide();
        _callback && _callback();
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;