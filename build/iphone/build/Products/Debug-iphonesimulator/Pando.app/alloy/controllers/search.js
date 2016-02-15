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
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            var view_container = $.UI.create("View", {
                classes: [ "hsize" ],
                width: "50%",
                backgroundColor: "#ffffff",
                item_category: data[i].c_name
            });
            var imageView_item_thumb = $.UI.create("ImageView", {
                classes: [ "wfill" ],
                height: "auto",
                defaultImage: "/images/default/item.png",
                image: data[i].img_path || "/images/default/item.png"
            });
            var view_info_box = $.UI.create("View", {
                classes: [ "hsize", "wfill" ],
                top: 0,
                backgroundImage: "/images/bg/bg_matt_2.png"
            });
            var label_item_name = $.UI.create("Label", {
                classes: [ "h5", "wfill", "hsize", "padding" ],
                textAlign: "left",
                color: "#fff",
                text: data[i].c_name
            });
            view_info_box.add(label_item_name);
            view_container.add(imageView_item_thumb);
            view_container.add(view_info_box);
            view_container.addEventListener("click", setFilter);
            $.inner_box.add(view_container);
        }
    }
    function setFilter(e) {
        var category_type = parent({
            name: "item_category"
        }, e.source);
        console.log(category_type);
        Ti.App.Properties.setString("category_type", category_type);
        Ti.App.fireEvent("home:refresh");
        closeWindow();
    }
    function doSearch(e) {
        Ti.App.Properties.setString("category_keyword", e.value);
        Ti.App.fireEvent("home:refresh");
        closeWindow();
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
    function closeWindow() {
        $.win.close();
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
    $.__views.searchbar = Ti.UI.createSearchBar({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "searchbar",
        hintText: "I'm looking for",
        showCancel: "true"
    });
    $.__views.__alloyId74.add($.__views.searchbar);
    $.__views.inner_box = Ti.UI.createScrollView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "inner_box"
    });
    $.__views.__alloyId74.add($.__views.inner_box);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    init();
    $.searchbar.addEventListener("return", doSearch);
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