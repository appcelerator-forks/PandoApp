function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function next_loading() {
        console.log(counter + "next" + loadingList.length);
        if (counter >= loadingList.length) {
            console.log("app:loadingViewFinish");
            Ti.App.fireEvent("app:loadingViewFinish");
            return false;
        }
        var loader = loadingList[counter];
        counter++;
        var type = loader.type;
        if ("api" == type) API.loadAPIBySequence(); else if ("model" == type) {
            console.log(counter + " " + type);
            var model = Alloy.createCollection(loader.model);
            eval("model." + loader.func + "()");
        }
    }
    function update_loading_text(e) {
        $.loading_text.text = e.text;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "loader";
    this.args = arguments[0] || {};
    if (arguments[0]) {
        var __parentSymbol = __processArg(arguments[0], "__parentSymbol");
        var $model = __processArg(arguments[0], "$model");
        var __itemTemplate = __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.rocket = Ti.UI.createWindow({
        backgroundColor: "#C41230",
        titleAttributes: {
            color: "#ffffff"
        },
        navBarHidden: true,
        font: {
            fontFamily: "Lato-Regular"
        },
        theme: "Theme.NoActionBar",
        id: "rocket"
    });
    $.__views.rocket && $.addTopLevelView($.__views.rocket);
    $.__views.overlay = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        top: 0,
        left: 0,
        backgroundColor: "#C41230",
        id: "overlay"
    });
    $.__views.rocket.add($.__views.overlay);
    $.__views.rocketSmoke = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: 110,
        height: 130,
        opacity: 0,
        duration: .02,
        images: [ "/images/RocketSmoke/RocketSmoke01.png", "/images/RocketSmoke/RocketSmoke02.png", "/images/RocketSmoke/RocketSmoke03.png", "/images/RocketSmoke/RocketSmoke04.png", "/images/RocketSmoke/RocketSmoke05.png", "/images/RocketSmoke/RocketSmoke06.png", "/images/RocketSmoke/RocketSmoke07.png", "/images/RocketSmoke/RocketSmoke08.png", "/images/RocketSmoke/RocketSmoke09.png", "/images/RocketSmoke/RocketSmoke10.png", "/images/RocketSmoke/RocketSmoke11.png", "/images/RocketSmoke/RocketSmoke12.png", "/images/RocketSmoke/RocketSmoke13.png", "/images/RocketSmoke/RocketSmoke14.png", "/images/RocketSmoke/RocketSmoke15.png", "/images/RocketSmoke/RocketSmoke16.png", "/images/RocketSmoke/RocketSmoke17.png", "/images/RocketSmoke/RocketSmoke18.png", "/images/RocketSmoke/RocketSmoke19.png", "/images/RocketSmoke/RocketSmoke20.png", "/images/RocketSmoke/RocketSmoke21.png", "/images/RocketSmoke/RocketSmoke22.png", "/images/RocketSmoke/RocketSmoke23.png", "/images/RocketSmoke/RocketSmoke24.png", "/images/RocketSmoke/RocketSmoke25.png", "/images/RocketSmoke/RocketSmoke26.png", "/images/RocketSmoke/RocketSmoke27.png", "/images/RocketSmoke/RocketSmoke28.png", "/images/RocketSmoke/RocketSmoke29.png", "/images/RocketSmoke/RocketSmoke30.png", "/images/RocketSmoke/RocketSmoke31.png", "/images/RocketSmoke/RocketSmoke32.png", "/images/RocketSmoke/RocketSmoke33.png", "/images/RocketSmoke/RocketSmoke34.png", "/images/RocketSmoke/RocketSmoke35.png", "/images/RocketSmoke/RocketSmoke36.png", "/images/RocketSmoke/RocketSmoke37.png" ],
        id: "rocketSmoke"
    });
    $.__views.rocket.add($.__views.rocketSmoke);
    $.__views.rocketFlight = Ti.UI.createImageView({
        preventDefaultImage: true,
        width: 110,
        height: 130,
        opacity: 0,
        duration: .02,
        images: [ "/images/RocketFlight/RocketFlight01.png", "/images/RocketFlight/RocketFlight02.png", "/images/RocketFlight/RocketFlight03.png", "/images/RocketFlight/RocketFlight04.png", "/images/RocketFlight/RocketFlight05.png", "/images/RocketFlight/RocketFlight06.png", "/images/RocketFlight/RocketFlight07.png", "/images/RocketFlight/RocketFlight08.png", "/images/RocketFlight/RocketFlight09.png", "/images/RocketFlight/RocketFlight10.png", "/images/RocketFlight/RocketFlight11.png", "/images/RocketFlight/RocketFlight12.png", "/images/RocketFlight/RocketFlight13.png", "/images/RocketFlight/RocketFlight14.png", "/images/RocketFlight/RocketFlight15.png", "/images/RocketFlight/RocketFlight16.png", "/images/RocketFlight/RocketFlight17.png", "/images/RocketFlight/RocketFlight18.png", "/images/RocketFlight/RocketFlight19.png", "/images/RocketFlight/RocketFlight20.png", "/images/RocketFlight/RocketFlight21.png", "/images/RocketFlight/RocketFlight22.png", "/images/RocketFlight/RocketFlight23.png", "/images/RocketFlight/RocketFlight24.png", "/images/RocketFlight/RocketFlight25.png" ],
        id: "rocketFlight"
    });
    $.__views.rocket.add($.__views.rocketFlight);
    $.__views.loading_text = Ti.UI.createLabel({
        color: "#ffffff",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        font: {
            fontFamily: "Lato-Regular",
            fontSize: 12
        },
        id: "loading_text",
        bottom: "50"
    });
    $.__views.rocket.add($.__views.loading_text);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var counter = 0;
    var loadingList = [ {
        type: "api"
    }, {
        type: "model",
        model: "items",
        func: "calculate_distance"
    } ];
    $.start = function() {
        console.log("start");
        next_loading();
        $.rocketSmoke.opacity = .1;
        $.rocketFlight.opacity = 0;
        $.rocketFlight.top = null;
        $.rocketFlight.stop();
        $.rocketSmoke.start();
        $.overlay.animate({
            opacity: .7,
            duration: 250
        });
        $.rocketSmoke.animate({
            opacity: 1,
            duration: 500
        });
    };
    $.finish = function(_callback) {
        console.log("b");
        $.rocketSmoke.stop();
        _callback && _callback();
        return;
    };
    Ti.App.addEventListener("app:update_loading_text", update_loading_text);
    Ti.App.addEventListener("app:next_loading", next_loading);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;