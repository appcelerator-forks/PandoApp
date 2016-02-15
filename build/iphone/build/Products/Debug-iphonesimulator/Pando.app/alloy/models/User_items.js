var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY AUTOINCREMENT",
            u_id: "INTEGER",
            i_id: "INTEGER",
            action: "TEXT",
            status: "INTEGER",
            updated: "TEXT",
            created: "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "user_items",
            idAttribute: "id"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {
            getData: function() {
                var collection = this;
                var sql = "SELECT * FROM userItems where status = 1";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var arr = [];
                var count = 0;
                while (res.isValidRow()) {
                    arr[count] = {
                        id: res.fieldByName("id"),
                        u_id: res.fieldByName("u_id"),
                        i_id: res.fieldByName("i_id"),
                        action: res.fieldByName("action"),
                        status: res.fieldByName("status")
                    };
                    res.next();
                    count++;
                }
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            calculate_distance: function() {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " where distance = '' OR distance IS NULL";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var lon2 = Ti.App.Properties.getString("longitude") || 0;
                var lat2 = Ti.App.Properties.getString("latitude") || 0;
                var res = db.execute(sql);
                var count = 0;
                while (res.isValidRow()) {
                    lon1 = res.fieldByName("longitude");
                    lat1 = res.fieldByName("latitude");
                    {
                        countDistanceByKM(lon1, lat1, lon2, lat2);
                    }
                    res.next();
                    count++;
                }
                Ti.App.fireEvent("app:update_loading_text", {
                    text: "Calculating distance..."
                });
                Ti.App.fireEvent("app:next_loading");
            },
            saveArray: function(arr) {
                console.log("item save array");
                console.log(arr);
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                db.execute("BEGIN");
                arr.forEach(function(entry) {
                    var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path);
                    var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path=?, img_path=? WHERE id=?";
                    db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.id);
                });
                db.execute("COMMIT");
                db.close();
                collection.trigger("sync");
            },
            markRead: function(entry) {
                var collection = this;
                var u_id = Ti.App.Properties.getString("user_id");
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (u_id, i_id, action, status, updated, created) VALUES (?,?,?,?,?,?)";
                db.execute(sql_query, u_id, entry.id, entry.action, 1, Common.now(), Common.now());
                db.close();
                collection.trigger("sync");
            },
            saveRecord: function(entry) {
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path);
                var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path, img_path=? WHERE id=?";
                db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.id);
                db.close();
                collection.trigger("sync");
            }
        });
        return Collection;
    }
};

var countDistanceByKM = function(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    if (d > 1) return Math.round(d);
    if (1 >= d) return Math.round(1e3 * d) + "m";
    return d;
};

model = Alloy.M("user_items", exports.definition, []);

collection = Alloy.C("user_items", exports.definition, model);

exports.Model = model;

exports.Collection = collection;