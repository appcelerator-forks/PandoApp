function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function do_signup() {
        var win = Alloy.createController("auth/signup").getView();
        "android" == Ti.Platform.osname ? win.open() : Alloy.Globals.navWin.openWindow(win, {
            animated: true
        });
    }
    function onload(responseText) {
        var result = JSON.parse(responseText);
        if ("error" == result.status) {
            Common.createAlert("Error", result.data[0]);
            loading.finish();
            return false;
        }
        loading.finish();
        var userModel = Alloy.createCollection("user");
        var arr = result.data;
        userModel.saveArray(arr);
        Ti.App.Properties.setString("user_id", arr.id);
        Ti.App.Properties.setString("fullname", arr.fullname);
        Ti.App.Properties.setString("email", arr.email);
        Ti.App.Properties.setString("mobile", arr.mobile);
        Ti.App.Properties.setString("img_path", arr.img_path);
        Ti.App.Properties.setString("thumb_path", arr.thumb_path);
        Ti.App.Properties.setString("point", arr.point);
        $.win.close();
        Ti.App.fireEvent("home:refresh");
        Alloy.Globals.Navigator.navGroup.open({
            navBarHidden: true,
            fullscreen: false
        });
    }
    function do_login() {
        var username = $.username.value;
        var password = $.password.value;
        if ("" == username) {
            Common.createAlert("Fail", "Please fill in your username");
            return false;
        }
        if ("" == password) {
            Common.createAlert("Fail", "Please fill in your password");
            return false;
        }
        var device_token = Ti.App.Properties.getString("deviceToken");
        console.log(device_token);
        var params = {
            device_token: device_token,
            username: username,
            password: password
        };
        loading.start();
        API.callByPost({
            url: "doLoginUrl",
            params: params
        }, onload);
    }
    function init() {
        Alloy.Globals.navWin = $.navWin;
        $.win.add(loading.getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "auth/login";
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
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "#ebebeb",
        titleAttributes: {
            color: "#ffffff"
        },
        navBarHidden: true,
        font: {
            fontFamily: "Lato-Regular"
        },
        title: "Pando",
        color: "#ffffff",
        id: "win"
    });
    $.__views.__alloyId126 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundImage: "/images/home_background.jpg",
        id: "__alloyId126"
    });
    $.__views.win.add($.__views.__alloyId126);
    $.__views.__alloyId127 = Ti.UI.createImageView({
        preventDefaultImage: true,
        image: "/images/full_logo.png",
        top: "80",
        width: "50%",
        id: "__alloyId127"
    });
    $.__views.__alloyId126.add($.__views.__alloyId127);
    $.__views.username = Ti.UI.createTextField({
        height: 40,
        borderColor: "#a5a5a5",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        backgroundColor: "#ffffff",
        width: Titanium.UI.FILL,
        left: 10,
        right: 10,
        top: "80",
        font: {
            fontFamily: "Lato-Regular"
        },
        id: "username",
        hintText: "Username"
    });
    $.__views.__alloyId126.add($.__views.username);
    $.__views.password = Ti.UI.createTextField({
        height: 40,
        borderColor: "#a5a5a5",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        backgroundColor: "#ffffff",
        width: Titanium.UI.FILL,
        left: 10,
        right: 10,
        top: 10,
        font: {
            fontFamily: "Lato-Regular"
        },
        id: "password",
        hintText: "Password",
        passwordMask: "true"
    });
    $.__views.__alloyId126.add($.__views.password);
    $.__views.__alloyId128 = Ti.UI.createButton({
        height: 40,
        borderColor: "#C6C8CA",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        backgroundColor: "#ED1C24",
        borderRadius: 6,
        color: "#ffffff",
        width: Titanium.UI.FILL,
        left: 10,
        right: 10,
        top: 10,
        font: {
            fontFamily: "Lato-Regular"
        },
        title: "Login",
        id: "__alloyId128"
    });
    $.__views.__alloyId126.add($.__views.__alloyId128);
    do_login ? $.addListener($.__views.__alloyId128, "click", do_login) : __defers["$.__views.__alloyId128!click!do_login"] = true;
    $.__views.__alloyId129 = Ti.UI.createButton({
        height: 40,
        borderColor: "#C6C8CA",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        backgroundColor: "#5375BD",
        borderRadius: 6,
        color: "#ffffff",
        width: Titanium.UI.FILL,
        left: 10,
        right: 10,
        top: 10,
        font: {
            fontFamily: "Lato-Regular"
        },
        title: "Register",
        id: "__alloyId129"
    });
    $.__views.__alloyId126.add($.__views.__alloyId129);
    do_signup ? $.addListener($.__views.__alloyId129, "click", do_signup) : __defers["$.__views.__alloyId129!click!do_signup"] = true;
    $.__views.navWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.win,
        id: "navWin"
    });
    $.__views.navWin && $.addTopLevelView($.__views.navWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    init();
    __defers["$.__views.__alloyId128!click!do_login"] && $.addListener($.__views.__alloyId128, "click", do_login);
    __defers["$.__views.__alloyId129!click!do_signup"] && $.addListener($.__views.__alloyId129, "click", do_signup);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;