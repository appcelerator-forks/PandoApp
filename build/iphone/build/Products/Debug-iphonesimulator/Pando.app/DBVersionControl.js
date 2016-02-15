exports.checkAndUpdate = function() {
    var dbVersion = Ti.App.Properties.getString("dbVersion");
    if ("1.0" == dbVersion) {
        var message_model = Alloy.createCollection("message");
        message_model.addColumn("read", "INTEGER");
        dbVersion = "1.1";
    }
    dbVersion = "1.1";
    if ("1.1" == dbVersion) {
        var user_model = Alloy.createCollection("user");
        user_model.addColumn("point", "INTEGER");
        console.log("add point arrr");
        var items = Alloy.createCollection("items");
        items.addColumn("point", "INTEGER");
        var item_response_model = Alloy.createCollection("item_response");
        item_response_model.addColumn("point", "INTEGER");
        dbVersion = "1.2";
    }
    Ti.App.Properties.setString("dbVersion", dbVersion);
};