function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function loadingViewFinish() {
        console.log("finish!");
        loadingView.finish(function() {
            console.log("loadingview_finish!");
            init();
            loadingView = null;
        });
    }
    function _callback() {
        $.index.win.open();
    }
    function init() {
        PUSH.setInApp();
        _callback();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
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
    $.__views.index = Alloy.createController("slideshow", {
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loadingView = Alloy.createController("loader");
    loadingView.getView().open();
    loadingView.start();
    Titanium.UI.iPhone.setAppBadge("0");
    Ti.App.addEventListener("app:loadingViewFinish", loadingViewFinish);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;