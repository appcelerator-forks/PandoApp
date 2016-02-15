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
    this.__controllerPath = "_left_right";
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
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var current_point;
    var answer = "";
    var left_indicator;
    var right_indicator;
    var username = Ti.App.Properties.getString(username);
    var image_view;
    $.generate_button = function(container, desc, yes_callback, no_callback) {
        var left_handed = Ti.App.Properties.getString("left-handed") || "";
        var button_image = "" != left_handed ? "/images/icons/button_left-handed.png" : "/images/icons/button_right-handed.png";
        var left_button_image = "" != left_handed ? "/images/icons/button_yes.png" : "/images/icons/button_no_right-handed.png";
        var right_button_image = "" != left_handed ? "/images/icons/button_no.png" : "/images/icons/button_yes_right-handed.png";
        var view_slider = $.UI.create("View", {
            height: 54,
            borderColor: "#bbb",
            borderRadius: 26,
            classes: [ "wfill" ],
            top: 10,
            bottom: 10
        });
        var imageview_button = $.UI.create("ImageView", {
            classes: [ "hfill" ],
            top: 2,
            bottom: 2,
            width: 80,
            image: button_image
        });
        var label_sliderText = $.UI.create("Label", {
            classes: [ "wsize", "hsize", "h6" ],
            text: desc
        });
        view_slider.add(imageview_button);
        view_slider.add(label_sliderText);
        container.add(view_slider);
        var offset = {};
        imageview_button.addEventListener("touchstart", function(e) {
            image_moving = false;
            offset.x = e.x;
        });
        imageview_button.addEventListener("touchmove", function(e) {
            image_moving = true;
            if ("android" == Titanium.Platform.osname) var moveX = imageview_button.left + (e.x - offset.x); else var moveX = e.x + imageview_button.animatedCenter.x - imageview_button.getWidth();
            if (moveX + imageview_button.getWidth() >= view_slider.getRect().width) return;
            if (0 >= moveX) return;
            if (moveX > .5 * view_slider.getRect().width) {
                answer = "right";
                imageview_button.image = right_button_image;
            } else if (moveX < .25 * view_slider.getRect().width) {
                answer = "left";
                imageview_button.image = left_button_image;
            } else {
                answer = "";
                imageview_button.image = button_image;
            }
            imageview_button.setLeft(moveX);
        });
        imageview_button.addEventListener("touchend", function() {
            "left" == answer ? "" != left_handed ? yes_callback && yes_callback() : no_callback && no_callback() : "right" == answer && ("" != left_handed ? no_callback && no_callback() : yes_callback && yes_callback());
            imageview_button.setLeft();
            imageview_button.image = button_image;
            answer = "";
        });
    };
    $.generate_button_old = function(container, yes_callback, no_callback) {
        var left_handed = Ti.App.Properties.getString("left-handed") || "";
        var left_button_image = "" != left_handed ? "/images/icons/button_yes.png" : "/images/icons/button_no_right-handed.png";
        var right_button_image = "" != left_handed ? "/images/icons/button_no.png" : "/images/icons/button_yes_right-handed.png";
        var left_button_image_press = "" != left_handed ? "/images/icons/button_yes_pressed.png" : "/images/icons/button_no_right-handed_pressed.png";
        var right_button_image_press = "" != left_handed ? "/images/icons/button_no_pressed.png" : "/images/icons/button_yes_right-handed_pressed.png";
        var undo_view = $.UI.create("View", {
            classs: [ "hfill" ],
            width: "20%"
        });
        var left_view = $.UI.create("View", {
            classs: [ "hfill" ],
            width: "30%"
        });
        var right_view = $.UI.create("View", {
            classs: [ "hfill" ],
            width: "30%"
        });
        var willingtobuy_view = $.UI.create("View", {
            classs: [ "hfill" ],
            width: "20%"
        });
        var left_button = $.UI.create("ImageView", {
            classes: [ "hsize" ],
            width: "80%",
            image: left_button_image,
            left: 0
        });
        var right_button = $.UI.create("ImageView", {
            classes: [ "hsize" ],
            width: "80%",
            image: right_button_image,
            right: 0
        });
        var undo_button = $.UI.create("ImageView", {
            classes: [ "hsize", "wfill" ],
            top: 10,
            image: "/images/icons/icon_undo.png"
        });
        var willingtobuy_button = $.UI.create("ImageView", {
            classes: [ "hsize", "wfill" ],
            top: 10,
            image: "/images/icons/icon-willing-to-buy.png"
        });
        left_view.add(left_button);
        right_view.add(right_button);
        undo_view.add(undo_button);
        willingtobuy_view.add(willingtobuy_button);
        left_button.addEventListener("touchstart", function() {
            left_button.image = left_button_image_press;
            console.log(left_button_image_press);
        });
        left_button.addEventListener("touchend", function() {
            left_button.image = left_button_image;
        });
        right_button.addEventListener("touchstart", function() {
            right_button.image = right_button_image_press;
            console.log(left_button_image_press);
        });
        right_button.addEventListener("touchend", function() {
            right_button.image = right_button_image;
        });
        undo_button.addEventListener("touchstart", function() {
            undo_button.image = "/images/icons/icon_undo_pressed.png";
        });
        undo_button.addEventListener("touchend", function() {
            undo_button.image = "/images/icons/icon_undo.png";
        });
        willingtobuy_button.addEventListener("touchstart", function() {
            willingtobuy_button.image = "/images/icons/icon-willing-to-buy_pressed.png";
        });
        willingtobuy_button.addEventListener("touchend", function() {
            willingtobuy_button.image = "/images/icons/icon-willing-to-buy.png";
        });
        left_button.addEventListener("click", function() {
            "" != left_handed ? yes_callback() : no_callback();
        });
        right_button.addEventListener("click", function() {
            "" != left_handed ? no_callback() : yes_callback();
        });
        container.add(undo_view);
        container.add(left_view);
        container.add(right_view);
        container.add(willingtobuy_view);
        return;
    };
    $.generate_indicator = function(container) {
        var left_handed = Ti.App.Properties.getString("left-handed") || "";
        var left_button_image = "" != left_handed ? "/images/icons/button_yes.png" : "/images/icons/button_no_right-handed.png";
        var right_button_image = "" != left_handed ? "/images/icons/button_no.png" : "/images/icons/button_yes_right-handed.png";
        left_indicator = $.UI.create("ImageView", {
            classes: [ "wsize" ],
            height: 40,
            image: left_button_image,
            left: 0,
            zIndex: 999,
            opacity: 0
        });
        right_indicator = $.UI.create("ImageView", {
            classes: [ "wsize" ],
            height: 40,
            image: right_button_image,
            right: 0,
            zIndex: 999,
            opacity: 0
        });
        container.add(left_indicator);
        container.add(right_indicator);
        return;
    };
    $.add_event = function(container, yes_callback, no_callback) {
        var left_handed = Ti.App.Properties.getString("left-handed") || "";
        var pwidth = Ti.Platform.displayCaps.platformWidth;
        image_view = parent({
            name: "isParent",
            value: "yes"
        }, container);
        image_view.addEventListener("touchstart", function(e) {
            current_point = {
                x: e.x,
                y: e.y
            };
            current_image_point_diff = {
                x: e.x - image_view.animatedCenter.x,
                y: e.y - image_view.animatedCenter.y
            };
            Ti.App.fireEvent("home:zIndex12");
        });
        image_view.addEventListener("touchmove", function(e) {
            var moveX = e.x + image_view.animatedCenter.x - pwidth - current_image_point_diff.x;
            var moveY = e.y + image_view.animatedCenter.y - pwidth - current_image_point_diff.y - 40;
            var floatpoint = (image_view.animatedCenter.x - pwidth / 2) / pwidth;
            console.log(floatpoint);
            e.x - current_point.x < 0 ? answer = -.4 > floatpoint ? "left" : "" : floatpoint > .4 && (answer = "right");
            var angle = 25 * floatpoint;
            container.transform = Ti.UI.create2DMatrix().rotate(angle);
            container.animate({
                top: moveY,
                left: moveX,
                duration: 1
            });
        });
        image_view.addEventListener("touchend", function() {
            if ("left" == answer) {
                container.animate({
                    left: -pwidth,
                    duration: 500
                });
                "" != left_handed ? yes_callback(image_view) : no_callback(image_view);
                Ti.App.fireEvent("home:zIndex10");
            } else if ("right" == answer) {
                container.animate({
                    left: pwidth,
                    duration: 500
                });
                if ("" != left_handed) {
                    console.log(image_view);
                    no_callback(image_view);
                } else yes_callback(image_view);
                Ti.App.fireEvent("home:zIndex10");
            } else {
                container.animate({
                    top: 0,
                    left: 0,
                    duration: 500
                }, function() {
                    Ti.App.fireEvent("home:zIndex10");
                });
                container.transform = Ti.UI.create2DMatrix().rotate(0);
            }
            answer = "";
        });
        return;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;