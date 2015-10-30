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
        update || (my_timer = new countDown(0, 0, function() {
            $.time.text = my_timer.time.m + ":" + my_timer.time.s;
        }, function() {
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
    function refreshLife() {
        var ObjDate = new Date();
        var now = Math.floor(ObjDate.getTime() / 1e3);
        var sec_left = estimate_time - now - 1;
        var life_in_waiting = Math.ceil(sec_left / waiting_time);
        lives = life_in_waiting >= 0 ? 5 - life_in_waiting : 5;
        $.life.text = lives;
    }
    function animation(item, callback) {
        var animation = Titanium.UI.createAnimation({
            opacity: 0,
            duration: 500
        });
        item.animate(animation);
        animation.addEventListener("complete", function() {
            console.log("call");
            callback && callback();
        });
        return;
    }
    function navTo(e) {
        "undefined" != typeof e.source.controller && Alloy.Globals.Navigator.open(e.source.controller);
    }
    function get_point() {
        var user_model = Alloy.createCollection("user");
        var item_response_model = Alloy.createCollection("item_response");
        var up = user_model.getPoint();
        var sp = item_response_model.getSpendPoint();
        console.log(up + "-" + sp);
        user_point = up - sp;
        $.point.text = user_point;
        console.log("latest point from d" + user_point);
    }
    function checkpoint(p) {
        return user_point >= p ? true : false;
    }
    function callback_yes() {
        if (!items.counter) {
            Common.createAlert("Message", "No more item. Please try again later");
            return;
        }
        if (!lives) {
            Common.createAlert("Message", "No more lives. Please try again later");
            return;
        }
        Common.dialogTextfield(function(p) {
            console.log("user point before check point" + user_point);
            if (!checkpoint(p)) {
                Common.createAlert("Message", "Not enough point. Please try again later");
                return;
            }
            if (!p) {
                Common.createAlert("Message", "Please insert your bid amount.");
                return;
            }
            point = p || 0;
            lives -= 1;
            Ti.App.Properties.setString("lives", lives);
            $.life.text = lives;
            var ObjDate = new Date();
            var now = Math.floor(ObjDate.getTime() / 1e3) + 1;
            estimate_time = now > estimate_time ? parseInt(now) + waiting_time : parseInt(estimate_time) + waiting_time;
            Ti.App.Properties.setString("estimate_time", estimate_time);
            timer(1);
            sound_yes.play();
            refreshLife();
            item.ItemRemove(1);
            item.insetItem();
        });
    }
    function callback_no() {
        point = 0;
        if (!items.counter) {
            Common.createAlert("Message", "No more item. Please try again later");
            return;
        }
        if (!lives) {
            Common.createAlert("Message", "No more lives. Please try again later");
            return;
        }
        sound_no.play();
        item.ItemRemove(2);
        console.log("insert");
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
        console.log("c");
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
        $.left_right_button.removeAllChildren();
        var left_right = Alloy.createController("_left_right");
        var label_desc = "Swipe left or right to select";
        left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
    }
    function refresh() {
        get_point();
        loading.start();
        getItemList(function() {
            getItemResponseList(function() {
                var model = Alloy.createCollection("items");
                data = model.getData();
                console.log(data.length);
                item = new items(data.length);
                item.init();
                loading.finish();
            });
        });
    }
    function init() {
        $.win.add(loading.getView());
        refreshLife();
        get_point();
        $.life.text = lives;
        timer();
        var left_right = Alloy.createController("_left_right");
        var label_desc = "Swipe left or right to select";
        left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
        var rect = $.label_no_more.rect;
        console.log(rect.width);
        $.label_no_more.height = rect.width;
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
        backgroundColor: "#E4E6E1",
        titleAttributes: {
            color: "#eaebe6"
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
    $.__views.__alloyId19 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        id: "__alloyId19"
    });
    $.__views.win.add($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        backgroundImage: "/images/bg/menu_bar.png",
        id: "__alloyId20"
    });
    $.__views.__alloyId19.add($.__views.__alloyId20);
    $.__views.__alloyId21 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: "20",
        left: "10",
        right: 10,
        bottom: "20",
        height: "40",
        width: "40",
        image: "/images/icons/icon_referesh.png",
        id: "__alloyId21"
    });
    $.__views.__alloyId20.add($.__views.__alloyId21);
    refresh ? $.addListener($.__views.__alloyId21, "click", refresh) : __defers["$.__views.__alloyId21!click!refresh"] = true;
    $.__views.__alloyId22 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        right: "0",
        top: "10",
        id: "__alloyId22"
    });
    $.__views.__alloyId20.add($.__views.__alloyId22);
    $.__views.__alloyId23 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: "20",
        controller: "friends",
        height: "40",
        width: "40",
        image: "/images/icons/icon_friends.png",
        id: "__alloyId23"
    });
    $.__views.__alloyId22.add($.__views.__alloyId23);
    navTo ? $.addListener($.__views.__alloyId23, "click", navTo) : __defers["$.__views.__alloyId23!click!navTo"] = true;
    $.__views.__alloyId24 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: "20",
        controller: "personal",
        height: "40",
        width: "40",
        image: "/images/icons/icon_upload.png",
        id: "__alloyId24"
    });
    $.__views.__alloyId22.add($.__views.__alloyId24);
    navTo ? $.addListener($.__views.__alloyId24, "click", navTo) : __defers["$.__views.__alloyId24!click!navTo"] = true;
    $.__views.__alloyId25 = Ti.UI.createImageView({
        preventDefaultImage: true,
        top: 10,
        left: 10,
        right: 10,
        bottom: "20",
        controller: "setting",
        height: "40",
        width: "40",
        image: "/images/icons/icon_setting.png",
        id: "__alloyId25"
    });
    $.__views.__alloyId22.add($.__views.__alloyId25);
    navTo ? $.addListener($.__views.__alloyId25, "click", navTo) : __defers["$.__views.__alloyId25!click!navTo"] = true;
    $.__views.__alloyId26 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        contentHeight: Ti.UI.SIZE,
        contentWidth: Ti.UI.FILL,
        id: "__alloyId26"
    });
    $.__views.__alloyId19.add($.__views.__alloyId26);
    $.__views.__alloyId27 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId27"
    });
    $.__views.__alloyId26.add($.__views.__alloyId27);
    $.__views.__alloyId28 = Ti.UI.createView({
        layout: "horizontal",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        borderColor: "#d2d3ce",
        backgroundColor: "#fff",
        left: "10",
        right: "10",
        bottom: "10",
        id: "__alloyId28"
    });
    $.__views.__alloyId27.add($.__views.__alloyId28);
    $.__views.__alloyId29 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        width: "60",
        id: "__alloyId29"
    });
    $.__views.__alloyId28.add($.__views.__alloyId29);
    $.__views.__alloyId30 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "LIFE",
        left: "0",
        textAlign: "right",
        id: "__alloyId30"
    });
    $.__views.__alloyId29.add($.__views.__alloyId30);
    $.__views.life = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 30
        },
        text: "0",
        id: "life"
    });
    $.__views.__alloyId29.add($.__views.life);
    $.__views.__alloyId31 = Ti.UI.createView({
        width: "1",
        height: "50",
        backgroundColor: "#d2d3ce",
        id: "__alloyId31"
    });
    $.__views.__alloyId28.add($.__views.__alloyId31);
    $.__views.__alloyId32 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        width: "120",
        id: "__alloyId32"
    });
    $.__views.__alloyId28.add($.__views.__alloyId32);
    $.__views.__alloyId33 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "TIME",
        left: "0",
        textAlign: "right",
        id: "__alloyId33"
    });
    $.__views.__alloyId32.add($.__views.__alloyId33);
    $.__views.time = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 30
        },
        text: "00:00",
        id: "time"
    });
    $.__views.__alloyId32.add($.__views.time);
    $.__views.__alloyId34 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        borderColor: "#d2d3ce",
        backgroundColor: "#fff",
        width: "auto",
        right: "10",
        bottom: "10",
        id: "__alloyId34"
    });
    $.__views.__alloyId27.add($.__views.__alloyId34);
    $.__views.__alloyId35 = Ti.UI.createView({
        layout: "vertical",
        height: Ti.UI.SIZE,
        top: 5,
        left: 5,
        right: 5,
        bottom: 5,
        id: "__alloyId35"
    });
    $.__views.__alloyId34.add($.__views.__alloyId35);
    $.__views.__alloyId36 = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "POINT",
        left: "0",
        textAlign: "right",
        id: "__alloyId36"
    });
    $.__views.__alloyId35.add($.__views.__alloyId36);
    $.__views.point = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Light",
            fontSize: 30
        },
        id: "point"
    });
    $.__views.__alloyId35.add($.__views.point);
    $.__views.__alloyId37 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: "0",
        borderColor: "#d2d3ce",
        backgroundColor: "#f6f6f6",
        id: "__alloyId37"
    });
    $.__views.__alloyId26.add($.__views.__alloyId37);
    $.__views.__alloyId38 = Ti.UI.createView({
        layout: "vertical",
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "__alloyId38"
    });
    $.__views.__alloyId37.add($.__views.__alloyId38);
    $.__views.indicator = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        id: "indicator"
    });
    $.__views.__alloyId37.add($.__views.indicator);
    $.__views.label_no_more = Ti.UI.createLabel({
        color: "#2a363a",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        text: "No more Item",
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
    $.__views.__alloyId37.add($.__views.left_right_button);
    $.__views.__alloyId39 = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: Ti.UI.FILL,
        height: Ti.UI.SIZE,
        top: "0",
        left: 10,
        right: 10,
        bottom: 10,
        image: "/images/shadow.png",
        id: "__alloyId39"
    });
    $.__views.__alloyId26.add($.__views.__alloyId39);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var loading = Alloy.createController("loading");
    var ObjDate = new Date();
    var lives = Ti.App.Properties.getString("lives") || 5;
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
                    $.item_container.children[0].addEventListener("postlayout", function() {
                        var rect = $.item_container.children[0].rect;
                        $.label_no_more.height = rect.height;
                    });
                } else {
                    var rect = $.item_container.rect;
                    console.log(rect.width);
                    var view = $.UI.create("ImageView", {
                        classes: [ "box" ],
                        width: rect.width,
                        height: rect.width,
                        image: "/images/default/item.png"
                    });
                    $.item_container.add(view);
                }
                return this;
            },
            insetItem: function() {
                if (this.counter) {
                    var item_data = data[this.counter - 1];
                    var view_container = $.UI.create("View", {
                        id: item_data.id,
                        owner_id: item_data.owner_id,
                        classes: [ "wfill", "hsize" ]
                    });
                    console.log(item_data.item_name);
                    var label_item_name = $.UI.create("Label", {
                        classes: [ "wfill", "hsize", "padding" ],
                        text: item_data.item_name,
                        color: "#ffffff"
                    });
                    var view_item_name = $.UI.create("View", {
                        top: 0,
                        classes: [ "wfill", "hsize", "shadow" ],
                        zIndex: 10
                    });
                    var imgview = $.UI.create("ImageView", {
                        zIndex: this.counter,
                        classes: [ "wfill" ],
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
                } else console.log("no more");
                return this;
            },
            ItemRemove: function(action) {
                1 != $.item_container.children[0].zIndex;
                var u_id = Ti.App.Properties.getString("user_id");
                var item_upload = $.item_container.children[0];
                API.callByPost({
                    url: "addToItemResponseUrl",
                    params: {
                        point: point,
                        item_id: item_upload.id,
                        owner_id: item_upload.owner_id,
                        requestor_id: u_id,
                        actions: action
                    }
                }, function(response_text) {
                    var res = JSON.parse(response_text);
                    var model = Alloy.createCollection("item_response");
                    if ("success" == res.status) {
                        console.log("item response save");
                        console.log(res.data);
                        model.saveRecord(res.data);
                        get_point();
                    }
                });
                animation($.item_container.children[0], function() {
                    var model = Alloy.createCollection("user_items");
                    model.markRead({
                        id: $.item_container.children[0].id,
                        action: action
                    });
                    $.item_container.remove($.item_container.children[0]);
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
        console.log("window close");
    });
    __defers["$.__views.__alloyId21!click!refresh"] && $.addListener($.__views.__alloyId21, "click", refresh);
    __defers["$.__views.__alloyId23!click!navTo"] && $.addListener($.__views.__alloyId23, "click", navTo);
    __defers["$.__views.__alloyId24!click!navTo"] && $.addListener($.__views.__alloyId24, "click", navTo);
    __defers["$.__views.__alloyId25!click!navTo"] && $.addListener($.__views.__alloyId25, "click", navTo);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;