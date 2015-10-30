function openWindow(win) {
    if ("android" == Ti.Platform.osname) win.open(); else {
        var nav = Alloy.Globals.navMenu;
        nav.openWindow(win, {
            animated: true
        });
    }
}

function removeAllChildren(viewObject) {
    var children = viewObject.children.slice(0);
    for (var i = 0; i < children.length; ++i) viewObject.remove(children[i]);
}

function dialogTextfield(callback) {
    var textfield = Ti.UI.createTextField();
    var dialog = Ti.UI.createAlertDialog({
        title: "Enter Point",
        androidView: textfield,
        style: Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT,
        buttonNames: [ "OK", "cancel" ]
    });
    dialog.addEventListener("click", function(e) {
        var point = e.text;
        console.log("bidding point" + point);
        callback(point);
    });
    dialog.show();
}

function createAlert(tt, msg, callback) {
    var box = Titanium.UI.createAlertDialog({
        title: tt,
        ok: "OK",
        message: msg
    });
    box.show();
    box.addEventListener("click", function(e) {
        console.log(e.index + " " + e.source.ok);
        if (0 == e.index) {
            console.log(typeof callback);
            "function" == typeof callback && callback && callback();
        }
    });
}

var mainView = null;

exports.construct = function(mv) {
    mainView = mv;
};

exports.deconstruct = function() {
    mainView = null;
};

exports.closeWindow = function(win) {
    if ("android" == Ti.Platform.osname) win.close(); else {
        var nav = Alloy.Globals.navMenu;
        nav.closeWindow(win, {
            animated: true
        });
    }
};

exports.openWindow = _.throttle(openWindow, 500, true);

exports.removeAllChildren = _.debounce(removeAllChildren, 0, true);

exports.createAlert = _.throttle(createAlert, 500, true);

exports.dialogTextfield = _.throttle(dialogTextfield, 500, true);

exports.now = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var sec = today.getSeconds();
    10 > minutes && (minutes = "0" + minutes);
    10 > sec && (sec = "0" + sec);
    10 > dd && (dd = "0" + dd);
    10 > mm && (mm = "0" + mm);
    datetime = yyyy + "-" + mm + "-" + dd + " " + hours + ":" + minutes + ":" + sec;
    return datetime;
};