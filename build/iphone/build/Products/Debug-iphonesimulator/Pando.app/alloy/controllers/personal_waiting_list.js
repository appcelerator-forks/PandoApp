function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function navToWaiting_List_Detail(e) {
        var item_response_id = parent({
            name: "item_response_id"
        }, e.source);
        Alloy.Globals.Navigator.open("personal_waiting_list_detail", {
            id: item_response_id
        });
    }
    function render_table_view() {
        var items_response_model = Alloy.createCollection("item_response");
        var data = items_response_model.getData(item_id);
        console.log(item_id + " at personal_waiting_list");
        console.log(data);
        var waiting_list = [];
        for (var i = 0; i < data.length; i++) {
            var tableviewrow = $.UI.create("TableViewRow", {
                selectedBackgroundColor: "#75d0cb"
            });
            var view_container = $.UI.create("View", {
                classes: [ "wfill", "horz" ],
                height: 70,
                backgroundColor: "#ffffff",
                item_response_id: data[i].id
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                width: 70,
                height: 70,
                defaultImage: "/images/default/small_item.png",
                image: data[i].requestor_img_path
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hfill", "vert", "padding" ],
                width: "auto"
            });
            var label_item_name = $.UI.create("Label", {
                classes: [ "h5", "wfill", "hsize" ],
                textAlign: "left",
                text: data[i].requestor_name
            });
            var label_number_unread = $.UI.create("Label", {
                classes: [ "h6", "wfill", "hsize" ],
                textAlign: "left",
                text: "Point: " + data[i].point
            });
            view_info_box.add(label_item_name);
            view_info_box.add(label_number_unread);
            view_container.add(imageView_item_thumb);
            view_container.add(view_info_box);
            view_container.addEventListener("click", navToWaiting_List_Detail);
            tableviewrow.add(view_container);
            waiting_list.push(tableviewrow);
        }
        $.tblview.setEditable(true);
        $.tblview.setData(waiting_list);
    }
    function refresh() {
        loading.start();
        render_table_view();
        loading.finish();
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "personal_waiting_list";
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
        barColor: "#323136",
        id: "win",
        title: "Waiting List"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId63 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        backgroundColor: "#F2F4F5",
        id: "__alloyId63"
    });
    $.__views.win.add($.__views.__alloyId63);
    $.__views.tblview = Ti.UI.createTableView({
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "tblview"
    });
    $.__views.__alloyId63.add($.__views.tblview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var loading = Alloy.createController("loading");
    var item_id = args.id;
    init();
    $.win.addEventListener("close", function() {
        $.destroy();
        console.log("window close");
        Ti.App.fireEvent("manage_item:refresh");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;