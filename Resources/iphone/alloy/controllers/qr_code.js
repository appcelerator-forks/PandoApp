function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function closeWindow() {
        $.win.close();
    }
    function render_scanner() {
        var SCANNER = require("scanner");
        var window = SCANNER.createScannerWindow();
        SCANNER.createScannerButton();
        SCANNER.init(window);
        SCANNER.openScanner("1");
    }
    function render_qrcode() {
        var qrcode = require("qrcode");
        console.log(item_id + "||" + code + "||" + owner_id);
        var userQR = qrcode.QRCode({
            typeNumber: 4,
            errorCorrectLevel: "M"
        });
        var qrcodeView = userQR.createQRCodeView({
            width: 200,
            height: 200,
            margin: 4,
            text: item_id + "||" + code + "||" + owner_id
        });
        return qrcodeView;
    }
    function update_compelete_code(e) {
        console.log(e.res);
        var res = e.res;
        var _item_id = res[0];
        var _code = res[1];
        var u_id = Ti.App.Properties.getString("user_id") || 0;
        API.callByPost({
            url: "validateTransactionCodeUrl",
            params: {
                code: _code,
                item_id: _item_id,
                receiver_id: u_id
            }
        }, function(responseText) {
            var res = JSON.parse(responseText);
            if ("success" == res.status) {
                console.log(_item_id + " " + _code + " " + u_id + " after scan");
                var arr = res.data;
                console.log(arr);
                var items = Alloy.createCollection("items");
                items.saveArray(arr);
                Common.createAlert("Notification", "Item pairing is successful.", function() {
                    Ti.App.fireEvent("conversation:refresh");
                });
                closeWindow();
            } else Common.createAlert("Notification", res.error_code, render_scanner);
        });
    }
    function init() {
        $.win.add(loading.getView());
        loading.start();
        owner ? $.qrcode.add(render_qrcode()) : render_scanner();
        loading.finish();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "qr_code";
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
    $.__views.win = Ti.UI.createWindow({
        backgroundColor: "#ebebeb",
        titleAttributes: {
            color: "#ffffff"
        },
        navBarHidden: "false",
        font: {
            fontFamily: "Lato-Regular"
        },
        barColor: "#75d0cb",
        id: "win",
        title: "Code"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId78 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: "#ddd",
        id: "__alloyId78"
    });
    $.__views.win.add($.__views.__alloyId78);
    $.__views.qrcode = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "qrcode"
    });
    $.__views.__alloyId78.add($.__views.qrcode);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var item_id = args.item_id;
    var owner = args.owner || 0;
    var owner_id = args.owner_id || 0;
    var code = args.code || 0;
    var loading = Alloy.createController("loading");
    console.log(item_id);
    init();
    Ti.App.addEventListener("qr_code:update_compelete_code", update_compelete_code);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("qr_code:update_compelete_code", update_compelete_code);
        $.destroy();
        console.log("window close");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;