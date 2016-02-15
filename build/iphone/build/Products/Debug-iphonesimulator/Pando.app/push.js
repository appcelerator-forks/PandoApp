function getNotificationNumber(payload) {
    console.log(payload);
}

function receivePush(e) {
    console.log(e);
    console.log("receive push");
    console.log(e.data.target);
    if ("friends" == e.data.target) {
        {
            ({
                u_id: e.data.f_id,
                to_id: e.data.u_id,
                message: e.data.alert,
                item_id: e.data.item_id,
                type: "text"
            });
        }
        {
            Alloy.createCollection("message");
        }
        console.log(redirect + " want to see true or false");
        if (redirect) {
            Alloy.Globals.Navigator.closeAll();
            Alloy.Globals.Navigator.open("conversation", {
                f_id: e.data.f_id,
                id: e.data.item_id
            });
        } else {
            Ti.App.fireEvent("friends:refresh");
            Ti.App.fireEvent("conversation:refresh");
        }
    } else if ("pairing_success" == e.data.target) if (redirect) {
        Alloy.Globals.Navigator.closeAll();
        Alloy.Globals.Navigator.open("conversation", {
            f_id: e.data.f_id,
            id: e.data.item_id
        });
    } else {
        Common.createAlert("Notification", "Item pairing is successful.");
        Ti.App.fireEvent("friends:refresh");
        Ti.App.fireEvent("conversation:refresh");
    }
    return false;
}

function deviceTokenSuccess(ex) {
    deviceToken = ex.deviceToken;
    Cloud.Users.login({
        login: "pando",
        password: "123456"
    }, function(e) {
        e.success && Cloud.PushNotifications.subscribe({
            channel: "general",
            type: "ios",
            device_token: deviceToken
        }, function(e) {
            console.log(e);
            if (e.success) {
                console.log(deviceToken + "push");
                Ti.App.Properties.setString("deviceToken", deviceToken);
                API.updateNotificationToken();
            } else registerPush();
        });
    });
}

function deviceTokenError(e) {
    alert("Failed to register for push notifications! " + e.error);
}

function registerPush() {
    if (true && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
        Ti.App.iOS.addEventListener("usernotificationsettings", function registerForPush() {
            Ti.App.iOS.removeEventListener("usernotificationsettings", registerForPush);
            Ti.Network.registerForPushNotifications({
                success: deviceTokenSuccess,
                error: deviceTokenError,
                callback: receivePush
            });
        });
        Ti.App.iOS.registerUserNotificationSettings({
            types: [ Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE ]
        });
    } else "android" == Ti.Platform.osname ? CloudPush.retrieveDeviceToken({
        success: deviceTokenSuccess,
        error: deviceTokenError
    }) : Titanium.Network.registerForPushNotifications({
        types: [ Titanium.Network.NOTIFICATION_TYPE_BADGE, Titanium.Network.NOTIFICATION_TYPE_ALERT, Titanium.Network.NOTIFICATION_TYPE_SOUND ],
        success: deviceTokenSuccess,
        error: deviceTokenError,
        callback: receivePush
    });
}

var Cloud = require("ti.cloud");

var redirect = true;

var app_status;

if ("android" == Ti.Platform.osname) {
    var CloudPush = require("ti.cloudpush");
    CloudPush.addEventListener("callback", function(evt) {
        var payload = JSON.parse(evt.payload);
        Ti.App.Payload = payload;
        console.log("callback push");
        if (redirect) {
            if ("not_running" == app_status) ; else {
                redirect = false;
                getNotificationNumber(payload);
            }
            receivePush(payload);
        } else receivePush(payload);
    });
    CloudPush.addEventListener("trayClickLaunchedApp", function(evt) {
        var payload = JSON.parse(evt.payload);
        redirect = true;
        receivePush(payload);
        console.log("Tray Click Launched App (app was not running)");
        app_status = "not_running";
    });
    CloudPush.addEventListener("trayClickFocusedApp", function(evt) {
        redirect = false;
        var payload = JSON.parse(evt.payload);
        console.log("Tray Click Focused App (app was already running)");
        receivePush(payload);
        app_status = "running";
    });
}

Ti.App.addEventListener("pause", function() {
    console.log("sleep");
    redirect = true;
});

Ti.App.addEventListener("resumed", function() {
    console.log("resume");
    redirect = false;
});

exports.setInApp = function() {
    console.log("In App");
    redirect = false;
};

exports.registerPush = function() {
    Titanium.UI.iPhone.setAppBadge("0");
    registerPush();
};