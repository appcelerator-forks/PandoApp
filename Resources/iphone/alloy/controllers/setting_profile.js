function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function buy_premium_account() {
        Alloy.createController("in_app_purchase");
    }
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
        loading.start();
        Ti.App.Properties.getString("user_id");
        var filedata = "android" == Ti.Platform.osname ? $.item_image.toImage().media : $.item_image.toImage();
        var records = {
            Filedata: filedata,
            u_id: u_id,
            fullname: $.fullname.value,
            email: $.email.value,
            mobile: $.mobile.value,
            photoLoad: photoLoad
        };
        API.callByPostImage({
            url: "updateProfileUrl",
            params: records
        }, function(responseText) {
            var result = JSON.parse(responseText);
            if ("error" == result.status) {
                Common.createAlert("Error", result.data[0]);
                loading.finish();
                return false;
            }
            loading.finish();
            Ti.App.Properties.setString("fullname", records.fullname);
            Ti.App.Properties.setString("email", records.email);
            Ti.App.Properties.setString("mobile", records.mobile);
            Ti.App.Properties.setString("img_path", result.data.img_path);
            Ti.App.Properties.setString("thumb_path", result.data.thumb_path);
            Common.createAlert("Notification", "Profile Update Successful", function() {
                $.win.close();
            });
        });
    }
    function callback_no() {
        $.win.close();
    }
    function loadUserInfo() {
        var fullname = Ti.App.Properties.getString("fullname");
        var email = Ti.App.Properties.getString("email");
        var mobile = Ti.App.Properties.getString("mobile");
        var img_path = Ti.App.Properties.getString("img_path") || "images/icons/default_avatar.png";
        $.fullname.value = fullname;
        $.email.value = email;
        $.mobile.value = mobile;
        $.item_image.image = img_path;
    }
    function imageCallback() {
        var media = image_preview.getMedia();
        $.item_image.image = media;
        photoLoad = 1;
    }
    function init() {
        var left_right = Alloy.createController("_left_right");
        var label_desc = "Swipe left or right to select";
        left_right.generate_button($.inner_box, label_desc, callback_yes, callback_no);
        left_right.generate_indicator($.item_container);
        loadUserInfo();
        $.win.add(loading.getView());
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "setting_profile";
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
        title: "Profile"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId96 = Ti.UI.createButton({
        title: "Upgrade",
        id: "__alloyId96"
    });
    buy_premium_account ? $.addListener($.__views.__alloyId96, "click", buy_premium_account) : __defers["$.__views.__alloyId96!click!buy_premium_account"] = true;
    $.__views.win.rightNavButton = $.__views.__alloyId96;
    $.__views.__alloyId97 = Ti.UI.createScrollView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId97"
    });
    $.__views.win.add($.__views.__alloyId97);
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
    $.__views.__alloyId97.add($.__views.item_container);
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
    $.__views.__alloyId98 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 14
        },
        text: "Upload profile",
        id: "__alloyId98"
    });
    $.__views.inner_box.add($.__views.__alloyId98);
    $.__views.__alloyId99 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "10",
        id: "__alloyId99"
    });
    $.__views.inner_box.add($.__views.__alloyId99);
    $.__views.item_image = Ti.UI.createImageView({
        preventDefaultImage: true,
        id: "item_image",
        defaultImage: "/images/default/item.png",
        image: "/images/icons/icon_take_photo.png",
        width: "60%"
    });
    $.__views.__alloyId99.add($.__views.item_image);
    loadPhoto ? $.addListener($.__views.item_image, "click", loadPhoto) : __defers["$.__views.item_image!click!loadPhoto"] = true;
    $.__views.fullname = Ti.UI.createTextField({
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
        color: "#000000",
        id: "fullname",
        hintText: "Fullname"
    });
    $.__views.inner_box.add($.__views.fullname);
    $.__views.mobile = Ti.UI.createTextField({
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
        color: "#000000",
        id: "mobile",
        hintText: "Mobile Number"
    });
    $.__views.inner_box.add($.__views.mobile);
    $.__views.email = Ti.UI.createTextField({
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
        color: "#000000",
        id: "email",
        hintText: "Email Address"
    });
    $.__views.inner_box.add($.__views.email);
    $.__views.__alloyId100 = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        image: "/images/shadow.png",
        left: "10",
        right: "10",
        id: "__alloyId100"
    });
    $.__views.__alloyId97.add($.__views.__alloyId100);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var u_id = Ti.App.Properties.getString("user_id");
    var photoLoad = 0;
    var loading = Alloy.createController("loading");
    var image_preview;
    init();
    Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
    $.win.addEventListener("close", function() {
        Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.__alloyId96!click!buy_premium_account"] && $.addListener($.__views.__alloyId96, "click", buy_premium_account);
    __defers["$.__views.item_image!click!loadPhoto"] && $.addListener($.__views.item_image, "click", loadPhoto);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;