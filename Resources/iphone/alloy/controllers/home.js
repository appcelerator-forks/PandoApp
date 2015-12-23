function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function timer(update) {
        update || (my_timer = new countDown(0, 0, function() {}, function() {
            5 > lives && timer();
            refreshLife();
        }));
        var ObjDate = new Date();
        var now = Math.floor(ObjDate.getTime() / 1e3) + 1;
        var sec_left = estimate_time - now;
        sec_left = Math.floor(sec_left % waiting_time);
        if (sec_left > 0) {
            var minutes = Math.floor(sec_left / 60);
            var seconds = Math.floor(sec_left - 60 * minutes);
            my_timer.set(minutes, seconds);
        }
        my_timer.running || my_timer.start();
    }
    function animation(item, callback) {
        var animation = Titanium.UI.createAnimation({
            opacity: 0,
            duration: 500
        });
        item.animate(animation);
        animation.addEventListener("complete", function() {
            callback && callback();
        });
        return;
    }
    function render_structure() {
        var pwidth = Ti.Platform.displayCaps.platformWidth;
        $.left_right_button.top = pwidth + 40;
    }
    function navTo(e) {
        "undefined" != typeof e.source.controller && Alloy.Globals.Navigator.open(e.source.controller);
    }
    function get_point() {
        var user_model = Alloy.createCollection("user");
        var item_response_model = Alloy.createCollection("item_response");
        var up = user_model.getPoint();
        var sp = item_response_model.getSpendPoint();
        user_point = up - sp;
        $.point.text = user_point;
    }
    function checkpoint(p) {
        return user_point >= p ? true : false;
    }
    function callback_yes(view) {
        Common.dialogTextfield(function(p) {
            if (!checkpoint(p)) {
                Common.createAlert("Message", "Not enough point. Please try again later");
                return;
            }
            if (!p) {
                Common.createAlert("Message", "Please insert your bid amount.");
                return;
            }
            point = p || 0;
            var ObjDate = new Date();
            var now = Math.floor(ObjDate.getTime() / 1e3) + 1;
            estimate_time = now > estimate_time ? parseInt(now) + waiting_time : parseInt(estimate_time) + waiting_time;
            Ti.App.Properties.setString("estimate_time", estimate_time);
            timer(1);
            sound_yes.play();
            item.ItemRemove(1, view);
            item.insetItem();
        });
    }
    function callback_no(view) {
        point = 0;
        sound_no.play();
        item.ItemRemove(2, view);
        item.insetItem();
    }
    function getItemList(callback) {
        var checker = Alloy.createCollection("updateChecker");
        var isUpdate = checker.getCheckerById(1);
        isUpdate.updated || "";
        API.callByPost({
            url: "getItemListUrl",
            params: {
                last_updated: ""
            }
        }, function(responseText) {
            var model = Alloy.createCollection("items");
            var res = JSON.parse(responseText);
            var arr = res.data || null;
            model.saveArray(arr);
            checker.updateModule(1, "items", Common.now());
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
            checker.updateModule(2, "item_response", Common.now(), u_id);
            callback && callback();
        });
    }
    function leftright_refresh() {
        Alloy.createController("_left_right");
    }
    function refresh() {
        get_point();
        loading.start();
        getItemList(function() {
            getItemResponseList(function() {
                var model = Alloy.createCollection("items");
                data = model.getData();
                item = new items(data.length);
                item.init();
                loading.finish();
            });
        });
    }
    function init() {
        $.win.add(loading.getView());
        get_point();
        render_structure();
        var left_right = Alloy.createController("_left_right");
        left_right.generate_button_old($.left_right_button);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home";
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
        navBarHidden: "true",
        font: {
            fontFamily: "Lato-Regular"
        },
        id: "win",
        theme: "Theme.NoActionBar",
        title: "Home",
        fullscreen: "false"
    });
    $.__views.win && $.addTopLevelView($.__views.win);
    $.__views.__alloyId18 = Ti.UI.createView({
        width: Ti.UI.SIZE,
        backgroundColor: "orange",
        id: "__alloyId18"
    });
    $.__views.win.add($.__views.__alloyId18);
    $.__views.__alloyId19 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        zIndex: "10",
        top: "0",
        backgroundImage: "/images/bg/menu_bar.png",
        id: "__alloyId19"
    });
    $.__views.__alloyId18.add($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        right: "0",
        top: "10",
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.__alloyId21 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        controller: "search",
        height: "40",
        width: "40",
        image: "/images/icons/icon_search.png",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    navTo ? $.addListener($.__views.__alloyId21, "click", navTo) : __defers["$.__views.__alloyId21!click!navTo"] = true;
    $.__views.__alloyId22 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        controller: "manage_item",
        height: "40",
        width: "40",
        image: "/images/icons/icon_plus.png",
        id: "__alloyId22"
    });
    $.__views.__alloyId20.add($.__views.__alloyId22);
    navTo ? $.addListener($.__views.__alloyId22, "click", navTo) : __defers["$.__views.__alloyId22!click!navTo"] = true;
    $.__views.__alloyId23 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
        controller: "setting",
        height: "40",
        width: "40",
        image: "/images/icons/icon_more.png",
        id: "__alloyId23"
    });
    $.__views.__alloyId20.add($.__views.__alloyId23);
    navTo ? $.addListener($.__views.__alloyId23, "click", navTo) : __defers["$.__views.__alloyId23!click!navTo"] = true;
    $.__views.__alloyId24 = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.FILL,
        top: "60",
        id: "__alloyId24"
    });
    $.__views.__alloyId18.add($.__views.__alloyId24);
    $.__views.__alloyId25 = Ti.UI.createView({
        height: "80",
        borderColor: "#323136",
        backgroundColor: "#fff",
        zIndex: "10",
        borderRadius: "40",
        borderWidth: "4",
        width: "80",
        right: "10",
        top: "10",
        id: "__alloyId25"
    });
    $.__views.__alloyId24.add($.__views.__alloyId25);
    $.__views.__alloyId26 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        id: "__alloyId26"
    });
    $.__views.__alloyId25.add($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "POINT",
        top: "5",
        textAlign: "center",
        id: "__alloyId27"
    });
    $.__views.__alloyId26.add($.__views.__alloyId27);
    $.__views.point = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 30
        },
        id: "point",
        textAlign: "center"
    });
    $.__views.__alloyId26.add($.__views.point);
    $.__views.__alloyId28 = Ti.UI.createView({
        width: Ti.UI.SIZE,
        height: Ti.UI.FILL,
        top: "0",
        id: "__alloyId28"
    });
    $.__views.__alloyId24.add($.__views.__alloyId28);
    $.__views.item_container = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "item_container",
        top: "0",
        zIndex: "10"
    });
    $.__views.__alloyId28.add($.__views.item_container);
    $.__views.left_right_button = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        id: "left_right_button",
        bottom: "0",
        horizontalWrap: "false",
        backgroundColor: "#ebebeb"
    });
    $.__views.__alloyId28.add($.__views.left_right_button);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    var ObjDate = new Date();
    var estimate_time = Ti.App.Properties.getString("estimate_time") || ObjDate.getTime() / 1e3;
    var waiting_time = 20;
    var sound_no = Ti.Media.createSound({
        url: "/sound/bloop_x.wav"
    });
    var sound_yes = Ti.Media.createSound({
        url: "/sound/game-sound-correct.wav"
    });
    Alloy.createCollection("item_response");
    var items = Alloy.createCollection("items");
    Alloy.createCollection("message");
    var data = items.getData();
    var my_timer;
    var item;
    var point = 0;
    var user_point = 0;
    var countDown = function(m, s, fn_tick, fn_end) {
        return {
            total_sec: 60 * m + s,
            timer: this.timer,
            running: false,
            set: function(m, s) {
                this.total_sec = 60 * parseInt(m) + parseInt(s);
                this.time = {
                    m: m,
                    s: s
                };
                return this;
            },
            start: function() {
                var self = this;
                this.running = true;
                this.timer = setInterval(function() {
                    if (self.total_sec) {
                        self.total_sec--;
                        var minutes = parseInt(self.total_sec / 60);
                        var sec = self.total_sec % 60;
                        10 > minutes && (minutes = "0" + minutes);
                        10 > sec && (sec = "0" + sec);
                        self.time = {
                            m: minutes,
                            s: sec
                        };
                        fn_tick();
                    } else {
                        self.stop();
                        fn_end();
                    }
                }, 1e3);
                return this;
            },
            stop: function() {
                clearInterval(this.timer);
                this.running = false;
                this.time = {
                    m: 0,
                    s: 0
                };
                this.total_sec = 0;
                return this;
            }
        };
    };
    var items = function(counter) {
        return {
            counter: counter,
            set: function(counter) {
                this.counter = parseInt(counter);
                return this;
            },
            init: function() {
                console.log("total items number: " + this.counter);
                if (this.counter) {
                    $.item_container.removeAllChildren();
                    this.insetItem();
                    this.insetItem();
                } else {
                    var rect = $.item_container.rect;
                    var view = $.UI.create("ImageView", {
                        width: rect.width,
                        height: rect.width,
                        backgroundColor: "#75d0cb",
                        image: "/images/default/item.png"
                    });
                    $.item_container.add(view);
                }
                return this;
            },
            insetItem: function() {
                if (this.counter) {
                    var pwidth = Ti.Platform.displayCaps.platformWidth;
                    var item_data = data[this.counter - 1];
                    var view_container = $.UI.create("View", {
                        id: item_data.id,
                        isParent: "yes",
                        top: 0,
                        zIndex: this.counter,
                        width: pwidth,
                        labelname: item_data.item_name,
                        owner_id: item_data.owner_id,
                        classes: [ "hsize", "vert" ]
                    });
                    var label_item_name = $.UI.create("Label", {
                        classes: [ "wfill", "hfill", "padding" ],
                        text: item_data.item_name,
                        color: "#ffffff"
                    });
                    var view_item_name = $.UI.create("View", {
                        top: 0,
                        classes: [ "wfill", "shadow" ],
                        backgroundColor: "#323136",
                        height: 40,
                        zIndex: 10
                    });
                    var imgview = $.UI.create("ImageView", {
                        zIndex: this.counter,
                        width: pwidth,
                        height: "auto",
                        id: item_data.id,
                        owner_id: item_data.owner_id,
                        item_name: item_data.item_name,
                        owner_name: item_data.owner_name,
                        owner_img_path: item_data.owner_img_path,
                        image: item_data.img_path,
                        defaultImage: "/images/default/item.png",
                        zIndex: 1
                    });
                    view_item_name.add(label_item_name);
                    view_container.add(imgview);
                    view_container.add(view_item_name);
                    this.counter--;
                    $.item_container.add(view_container);
                    var left_right = Alloy.createController("_left_right");
                    left_right.add_event(view_container, callback_yes, callback_no);
                } else console.log("no more");
                return this;
            },
            ItemRemove: function(action, item_image) {
                console.log($.item_container.children.length + " number of children");
                for (var i = 0; i < $.item_container.children.length; i++) console.log($.item_container.children[i].labelname);
                console.log(item_image);
                console.log(item_image.labelname);
                animation(item_image, function() {
                    console.log("removed");
                    $.item_container.remove(item_image);
                    console.log($.item_container.children.length + " number of children");
                });
            },
            displayCurrentItemInfo: function(index) {
                index = index || 0;
                var item_name = $.item_container.children[index].item_name;
                var owner_name = $.item_container.children[index].owner_name;
                var owner_img_path = $.item_container.children[index].owner_img_path;
                $.item_name.text = item_name;
                $.owner_name.text = owner_name;
                $.owner_img_path.image = owner_img_path;
            },
            resetCurrentItemInfo: function() {
                $.item_name.text = "";
                $.owner_name.text = "";
                $.owner_img_path.image = "";
            }
        };
    };
    init();
    Ti.App.addEventListener("home:refresh", refresh);
    Ti.App.addEventListener("home:leftright_refresh", leftright_refresh);
    $.win.addEventListener("close", function() {
        Ti.App.removeEventListener("home:refresh", refresh);
        $.destroy();
    });
    __defers["$.__views.__alloyId21!click!navTo"] && $.addListener($.__views.__alloyId21, "click", navTo);
    __defers["$.__views.__alloyId22!click!navTo"] && $.addListener($.__views.__alloyId22, "click", navTo);
    __defers["$.__views.__alloyId23!click!navTo"] && $.addListener($.__views.__alloyId23, "click", navTo);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;