function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function do_continue() {
        Alloy.createController("home_index");
    }
    function changeSlideOpacity(seed) {
        var child = $.image_container.children;
        var first = child[Math.floor(seed)];
        if (seed - Math.floor(seed) == 0) for (var a = 0; a < child.length; a++) child[a].setOpacity(a == Math.floor(seed) ? 1 : 0); else {
            var second = child[Math.ceil(seed)];
            for (var a = 0; a < child.length; a++) if (a == Math.floor(seed) || a == Math.ceil(seed)) {
                first.setOpacity(Math.ceil(seed) - seed);
                second.setOpacity(seed - Math.floor(seed));
            } else child[a].setOpacity(0);
        }
    }
    function scroll(event) {
        if ("undefined" == typeof event.currentPageAsFloat) return;
        changeSlideOpacity(event.currentPageAsFloat);
        0 == event.currentPage;
    }
    function render_slideshow() {
        $.image_container.removeAllChildren();
        for (var i = 0; i < fade_images.length; i++) {
            var img = $.UI.create("ImageView", {
                classes: [ "wfill", "hsize" ],
                image: fade_images[i],
                top: 0
            });
            $.image_container.add(img);
        }
    }
    function refresh() {
        loading.start();
        render_slideshow();
        changeSlideOpacity(0);
        loading.finish();
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "slideshow";
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
        backgroundColor: "#E4E6E1",
        titleAttributes: {
            color: "#eaebe6"
        },
        navBarHidden: "false",
        font: {
            fontFamily: "Lato-Regular"
        },
        barColor: "#75d0cb",
        id: "win",
        title: "News"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.image_container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "image_container",
        backgroundColor: "#000"
    });
    $.__views.win.add($.__views.image_container);
    $.__views.__alloyId101 = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        image: "/images/gradient-bg.png",
        id: "__alloyId101"
    });
    $.__views.win.add($.__views.__alloyId101);
    $.__views.__alloyId102 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId102"
    });
    $.__views.win.add($.__views.__alloyId102);
    var __alloyId103 = [];
    $.__views.__alloyId104 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        layout: "composite",
        id: "__alloyId104"
    });
    __alloyId103.push($.__views.__alloyId104);
    $.__views.__alloyId105 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "__alloyId105"
    });
    $.__views.__alloyId104.add($.__views.__alloyId105);
    $.__views.__alloyId106 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId106"
    });
    $.__views.__alloyId105.add($.__views.__alloyId106);
    $.__views.__alloyId107 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Welcome,",
        textAlign: "center",
        id: "__alloyId107"
    });
    $.__views.__alloyId106.add($.__views.__alloyId107);
    $.__views.__alloyId108 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 14
        },
        text: "Pando is a freecycle place for giveaway and adopt with a friendly community",
        textAlign: "center",
        id: "__alloyId108"
    });
    $.__views.__alloyId106.add($.__views.__alloyId108);
    $.__views.__alloyId109 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        layout: "composite",
        id: "__alloyId109"
    });
    __alloyId103.push($.__views.__alloyId109);
    $.__views.__alloyId110 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "__alloyId110"
    });
    $.__views.__alloyId109.add($.__views.__alloyId110);
    $.__views.__alloyId111 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId111"
    });
    $.__views.__alloyId110.add($.__views.__alloyId111);
    $.__views.__alloyId112 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Snap to Donate, Chat to Adopt",
        textAlign: "center",
        id: "__alloyId112"
    });
    $.__views.__alloyId111.add($.__views.__alloyId112);
    $.__views.__alloyId113 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 14
        },
        text: "Let us reuse and keep useful stuffs away from landfill",
        textAlign: "center",
        id: "__alloyId113"
    });
    $.__views.__alloyId111.add($.__views.__alloyId113);
    $.__views.__alloyId114 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId114"
    });
    __alloyId103.push($.__views.__alloyId114);
    $.__views.__alloyId115 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "__alloyId115"
    });
    $.__views.__alloyId114.add($.__views.__alloyId115);
    $.__views.__alloyId116 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId116"
    });
    $.__views.__alloyId115.add($.__views.__alloyId116);
    $.__views.__alloyId117 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Giving away as Easy as 123",
        textAlign: "center",
        id: "__alloyId117"
    });
    $.__views.__alloyId116.add($.__views.__alloyId117);
    $.__views.__alloyId118 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 14
        },
        text: "Snap a picture and describe your preloved, start select your adopter",
        textAlign: "center",
        id: "__alloyId118"
    });
    $.__views.__alloyId116.add($.__views.__alloyId118);
    $.__views.__alloyId119 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId119"
    });
    __alloyId103.push($.__views.__alloyId119);
    $.__views.__alloyId120 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        id: "__alloyId120"
    });
    $.__views.__alloyId119.add($.__views.__alloyId120);
    $.__views.__alloyId121 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: "20",
        id: "__alloyId121"
    });
    $.__views.__alloyId120.add($.__views.__alloyId121);
    $.__views.__alloyId122 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 18
        },
        text: "Thanks Giving Credit",
        textAlign: "center",
        id: "__alloyId122"
    });
    $.__views.__alloyId121.add($.__views.__alloyId122);
    $.__views.__alloyId123 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 14
        },
        text: "Arrange your pick up and scan your credit yo your donor.",
        textAlign: "center",
        id: "__alloyId123"
    });
    $.__views.__alloyId121.add($.__views.__alloyId123);
    $.__views.slogan = Ti.UI.createScrollableView({
        width: Ti.UI.FILL,
        views: __alloyId103,
        id: "slogan",
        height: "85%",
        pagingControlColor: "transparent",
        showPagingControl: "true",
        disableBounce: "true"
    });
    $.__views.__alloyId102.add($.__views.slogan);
    $.__views.__alloyId124 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId124"
    });
    $.__views.__alloyId102.add($.__views.__alloyId124);
    $.__views.__alloyId125 = Ti.UI.createButton({
        height: 40,
        borderColor: "#C6C8CA",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        backgroundColor: "#ED1C24",
        borderRadius: 6,
        color: "#ffffff",
        font: {
            fontFamily: "Lato-Regular"
        },
        width: "60%",
        title: "Continue",
        id: "__alloyId125"
    });
    $.__views.__alloyId124.add($.__views.__alloyId125);
    do_continue ? $.addListener($.__views.__alloyId125, "click", do_continue) : __defers["$.__views.__alloyId125!click!do_continue"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    $.UI.create("View", {
        classes: [ "wfill", "hfill" ],
        backgroundColor: "#000000"
    });
    var fade_images = [ "/images/slideshow/bg0.png", "/images/slideshow/bg1.png", "/images/slideshow/bg2.png", "/images/slideshow/bg3.png" ];
    init();
    $.slogan.addEventListener("scroll", scroll);
    Ti.App.addEventListener("slideshow:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("slideshow:refresh", refresh);
        $.destroy();
    });
    __defers["$.__views.__alloyId125!click!do_continue"] && $.addListener($.__views.__alloyId125, "click", do_continue);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;