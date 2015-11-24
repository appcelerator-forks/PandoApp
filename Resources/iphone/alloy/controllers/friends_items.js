function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function navToConversation(e) {
        var id = parent({
            name: "id"
        }, e.source);
        Alloy.Globals.Navigator.open("conversation", {
            f_id: f_id,
            id: id
        });
    }
    function render_items_list() {
        $.inner_box.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            var view_container = $.UI.create("View", {
                classes: [ "hsize", "wfill", "horz" ],
                f_id: data[i].f_id,
                id: data[i].id
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                top: 10,
                width: 60,
                height: "auto",
                defaultImage: "/images/default/small_item.png",
                image: data[i].img_path
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hsize", "vert", "padding" ],
                width: "70%"
            });
            var label_item_name = $.UI.create("Label", {
                classes: [ "h5", "wfill", "hsize" ],
                textAlign: "left",
                text: data[i].item_name
            });
            var total = data[i].total || 0;
            var label_number_people = $.UI.create("Label", {
                classes: [ "h6", "wfill", "hsize" ],
                color: "#333333",
                textAlign: "left",
                text: total + " unread message."
            });
            view_info_box.add(label_item_name);
            view_info_box.add(label_number_people);
            view_container.add(imageView_item_thumb);
            view_container.add(view_info_box);
            $.inner_box.add(view_container);
            view_container.addEventListener("click", navToConversation);
        }
    }
    function refresh() {
        loading.start();
        data = items.getDataByFid(f_id);
        render_items_list();
        $.label_friends.text = "Items (" + data.length + ")";
        loading.finish();
        return;
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "friends_items";
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
        title: "Friends"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId13 = Ti.UI.createScrollView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId13"
    });
    $.__views.win.add($.__views.__alloyId13);
    $.__views.__alloyId14 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId14"
    });
    $.__views.__alloyId13.add($.__views.__alloyId14);
    $.__views.__alloyId15 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId15"
    });
    $.__views.__alloyId14.add($.__views.__alloyId15);
    $.__views.label_friends = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        text: "Items (0)",
        id: "label_friends"
    });
    $.__views.__alloyId15.add($.__views.label_friends);
    $.__views.__alloyId16 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        id: "__alloyId16"
    });
    $.__views.__alloyId13.add($.__views.__alloyId16);
    $.__views.__alloyId17 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        backgroundColor: "#e5e5e5",
        id: "__alloyId17"
    });
    $.__views.__alloyId16.add($.__views.__alloyId17);
    $.__views.inner_box = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        id: "inner_box"
    });
    $.__views.__alloyId17.add($.__views.inner_box);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var f_id = args.f_id;
    var loading = Alloy.createController("loading");
    var items = Alloy.createCollection("items");
    var data = items.getDataByFid(f_id);
    console.log(data);
    init();
    Ti.App.addEventListener("friends_items:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("friends_items:refresh", refresh);
        $.destroy();
        console.log("window close");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;