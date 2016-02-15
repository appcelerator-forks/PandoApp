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
        var f_id = parent({
            name: "f_id"
        }, e.source);
        var item_id = parent({
            name: "item_id"
        }, e.source);
        Alloy.Globals.Navigator.open("conversation", {
            f_id: f_id,
            id: item_id
        });
    }
    function navToPersonalUpload() {
        Alloy.Globals.Navigator.open("personal_upload");
    }
    function navToWaitingList(e) {
        var item_id = parent({
            name: "item_id"
        }, e.source);
        console.log(e.source);
        console.log(item_id);
        Alloy.Globals.Navigator.open("personal_waiting_list", {
            id: item_id
        });
    }
    function render_table_view() {
        "donate" == current_tab ? render_donate_list() : render_adopt_list();
        $.tblview.addEventListener("delete", doRemoveDonateItem);
    }
    function render_adopt_list() {
        var model = Alloy.createCollection("items");
        data = model.getWaitingDataByRequestor();
        var u_id = Ti.App.Properties.getString("user_id");
        var adopt_list = [];
        for (var i = 0; i < data.length; i++) {
            var tableviewrow = $.UI.create("TableViewRow", {
                selectedBackgroundColor: "#75d0cb"
            });
            var view_container = $.UI.create("View", {
                classes: [ "wfill", "horz" ],
                height: 70,
                backgroundColor: "#ffffff",
                item_id: data[i].id,
                f_id: data[i].owner_id
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                width: 70,
                height: 70,
                defaultImage: "/images/default/small_item.png",
                image: data[i].img_path
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hfill", "vert", "padding" ],
                width: "auto"
            });
            if (2 == data[i].status && data[i].receiver_id == u_id) {
                var unread_data = model.getUnreadMessageByItemId(data[i].id, data[i].owner_id);
                var total = unread_data.total || 0;
                sub_message = total + " unread message";
                var label_item_name = $.UI.create("Label", {
                    classes: [ "h5", "wfill", "hsize" ],
                    textAlign: "left",
                    text: data[i].item_name
                });
                var label_number_unread = $.UI.create("Label", {
                    classes: [ "h6", "wfill", "hsize" ],
                    textAlign: "left",
                    text: sub_message
                });
                var label_status = $.UI.create("Label", {
                    classes: [ "h6", "wfill", "hsize" ],
                    textAlign: "left",
                    text: adopt_status_text[data[i].status]
                });
                view_info_box.add(label_item_name);
                view_info_box.add(label_number_unread);
                view_info_box.add(label_status);
                view_container.add(imageView_item_thumb);
                view_container.add(view_info_box);
                view_container.addEventListener("click", navToConversation);
            } else {
                var label_item_name = $.UI.create("Label", {
                    classes: [ "h5", "wfill", "hsize" ],
                    textAlign: "left",
                    text: data[i].item_name
                });
                var label_number_unread = $.UI.create("Label", {
                    classes: [ "h6", "wfill", "hsize" ],
                    textAlign: "left",
                    text: adopt_status_text[data[i].status]
                });
                view_info_box.add(label_item_name);
                view_info_box.add(label_number_unread);
                view_container.add(imageView_item_thumb);
                view_container.add(view_info_box);
            }
            tableviewrow.add(view_container);
            adopt_list.push(tableviewrow);
        }
        $.tblview.setEditable(true);
        $.tblview.setData(adopt_list);
    }
    function render_donate_list() {
        var model = Alloy.createCollection("items");
        data = model.getWaitingDataByOwner();
        var donate_list = [];
        var row_upload_item = $.UI.create("TableViewRow", {
            selectedBackgroundColor: "#75d0cb"
        });
        var view_upload_item = $.UI.create("View", {
            classes: [ "wfill", "horz" ],
            height: 70,
            horizontalWrap: false,
            backgroundColor: "#ffffff"
        });
        var image_camera = $.UI.create("ImageView", {
            image: "/images/icons/icon_take_photo_nobg.png",
            width: "20%",
            left: 20,
            top: 10,
            bottom: 10
        });
        var label_upload_item = $.UI.create("Label", {
            classes: [ "h5", "wfill", "hfill", "padding", "bold" ],
            textAlign: "center",
            text: "Donate your stuff here"
        });
        view_upload_item.add(image_camera);
        view_upload_item.add(label_upload_item);
        row_upload_item.add(view_upload_item);
        row_upload_item.addEventListener("click", navToPersonalUpload);
        donate_list.push(row_upload_item);
        for (var i = 0; i < data.length; i++) {
            var sub_message;
            console.log(data);
            if (2 == data[i].status) {
                var unread_data = model.getUnreadMessageByItemId(data[i].id, data[i].receiver_id);
                var total = unread_data.total || 0;
                sub_message = total + " unread message";
            } else {
                var total = data[i].total || 0;
                sub_message = total + " people interest on it";
            }
            console.log(donate_status_text[data[i].status] + " checking");
            var tableviewrow = $.UI.create("TableViewRow", {
                selectedBackgroundColor: "#75d0cb",
                item_id: data[i].id
            });
            var view_container = $.UI.create("View", {
                classes: [ "wfill", "horz" ],
                height: 70,
                backgroundColor: "#ffffff",
                item_id: data[i].id,
                f_id: data[i].receiver_id
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                width: 70,
                height: 70,
                defaultImage: "/images/default/small_item.png",
                image: data[i].img_path
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hfill", "vert", "padding" ],
                width: "auto"
            });
            var label_item_name = $.UI.create("Label", {
                classes: [ "h5", "wfill", "hsize" ],
                textAlign: "left",
                text: data[i].item_name
            });
            var label_number_unread = $.UI.create("Label", {
                classes: [ "h6", "wfill", "hsize" ],
                textAlign: "left",
                text: sub_message
            });
            var label_status = $.UI.create("Label", {
                classes: [ "h6", "wfill", "hsize" ],
                textAlign: "left",
                text: donate_status_text[data[i].status]
            });
            view_info_box.add(label_item_name);
            view_info_box.add(label_number_unread);
            view_info_box.add(label_status);
            view_container.add(imageView_item_thumb);
            view_container.add(view_info_box);
            tableviewrow.add(view_container);
            donate_list.push(tableviewrow);
            2 == data[i].status ? tableviewrow.addEventListener("click", navToConversation) : tableviewrow.addEventListener("click", navToWaitingList);
        }
        $.tblview.setEditable(true);
        $.tblview.setData(donate_list);
    }
    function getItemList(callback) {
        var checker = Alloy.createCollection("updateChecker");
        var isUpdate = checker.getCheckerById(1);
        var last_updated = isUpdate.updated || "";
        API.callByPost({
            url: "getItemListUrl",
            params: {
                last_updated: last_updated
            }
        }, function(responseText) {
            var model = Alloy.createCollection("items");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            model.saveArray(arr);
            checker.updateModule(1, "getItemList", Common.now());
            callback && callback();
        });
    }
    function getItemResponseList(callback) {
        var checker = Alloy.createCollection("updateChecker");
        var u_id = Ti.App.Properties.getString("user_id");
        var isUpdate = checker.getCheckerById(2, u_id);
        isUpdate.updated || "";
        API.callByPost({
            url: "getItemResponseByUidUrl",
            params: {
                last_updated: "",
                u_id: u_id
            }
        }, function(responseText) {
            var model = Alloy.createCollection("item_response");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            model.saveArray(arr);
            checker.updateModule(2, "getItemResponseByUid", Common.now(), u_id);
            callback && callback();
        });
    }
    function refresh() {
        loading.start();
        getItemList(function() {
            getItemResponseList(function() {
                render_table_view();
                loading.finish();
            });
        });
        return;
    }
    function doRemoveDonateItem(e) {
        var id = e.rowData.item_id;
        API.callByPost({
            url: "updateItemStatusUrl",
            params: {
                item_id: id,
                status: 4
            }
        }, function(response_text) {
            var res = JSON.parse(response_text);
            console.log(res);
            var model = Alloy.createCollection("items");
            if ("success" == res.status) {
                console.log(res.data);
                model.saveRecord(res.data);
            }
        });
    }
    function switchListing(e) {
        var tab = parent({
            name: "tab"
        }, e.source);
        var text = children({
            name: "v",
            value: "label"
        }, $.firstTab);
        var secondtext = children({
            name: "v",
            value: "label"
        }, $.secondTab);
        if (1 == tab) {
            current_tab = "donate";
            $.firstTab.backgroundColor = "#75d0cb";
            text.color = "#ffffff";
            $.secondTab.backgroundColor = "transparent";
            secondtext.color = "#75d0cb";
        } else if (2 == tab) {
            current_tab = "adopt";
            $.secondTab.backgroundColor = "#75d0cb";
            secondtext.color = "#ffffff";
            $.firstTab.backgroundColor = "transparent";
            text.color = "#75d0cb";
        }
        refresh();
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "manage_item";
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
        navTintColor: "#75d0cb",
        id: "win",
        title: "Items"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId49 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId49"
    });
    $.__views.win.add($.__views.__alloyId49);
    $.__views.__alloyId50 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId50"
    });
    $.__views.__alloyId49.add($.__views.__alloyId50);
    $.__views.__alloyId51 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        horizontalWrap: "false",
        borderColor: "#75d0cb",
        borderRadius: "5",
        id: "__alloyId51"
    });
    $.__views.__alloyId50.add($.__views.__alloyId51);
    $.__views.firstTab = Ti.UI.createView({
        id: "firstTab",
        tab: "1",
        backgroundColor: "#75d0cb",
        height: "40",
        width: "50%"
    });
    $.__views.__alloyId51.add($.__views.firstTab);
    switchListing ? $.addListener($.__views.firstTab, "click", switchListing) : __defers["$.__views.firstTab!click!switchListing"] = true;
    $.__views.__alloyId52 = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "DONATE",
        v: "label",
        top: "10",
        bottom: "10",
        textAlign: "center",
        id: "__alloyId52"
    });
    $.__views.firstTab.add($.__views.__alloyId52);
    $.__views.__alloyId53 = Ti.UI.createView({
        height: "40",
        width: "1",
        backgroundColor: "#75d0cb",
        id: "__alloyId53"
    });
    $.__views.__alloyId51.add($.__views.__alloyId53);
    $.__views.secondTab = Ti.UI.createView({
        tab: "2",
        id: "secondTab",
        height: "40",
        width: "50%"
    });
    $.__views.__alloyId51.add($.__views.secondTab);
    switchListing ? $.addListener($.__views.secondTab, "click", switchListing) : __defers["$.__views.secondTab!click!switchListing"] = true;
    $.__views.__alloyId54 = Ti.UI.createLabel({
        color: "#75d0cb",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "ADOPT",
        v: "label",
        top: "10",
        bottom: "10",
        textAlign: "center",
        id: "__alloyId54"
    });
    $.__views.secondTab.add($.__views.__alloyId54);
    $.__views.tblview = Ti.UI.createTableView({
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "tblview"
    });
    $.__views.__alloyId49.add($.__views.tblview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    var current_tab = "donate";
    var adopt_status_text = [ "", "This item is waiting to be selected.", "Item taken" ];
    var donate_status_text = [ "", "Waiting for picking", "User selected", "Item Removed", "Transaction Completed" ];
    init();
    Ti.App.addEventListener("manage_item:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("manage_item:refresh", refresh);
        $.destroy();
        console.log("window close");
    });
    __defers["$.__views.firstTab!click!switchListing"] && $.addListener($.__views.firstTab, "click", switchListing);
    __defers["$.__views.secondTab!click!switchListing"] && $.addListener($.__views.secondTab, "click", switchListing);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;