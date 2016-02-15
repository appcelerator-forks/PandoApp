function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function SendMessage() {
        if ("" == $.message.value) return;
        API.callByPost({
            url: "sendMessageUrl",
            params: {
                to_id: f_id,
                item_id: item_id,
                type: "text",
                u_id: u_id,
                message: $.message.value,
                target: "friends"
            }
        }, function(responseText) {
            var model = Alloy.createCollection("message");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            console.log("message sent");
            console.log(arr);
            model.saveRecord(arr);
            $.message.value = "";
            data = message.getData(item_id);
            render_conversation();
            setTimeout(scrollToBottom, 500);
        });
    }
    function onQRCode() {
        var owner = items_data.owner_id == u_id ? 1 : 0;
        var code = items_data.code || 0;
        Alloy.Globals.Navigator.open("qr_code", {
            item_id: item_id,
            owner: owner,
            code: code
        });
    }
    function render_item_box() {
        $.item_box.removeAllChildren();
        var view_container = $.UI.create("View", {
            classes: [ "hsize", "wfill", "horz" ],
            height: 80
        });
        var imageview_item = $.UI.create("ImageView", {
            left: 10,
            top: 10,
            width: 60,
            height: "auto",
            defaultImage: "/images/default/small_item.png",
            image: items_data.img_path
        });
        var view_info = $.UI.create("View", {
            classes: [ "wfill", "hsize", "vert", "padding" ]
        });
        var label_item_name = $.UI.create("Label", {
            classes: [ "h5", "wfill", "hsize", "bold" ],
            textAlign: "left",
            text: items_data.item_name
        });
        switch (items_data.status) {
          case 2:
            var status_text = "Waiting for receive";
            break;

          case 5:
            var status_text = "Item Received";
        }
        var label_days_ago = $.UI.create("Label", {
            classes: [ "h5", "wfill", "hsize" ],
            textAlign: "left",
            text: status_text
        });
        view_info.add(label_item_name);
        view_info.add(label_days_ago);
        view_container.add(imageview_item);
        view_container.add(view_info);
        $.item_box.add(view_container);
        var line = $.UI.create("View", {
            classes: [ "gray-line" ]
        });
        $.item_box.add(line);
    }
    function render_conversation() {
        $.inner_box.removeAllChildren();
        for (var i = 0; i < data.length; i++) {
            var view_container = $.UI.create("View", {
                classes: [ "hsize", "wfill", "horz" ]
            });
            console.log("u_id: " + data[i].u_id + " = " + u_id + ", message:" + data[i].message + ", to_id:" + data[i].to_id);
            var thumb_path = data[i].u_id == u_id ? user_thumb_path : friend_thumb_path;
            var imageview_thumb_path = $.UI.create("ImageView", {
                top: 10,
                width: 50,
                height: "auto",
                defaultImage: "/images/default/small_item.png",
                left: 10,
                image: thumb_path
            });
            var view_text_container = $.UI.create("View", {
                classes: [ "hsize", "vert", "box" ],
                top: 10,
                left: 10,
                width: "75%"
            });
            var label_message = $.UI.create("Label", {
                classes: [ "h5", "wfill", "padding" ],
                text: data[i].message
            });
            var label_time = $.UI.create("Label", {
                classes: [ "h5", "wfill", "padding" ],
                top: 0,
                text: data[i].created,
                textAlign: "right"
            });
            view_text_container.add(label_message);
            view_text_container.add(label_time);
            if (data[i].u_id == u_id) {
                view_container.add(view_text_container);
                view_container.add(imageview_thumb_path);
            } else {
                view_container.add(imageview_thumb_path);
                view_container.add(view_text_container);
            }
            $.inner_box.add(view_container);
        }
        scrollToBottom();
    }
    function getConversationByItemId(callback) {
        var checker = Alloy.createCollection("updateChecker");
        var isUpdate = checker.getCheckerById(5);
        var last_updated = isUpdate.updated || "";
        API.callByPost({
            url: "getMessageByItem",
            params: {
                item_id: item_id,
                receiver_id: u_id,
                last_updated: last_updated
            }
        }, function(responseText) {
            var model = Alloy.createCollection("message");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            console.log("api get message");
            console.log(arr);
            model.saveArray(arr, callback);
            checker.updateModule(5, "getMessageByItem", Common.now());
            callback && callback();
        });
    }
    function scrollToBottom() {
        $.chatroom.scrollToBottom();
    }
    function refresh() {
        loading.start();
        getConversationByItemId(function() {
            data = message.getData(item_id);
            render_item_box();
            render_conversation();
        });
        loading.finish();
    }
    function updateFriendInfo(callback) {
        var friends = Alloy.createCollection("friends");
        API.callByPost({
            url: "getFriendListUrl",
            params: {
                u_id: u_id
            }
        }, function(responseText) {
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            friends.saveArray(arr);
            var friends_data = friends.getData(f_id);
            friend_thumb_path = friends_data[0].thumb_path;
            $.f_name.text = friends_data[0].fullname;
            callback && callback();
        });
    }
    function init() {
        $.win.add(loading.getView());
        updateFriendInfo(refresh);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "conversation";
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
        barColor: "#323136",
        id: "win",
        title: "Chatroom"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId0 = Ti.UI.createButton({
        title: "Code",
        id: "__alloyId0"
    });
    $.__views.win.rightNavButton = $.__views.__alloyId0;
    onQRCode ? $.addListener($.__views.__alloyId0, "click", onQRCode) : __defers["$.__views.__alloyId0!click!onQRCode"] = true;
    $.__views.__alloyId1 = Ti.UI.createScrollView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.FILL,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId1"
    });
    $.__views.win.add($.__views.__alloyId1);
    $.__views.__alloyId2 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId2"
    });
    $.__views.__alloyId1.add($.__views.__alloyId2);
    $.__views.__alloyId3 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId3"
    });
    $.__views.__alloyId2.add($.__views.__alloyId3);
    $.__views.__alloyId4 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        id: "__alloyId4"
    });
    $.__views.__alloyId3.add($.__views.__alloyId4);
    $.__views.f_name = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 24
        },
        id: "f_name"
    });
    $.__views.__alloyId4.add($.__views.f_name);
    $.__views.__alloyId5 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        borderColor: "#a5a5a5",
        backgroundColor: "#ffffff",
        id: "__alloyId5"
    });
    $.__views.__alloyId2.add($.__views.__alloyId5);
    $.__views.item_box = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        bottom: "0",
        backgroundColor: "#F2F4F5",
        id: "item_box"
    });
    $.__views.__alloyId5.add($.__views.item_box);
    $.__views.chatroom = Ti.UI.createScrollView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "chatroom",
        bottom: "50",
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL
    });
    $.__views.__alloyId5.add($.__views.chatroom);
    $.__views.inner_box = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "inner_box",
        top: "0",
        backgroundColor: "#e5e5e5"
    });
    $.__views.chatroom.add($.__views.inner_box);
    $.__views.__alloyId6 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundColor: "white",
        bottom: "0",
        id: "__alloyId6"
    });
    $.__views.__alloyId1.add($.__views.__alloyId6);
    $.__views.message = Ti.UI.createTextField({
        height: 40,
        borderColor: "#a5a5a5",
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        verticalAlign: Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        textAlign: Titanium.UI.TEXT_ALIGNMENT_LEFT,
        backgroundColor: "#ffffff",
        width: "70%",
        left: 10,
        right: 10,
        top: "10",
        font: {
            fontFamily: "Lato-Regular"
        },
        id: "message",
        bottom: "10"
    });
    $.__views.__alloyId6.add($.__views.message);
    $.__views.__alloyId7 = Ti.UI.createButton({
        borderColor: "#75d0cb",
        backgroundColor: "#ffffff",
        color: "#75d0cb",
        textAlign: Titanium.UI.TEXT_ALIGNMENT_CENTER,
        width: "60",
        height: "40",
        font: {
            fontSize: 14,
            fontFamily: "Lato-Regular"
        },
        title: "Send",
        right: "10",
        id: "__alloyId7"
    });
    $.__views.__alloyId6.add($.__views.__alloyId7);
    SendMessage ? $.addListener($.__views.__alloyId7, "click", SendMessage) : __defers["$.__views.__alloyId7!click!SendMessage"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var f_id = args.f_id;
    var item_id = args.id;
    var u_id = Ti.App.Properties.getString("user_id") || 0;
    var user_thumb_path = Ti.App.Properties.getString("thumb_path") || "";
    var friend_thumb_path = "";
    var loading = Alloy.createController("loading");
    var items = Alloy.createCollection("items");
    var items_data = items.getDataById(item_id);
    var message = Alloy.createCollection("message");
    message.messageRead({
        item_id: item_id
    });
    init();
    $.chatroom.addEventListener("postlayout", scrollToBottom);
    Ti.App.addEventListener("conversation:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("conversation:refresh", refresh);
        Ti.App.fireEvent("friends_items:refresh");
        Ti.App.fireEvent("friends:refresh");
        Ti.App.fireEvent("personal:refresh");
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.__alloyId0!click!onQRCode"] && $.addListener($.__views.__alloyId0, "click", onQRCode);
    __defers["$.__views.__alloyId7!click!SendMessage"] && $.addListener($.__views.__alloyId7, "click", SendMessage);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;