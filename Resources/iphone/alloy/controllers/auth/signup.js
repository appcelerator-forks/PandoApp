function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function onload(responseText) {
        var result = JSON.parse(responseText);
        if ("error" == result.status) {
            loading.finish();
            Common.createAlert("Error", result.data);
            return false;
        }
        var userModel = Alloy.createCollection("user");
        var arr = result.data;
        userModel.saveArray(arr);
        loading.finish();
        Common.createAlert("Notification", "Pando account registration successful");
        Alloy.Globals.navWin.closeWindow($.signUpWin);
    }
    function doRegister() {
        var fullname = $.fullname.value;
        var mobile = $.mobile.value;
        var email = $.email.value;
        var username = $.username.value;
        var password = $.password.value;
        var confirm = $.confirm.value;
        if ("" == fullname) {
            Common.createAlert("Fail", "Please fill in your full name");
            return false;
        }
        if ("" == mobile) {
            Common.createAlert("Fail", "Please fill in your contact number");
            return false;
        }
        if ("" == email) {
            Common.createAlert("Fail", "Please fill in your email address");
            return false;
        }
        if ("" == username) {
            Common.createAlert("Fail", "Please fill in your username");
            return false;
        }
        if ("" == password || "" == confirm) {
            Common.createAlert("Fail", "Please fill in your password");
            return false;
        }
        if (password != confirm) {
            Common.createAlert("Fail", "Both password must be same");
            return false;
        }
        if (password.length < 6) {
            Common.createAlert("Fail", "Password must at least 6 alphanumberic");
            return false;
        }
        var params = {
            Filedata: $.item_image.toImage(),
            fullname: fullname,
            mobile: mobile,
            email: email,
            username: username,
            password: password,
            photoLoad: photoLoad
        };
        loading.start();
        API.callByPostImage({
            url: "doSignUpUrl",
            params: params
        }, onload);
    }
    function imageCallback() {
        var media = image_preview.getMedia();
        $.item_image.image = media;
        photoLoad = 1;
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
                    image_preview = Alloy.createController("image_preview", {
                        media: event.media
                    });
                    var win = image_preview.getView();
                    Alloy.Globals.navWin.openWindow(win, {
                        animated: true
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
                    image_preview = Alloy.createController("image_preview", {
                        media: event.media
                    });
                    var win = image_preview.getView();
                    Alloy.Globals.navWin.openWindow(win, {
                        animated: true
                    });
                },
                cancel: function() {},
                mediaTypes: [ Ti.Media.MEDIA_TYPE_PHOTO ]
            });
        });
        dialog.show();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "auth/signup";
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
    $.__views.signUpWin = Ti.UI.createWindow({
        backgroundColor: "#ebebeb",
        titleAttributes: {
            color: "#ffffff"
        },
        navBarHidden: "false",
        font: {
            fontFamily: "Lato-Regular"
        },
        title: "Register",
        id: "signUpWin"
    });
    $.__views.signUpWin && $.addTopLevelView($.__views.signUpWin);
    $.__views.__alloyId130 = Ti.UI.createScrollView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundImage: "/images/home_background.jpg",
        scrollType: "vertical",
        id: "__alloyId130"
    });
    $.__views.signUpWin.add($.__views.__alloyId130);
    $.__views.__alloyId131 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        id: "__alloyId131"
    });
    $.__views.__alloyId130.add($.__views.__alloyId131);
    $.__views.__alloyId132 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId132"
    });
    $.__views.__alloyId131.add($.__views.__alloyId132);
    $.__views.__alloyId133 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 14
        },
        text: "Please upload your photo",
        id: "__alloyId133"
    });
    $.__views.__alloyId132.add($.__views.__alloyId133);
    $.__views.item_image = Ti.UI.createImageView({
        preventDefaultImage: true,
        id: "item_image",
        image: "/images/icons/icon_take_photo.png",
        top: "10",
        width: "50%"
    });
    $.__views.__alloyId132.add($.__views.item_image);
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
    $.__views.__alloyId130.add($.__views.fullname);
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
    $.__views.__alloyId130.add($.__views.mobile);
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
    $.__views.__alloyId130.add($.__views.email);
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
        top: 10,
        font: {
            fontFamily: "Lato-Regular"
        },
        color: "#000000",
        id: "username",
        hintText: "Username"
    });
    $.__views.__alloyId130.add($.__views.username);
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
        color: "#000000",
        id: "password",
        hintText: "Password",
        passwordMask: "true"
    });
    $.__views.__alloyId130.add($.__views.password);
    $.__views.confirm = Ti.UI.createTextField({
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
        id: "confirm",
        hintText: "Confirm Password",
        passwordMask: "true"
    });
    $.__views.__alloyId130.add($.__views.confirm);
    $.__views.__alloyId134 = Ti.UI.createButton({
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
        id: "__alloyId134"
    });
    $.__views.__alloyId130.add($.__views.__alloyId134);
    doRegister ? $.addListener($.__views.__alloyId134, "click", doRegister) : __defers["$.__views.__alloyId134!click!doRegister"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var photoLoad = 0;
    var loading = Alloy.createController("loading");
    $.signUpWin.add(loading.getView());
    var image_preview;
    Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
    $.signUpWin.addEventListener("close", function() {
        Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.item_image!click!loadPhoto"] && $.addListener($.__views.item_image, "click", loadPhoto);
    __defers["$.__views.__alloyId134!click!doRegister"] && $.addListener($.__views.__alloyId134, "click", doRegister);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;