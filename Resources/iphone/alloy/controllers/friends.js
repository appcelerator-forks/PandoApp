function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function navToFriendItem(e) {
        var f_id = parent({
            name: "f_id"
        }, e.source);
        Alloy.Globals.Navigator.open("friends_items", {
            f_id: f_id
        });
    }
    function render_friends_list() {
        $.inner_box.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            var view_container = $.UI.create("View", {
                classes: [ "hsize", "wfill", "horz" ],
                f_id: data[i].f_id
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                top: 10,
                width: 60,
                height: "auto",
                image: data[i].thumb_path,
                defaultImage: "/images/default/small_item.png"
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hsize", "vert", "padding" ],
                width: "70%"
            });
            var total = data[i].total || 0;
            var label_item_name = $.UI.create("Label", {
                classes: [ "h5", "wfill", "hsize" ],
                textAlign: "left",
                text: data[i].fullname
            });
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
            view_container.addEventListener("click", navToFriendItem);
        }
    }
    function refresh() {
        loading.start();
        var u_id = Ti.App.Properties.getString("user_id") || 0;
        var checker = Alloy.createCollection("updateChecker");
        var isUpdate = checker.getCheckerById(3, u_id);
        var last_update = isUpdate.updated || "";
        console.log(u_id);
        API.callByPost({
            url: "getFriendListUrl",
            params: {
                last_updated: last_update,
                u_id: u_id
            }
        }, function(responseText) {
            var model = Alloy.createCollection("friends");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            model.saveArray(arr);
            data = model.getData();
            checker.updateModule(3, "friends", Common.now(), u_id);
            render_friends_list();
            $.label_friends.text = "Friends (" + data.length + ")";
            loading.finish();
        });
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "friends";
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
        title: "Friends"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId9 = Ti.UI.createScrollView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId9"
    });
    $.__views.win.add($.__views.__alloyId9);
    $.__views.__alloyId10 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId10"
    });
    $.__views.__alloyId9.add($.__views.__alloyId10);
    $.__views.__alloyId11 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId11"
    });
    $.__views.__alloyId10.add($.__views.__alloyId11);
    $.__views.label_friends = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        text: "Friends (0)",
        id: "label_friends"
    });
    $.__views.__alloyId11.add($.__views.label_friends);
    $.__views.__alloyId12 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        borderColor: "#d2d3ce",
        backgroundColor: "#f6f6f6",
        id: "__alloyId12"
    });
    $.__views.__alloyId9.add($.__views.__alloyId12);
    $.__views.__alloyId13 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        backgroundColor: "#e5e5e5",
        id: "__alloyId13"
    });
    $.__views.__alloyId12.add($.__views.__alloyId13);
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
    $.__views.__alloyId13.add($.__views.inner_box);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    var friends = Alloy.createCollection("friends");
    var data = friends.getData();
    init();
    Ti.App.addEventListener("friends:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("friends:refresh", refresh);
        $.destroy();
        console.log("window close");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;