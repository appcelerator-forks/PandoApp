function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function _callback() {
        Alloy.Globals.Navigator.navGroup.open({
            navBarHidden: true,
            fullscreen: false
        });
    }
    function init() {
        var user = require("user");
        user.checkAuth(_callback);
        PUSH.registerPush();
        PUSH.setInApp();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home_index";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        {
            __processArg(arguments[0], "$model");
        }
        {
            __processArg(arguments[0], "__itemTemplate");
        }
    }
    var $ = this;
    var exports = {};
    $.__views.__alloyId34 = Alloy.createController("home", {
        id: "__alloyId34",
        __parentSymbol: __parentSymbol
    });
    $.__views.nav = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.__alloyId34.getViewEx({
            recurse: true
        }),
        id: "nav"
    });
    $.__views.nav && $.addTopLevelView($.__views.nav);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Globals.Navigator = {
        navGroup: $.nav,
        open: function(controller, payload) {
            var controller = Alloy.createController(controller, payload || {});
            var win = controller.getView();
            _.debounce(this.navGroup.openWindow(win), 1e3, true);
            return controller;
        },
        openWindow: function(win) {
            this.navGroup.openWindow(win);
        }
    };
    init();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;