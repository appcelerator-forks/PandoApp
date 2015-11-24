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
    function onCancel() {}
    function image_save() {
        croppedImage = $.inner_box.toImage();
        console.log(croppedImage);
        var evtData = {
            media: croppedImage
        };
        Ti.App.fireEvent("imagePreview: imageCallback", evtData);
        closeWindow();
    }
    function init() {
        $.win.add(loading.getView());
        var pWidth = Titanium.Platform.displayCaps.platformWidth;
        $.inner_box.width = pWidth;
        $.inner_box.height = pWidth;
        var original_image = $.UI.create("ImageView", {
            image: media,
            zIndex: 10,
            opacity: .8
        });
        var baseHeight = original_image.rect.height;
        var baseWidth = original_image.rect.width;
        var offset = {};
        var pinching = false;
        var moving = false;
        original_image.addEventListener("pinch", function(e) {
            if (false == moving) {
                pinching = true;
                original_image.height = baseHeight * e.scale;
                original_image.width = baseWidth * e.scale;
            }
        });
        original_image.addEventListener("touchstart", function(e) {
            offset.x = e.x;
            offset.y = e.y;
            baseHeight = original_image.rect.height;
            baseWidth = original_image.rect.width;
            if (0 == baseHeight) {
                baseHeight = original_image.rect.height;
                baseWidth = original_image.rect.width;
            }
        });
        original_image.addEventListener("touchend", function() {
            pinching = false;
            moving = false;
            baseHeight = original_image.rect.height;
            baseWidth = original_image.rect.width;
        });
        $.inner_box.add(original_image);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "image_preview";
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
        navBarHidden: "false",
        font: {
            fontFamily: "Lato-Regular"
        },
        barColor: "#75d0cb",
        id: "win",
        title: "Image Preview"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId35 = Ti.UI.createButton({
        title: "Cancel",
        id: "__alloyId35"
    });
    $.__views.win.rightNavButton = $.__views.__alloyId35;
    onCancel ? $.addListener($.__views.__alloyId35, "keypressed", onCancel) : __defers["$.__views.__alloyId35!keypressed!onCancel"] = true;
    $.__views.__alloyId36 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: "#ddd",
        id: "__alloyId36"
    });
    $.__views.win.add($.__views.__alloyId36);
    $.__views.cropimage = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        id: "cropimage"
    });
    $.__views.__alloyId36.add($.__views.cropimage);
    $.__views.inner_box = Ti.UI.createScrollView({
        id: "inner_box",
        backgroundColor: "#fff",
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.SIZE
    });
    $.__views.cropimage.add($.__views.inner_box);
    $.__views.__alloyId37 = Ti.UI.createButton({
        borderColor: "#75d0cb",
        backgroundColor: "#ffffff",
        color: "#75d0cb",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        width: "80",
        height: Ti.UI.SIZE,
        font: {
            fontSize: 14,
            fontFamily: "Lato-Regular"
        },
        title: "Send",
        top: "10",
        id: "__alloyId37"
    });
    $.__views.__alloyId36.add($.__views.__alloyId37);
    image_save ? $.addListener($.__views.__alloyId37, "click", image_save) : __defers["$.__views.__alloyId37!click!image_save"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var media = args.media;
    var loading = Alloy.createController("loading");
    var croppedImage;
    $.getMedia = function() {
        return croppedImage;
    };
    init();
    $.win.addEventListener("close", function() {
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.__alloyId35!keypressed!onCancel"] && $.addListener($.__views.__alloyId35, "keypressed", onCancel);
    __defers["$.__views.__alloyId37!click!image_save"] && $.addListener($.__views.__alloyId37, "click", image_save);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;