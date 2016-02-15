var scanditsdk = require("com.mirasense.scanditsdk");

var picker;

var window;

var closeScanner = function() {
    null != picker && picker.stopScanning();
    window.close();
};

exports.closeScanner = function() {
    closeScanner();
};

exports.createScannerWindow = function() {
    return Titanium.UI.createWindow({
        navBarHidden: true,
        fullscreen: true
    });
};

exports.createScannerButton = function() {
    return Titanium.UI.createButton({
        width: 200,
        height: 80,
        image: "/images/scan.png"
    });
};

exports.openScanner = function(scanType) {
    picker = scanditsdk.createView({
        width: "100%",
        height: "100%"
    });
    picker.init("qt/U+huGEeSG62SYxtngPa7xVDA0BLRMw7gQLH8qAB0", 0);
    picker.showSearchBar(false);
    picker.showToolBar(true);
    picker.setSuccessCallback(function(e) {
        if ("1" == scanType) {
            var barcode = e.barcode;
            var barRes = barcode.split("||");
            Ti.App.fireEvent("qr_code:update_compelete_code", {
                res: barRes
            });
        }
        closeScanner();
    });
    picker.setCancelCallback(function() {
        closeScanner();
    });
    window.add(picker);
    window.addEventListener("open", function() {
        "iphone" == Ti.Platform.osname || "ipad" == Ti.Platform.osname || picker.setOrientation(window.orientation);
        picker.setSize(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight);
        picker.startScanning();
    });
    window.addEventListener("android:back", function() {
        closeScanner();
    });
    window.open();
};

exports.init = function(win) {
    window = win;
};

("iphone" == Ti.Platform.osname || "ipad" == Ti.Platform.osname) && (Titanium.UI.iPhone.statusBarHidden = true);

Ti.Gesture.addEventListener("orientationchange", function(e) {
    window.orientationModes = [ Titanium.UI.PORTRAIT, Titanium.UI.UPSIDE_PORTRAIT, Titanium.UI.LANDSCAPE_LEFT, Titanium.UI.LANDSCAPE_RIGHT ];
    if (null != picker) {
        picker.setOrientation(e.orientation);
        picker.setSize(Ti.Platform.displayCaps.platformWidth, Ti.Platform.displayCaps.platformHeight);
    }
});