function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function loadPhoto() {
        var dialog = Titanium.UI.createOptionDialog({
            title: "Choose an image source...",
            options: [ "Camera", "Photo Gallery", "Cancel" ],
            cancel: 2
        });
        dialog.addEventListener("click", function(e) {
            0 == e.index ? Titanium.Media.showCamera({
                success: function(event) {
                    image_preview = Alloy.Globals.Navigator.open("image_preview", {
                        media: event.media
                    });
                },
                cancel: function() {},
                error: function(error) {
                    var a = Titanium.UI.createAlertDialog({
                        title: "Camera"
                    });
                    a.setMessage(error.code == Titanium.Media.NO_CAMERA ? "Device does not have camera" : "Unexpected error: " + error.code);
                    a.show();
                },
                allowImageEditing: true,
                mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ],
                saveToPhotoGallery: true
            }) : 1 == e.index && Titanium.Media.openPhotoGallery({
                success: function(event) {
                    image_preview = Alloy.Globals.Navigator.open("image_preview", {
                        media: event.media
                    });
                },
                cancel: function() {},
                mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ]
            });
        });
        dialog.show();
    }
    function callback_yes() {
        if (!photoLoad) {
            Common.createAlert("Warning", "Please upload the item photo");
            return;
        }
        var owner_id = Ti.App.Properties.getString("user_id");
        var filedata = "android" == Ti.Platform.osname ? $.item_image.toImage().media : $.item_image.toImage();
        var longitude = Ti.App.Properties.getString("longitude");
        var latitude = Ti.App.Properties.getString("latitude");
        var records = {
            Filedata: filedata,
            owner_id: owner_id,
            item_name: $.item_name.value,
            item_category: $.item_category.value,
            photoLoad: photoLoad,
            longitude: longitude,
            latitude: latitude
        };
        loading.start();
        API.callByPostImage({
            url: "addItemUrl",
            params: records
        }, function(responseText) {
            console.log(responseText);
            var result = JSON.parse(responseText);
            if ("error" == result.status) {
                Common.createAlert("Error", result.data[0]);
                loading.finish();
                return false;
            }
            loading.finish();
            Common.createAlert("Notificatin", "Item Upload Successful", function() {
                $.win.close();
            });
        });
    }
    function callback_no() {
        $.win.close();
    }
    function imageCallback() {
        console.log(image_preview);
        var media = image_preview.getMedia();
        $.item_image.image = media;
        photoLoad = 1;
    }
    function init() {
        var left_right = Alloy.createController("_left_right");
        var label_desc = "Swipe left or right to select";
        left_right.generate_button($.inner_box, label_desc, callback_yes, callback_no);
        left_right.generate_indicator($.item_container);
        $.win.add(loading.getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "personal_upload";
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
        title: "Upload New Item"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId63 = Ti.UI.createScrollView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId63"
    });
    $.__views.win.add($.__views.__alloyId63);
    $.__views.__alloyId64 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId64"
    });
    $.__views.__alloyId63.add($.__views.__alloyId64);
    $.__views.__alloyId65 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId65"
    });
    $.__views.__alloyId64.add($.__views.__alloyId65);
    $.__views.__alloyId66 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        text: "Item Upload",
        id: "__alloyId66"
    });
    $.__views.__alloyId65.add($.__views.__alloyId66);
    $.__views.item_container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: "0",
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        id: "item_container"
    });
    $.__views.__alloyId63.add($.__views.item_container);
    $.__views.inner_box = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: "0",
        id: "inner_box",
        backgroundColor: "#F2F4F5"
    });
    $.__views.item_container.add($.__views.inner_box);
    $.__views.__alloyId67 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 14
        },
        text: "Please upload your item photo",
        id: "__alloyId67"
    });
    $.__views.inner_box.add($.__views.__alloyId67);
    $.__views.item_image = Ti.UI.createImageView({
        preventDefaultImage: true,
        id: "item_image",
        image: "/images/icons/icon_take_photo.png",
        top: "10",
        width: "50%"
    });
    $.__views.inner_box.add($.__views.item_image);
    loadPhoto ? $.addListener($.__views.item_image, "click", loadPhoto) : __defers["$.__views.item_image!click!loadPhoto"] = true;
    $.__views.item_name = Ti.UI.createTextField({
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
        id: "item_name",
        hintText: "Item name"
    });
    $.__views.inner_box.add($.__views.item_name);
    $.__views.item_category = Ti.UI.createTextField({
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
        id: "item_category",
        hintText: "Item category"
    });
    $.__views.inner_box.add($.__views.item_category);
    $.__views.__alloyId68 = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        image: "/images/shadow.png",
        left: "10",
        right: "10",
        id: "__alloyId68"
    });
    $.__views.__alloyId63.add($.__views.__alloyId68);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    var photoLoad = 0;
    var image_preview;
    init();
    Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
    $.win.addEventListener("close", function() {
        Ti.App.fireEvent("manage_item:refresh");
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.item_image!click!loadPhoto"] && $.addListener($.__views.item_image, "click", loadPhoto);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;