function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function animation(item, callback) {
        var animation = Titanium.UI.createAnimation({
            opacity: 0,
            duration: 500
        });
        item.animate(animation);
        animation.addEventListener("complete", function() {
            console.log("callback from animate");
            callback && callback();
        });
        return;
    }
    function callback_yes() {
        item.ItemRemove(1);
    }
    function callback_no() {
        item.ItemRemove(2);
    }
    function closeWindow() {
        $.win.close();
    }
    function init() {
        if (data.length > 0) {
            item = new items(data.length);
            item.init();
        }
        var left_right = Alloy.createController("_left_right");
        var label_desc = "Swipe left or right to select";
        left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
        left_right.generate_indicator($.indicator);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "personal_waiting_list_detail";
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
        layout: "vertical",
        barColor: "#75d0cb",
        id: "win",
        title: "Waiting List"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId64 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: "0",
        borderColor: "#a5a5a5",
        backgroundColor: "#F2F4F5",
        id: "__alloyId64"
    });
    $.__views.win.add($.__views.__alloyId64);
    $.__views.__alloyId65 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId65"
    });
    $.__views.__alloyId64.add($.__views.__alloyId65);
    $.__views.__alloyId66 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: "0",
        borderColor: "#a5a5a5",
        backgroundColor: "#fff",
        id: "__alloyId66"
    });
    $.__views.__alloyId65.add($.__views.__alloyId66);
    $.__views.__alloyId67 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        width: "70%",
        id: "__alloyId67"
    });
    $.__views.__alloyId66.add($.__views.__alloyId67);
    $.__views.__alloyId68 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "NAME",
        left: "0",
        textAlign: "right",
        id: "__alloyId68"
    });
    $.__views.__alloyId67.add($.__views.__alloyId68);
    $.__views.label_field_1 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        text: "-",
        id: "label_field_1",
        minimumFontSize: "14"
    });
    $.__views.__alloyId67.add($.__views.label_field_1);
    $.__views.__alloyId69 = Ti.UI.createView({
        width: "1",
        height: "50",
        backgroundColor: "#d2d3ce",
        id: "__alloyId69"
    });
    $.__views.__alloyId66.add($.__views.__alloyId69);
    $.__views.__alloyId70 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        width: "auto",
        id: "__alloyId70"
    });
    $.__views.__alloyId66.add($.__views.__alloyId70);
    $.__views.__alloyId71 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "POINTS",
        left: "0",
        textAlign: "right",
        id: "__alloyId71"
    });
    $.__views.__alloyId70.add($.__views.__alloyId71);
    $.__views.label_field_2 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 30
        },
        text: "0",
        id: "label_field_2"
    });
    $.__views.__alloyId70.add($.__views.label_field_2);
    $.__views.indicator = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "indicator"
    });
    $.__views.__alloyId64.add($.__views.indicator);
    $.__views.label_no_more = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "No user",
        id: "label_no_more"
    });
    $.__views.indicator.add($.__views.label_no_more);
    $.__views.item_container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "item_container",
        left: "10",
        top: "10",
        right: "10"
    });
    $.__views.indicator.add($.__views.item_container);
    $.__views.left_right_button = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "left_right_button"
    });
    $.__views.__alloyId64.add($.__views.left_right_button);
    $.__views.__alloyId72 = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        image: "/images/shadow.png",
        id: "__alloyId72"
    });
    $.__views.win.add($.__views.__alloyId72);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var item_response_id = args.id;
    var items_response_model = Alloy.createCollection("item_response");
    var data = items_response_model.getDataById(item_response_id);
    var item;
    console.log(data);
    var items = function(counter) {
        return {
            counter: counter,
            set: function(counter) {
                this.counter = parseInt(counter);
                return this;
            },
            init: function() {
                this.insetItem();
                this.insetItem();
                this.displayCurrentItemInfo();
                $.item_container.children[0].addEventListener("postlayout", function() {
                    var rect = $.item_container.children[0].rect;
                    console.log(rect.height + " image height");
                    $.label_no_more.height = rect.height;
                });
                return this;
            },
            insetItem: function() {
                console.log("total items number: " + this.counter);
                if (this.counter) {
                    var item_data = data[this.counter - 1];
                    console.log(item_data.point + " item point!!");
                    var imgview = $.UI.create("ImageView", {
                        zIndex: this.counter,
                        classes: [ "wfill" ],
                        height: "auto",
                        id: item_data.id,
                        point: item_data.point,
                        item_name: item_data.item_name,
                        item_img_path: item_data.item_img_path,
                        requestor_name: item_data.requestor_name,
                        defaultImage: "/images/default/item.png",
                        image: item_data.requestor_img_path
                    });
                    this.counter--;
                    $.item_container.add(imgview);
                } else console.log("no more");
                return this;
            },
            ItemRemove: function(action) {
                if (1 != $.item_container.children[0].zIndex) this.displayCurrentItemInfo(1); else {
                    this.resetCurrentItemInfo();
                    closeWindow();
                }
                Ti.App.Properties.getString("user_id");
                var item_upload = $.item_container.children[0];
                API.callByPost({
                    url: "updateItemResponseUrl",
                    params: {
                        id: item_upload.id,
                        status: action
                    }
                }, function(response_text) {
                    var res = JSON.parse(response_text);
                    var model = Alloy.createCollection("items");
                    if ("success" == res.status) {
                        console.log("work");
                        console.log(res.data);
                        model.saveRecord(res.data);
                    }
                });
                1 == action && Common.createAlert("Notification", "User selected.", function() {
                    closeWindow();
                });
                animation($.item_container.children[0], function() {
                    console.log("remove " + $.item_container.children[0].id);
                    $.item_container.remove($.item_container.children[0]);
                });
            },
            displayCurrentItemInfo: function(index) {
                index = index || 0;
                var label_field_1 = $.item_container.children[index].requestor_name;
                var label_field_2 = $.item_container.children[index].point || 0;
                $.label_field_1.text = label_field_1;
                $.label_field_2.text = label_field_2;
            },
            resetCurrentItemInfo: function() {
                $.label_field_1.text = "";
                $.label_field_2.text = "";
            }
        };
    };
    init();
    $.win.addEventListener("close", function() {
        $.destroy();
        console.log("window close");
        Ti.App.fireEvent("personal:refresh");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;