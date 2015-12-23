function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function render_category_menu() {
        var model = Alloy.createCollection("category");
        data = model.getData();
        var category_list = [];
        for (var i = 0; i < data.length; i++) {
            var tableviewrow = $.UI.create("TableViewRow", {});
            var view_container = $.UI.create("View", {
                classes: [ "wfill", "horz" ],
                height: 70,
                backgroundColor: "#ffffff",
                item_response_id: data[i].c_id
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
                text: data[i].c_name
            });
            view_info_box.add(label_item_name);
            view_container.add(imageView_item_thumb);
            view_container.add(view_info_box);
            tableviewrow.add(view_container);
            category_list.push(tableviewrow);
        }
        $.tblview.setData(category_list);
    }
    function getCategory(callback) {
        var checker = Alloy.createCollection("updateChecker");
        var isUpdate = checker.getCheckerById(4);
        var last_updated = isUpdate.updated || "";
        API.callByPost({
            url: "getCategoryListUrl",
            params: {
                last_updated: last_updated
            }
        }, function(responseText) {
            var model = Alloy.createCollection("category");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            model.saveArray(arr);
            checker.updateModule(4, "getCategoryList", Common.now());
            callback && callback();
        });
    }
    function refresh() {
        loading.start();
        getCategory(function() {
            render_category_menu();
            loading.finish();
        });
        return;
    }
    function init() {
        $.win.add(loading.getView());
        refresh();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "search";
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
        navTintColor: "#75d0cb",
        id: "win",
        title: "Search"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId74 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId74"
    });
    $.__views.win.add($.__views.__alloyId74);
    $.__views.tblview = Ti.UI.createTableView({
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "tblview"
    });
    $.__views.__alloyId74.add($.__views.tblview);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    init();
    Ti.App.addEventListener("search:refresh", refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("search:refresh", refresh);
        $.destroy();
        console.log("window close");
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;