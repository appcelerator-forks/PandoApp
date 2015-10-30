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
            offset.x = e.x;
        });
        imageview_button.addEventListener("touchmove", function(e) {
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
    $.generate_button_old = function(container, desc) {
        var left_handed = Ti.App.Properties.getString("left-handed") || "";
        var left_button_image = "" != left_handed ? "/images/icons/button_yes.png" : "/images/icons/button_no_right-handed.png";
        var right_button_image = "" != left_handed ? "/images/icons/button_no.png" : "/images/icons/button_yes_right-handed.png";
        var view_container = $.UI.create("View", {
            classes: [ "wfill", "hsize", "padding" ]
        });
        var label_desc = $.UI.create("Label", {
            classes: [ "wsize", "hsize", "h6" ],
            text: desc
        });
        var left_button = $.UI.create("ImageView", {
            classes: [ "wsize" ],
            height: 40,
            image: left_button_image,
            left: 0
        });
        var right_button = $.UI.create("ImageView", {
            classes: [ "wsize" ],
            height: 40,
            image: right_button_image,
            right: 0
        });
        view_container.add(left_button);
        view_container.add(label_desc);
        view_container.add(right_button);
        container.add(view_container);
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
        container.addEventListener("touchstart", function(e) {
            current_point = {
                x: e.x,
                y: e.y
            };
        });
        container.addEventListener("touchmove", function(e) {
            var floatpoint = (e.x - current_point.x) / 100;
            if (e.x - current_point.x < 0) {
                answer = -.5 > floatpoint ? "left" : "";
                left_indicator.setOpacity(-floatpoint);
            } else {
                floatpoint > .5 && (answer = "right");
                right_indicator.setOpacity(floatpoint);
            }
        });
        container.addEventListener("touchend", function() {
            "left" == answer ? "" != left_handed ? yes_callback && yes_callback() : no_callback && no_callback() : "right" == answer && ("" != left_handed ? no_callback && no_callback() : yes_callback && yes_callback());
            left_indicator.setOpacity(0);
            right_indicator.setOpacity(0);
            answer = "";
        });
        return;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;