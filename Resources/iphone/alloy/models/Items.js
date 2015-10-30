var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            id: "INTEGER PRIMARY KEY ",
            owner_id: "INTEGER",
            receiver_id: "INTEGER",
            item_name: "TEXT",
            img_path: "TEXT",
            item_desc: "TEXT",
            item_category: "TEXT",
            longitude: "TEXT",
            latitude: "TEXT",
            status: "INTEGER",
            created: "TEXT",
            code: "TEXT",
            updated: "TEXT",
            owner_name: "TEXT",
            owner_img_path: "TEXT",
            distance: "TEXT",
            point: "INTEGER"
        },
        adapter: {
            type: "sql",
            collection_name: "items",
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
                var u_id = Ti.App.Properties.getString("user_id") || 0;
                var collection = this;
                var sql = "select * from items where id not in (SELECT item_id FROM item_response where requestor_id = ?) AND status = 1 AND owner_id != ? order by created desc";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql, u_id, u_id);
                var arr = [];
                var count = 0;
                while (res.isValidRow()) {
                    arr[count] = {
                        id: res.fieldByName("id"),
                        owner_id: res.fieldByName("owner_id"),
                        receiver_id: res.fieldByName("receiver_id"),
                        item_name: res.fieldByName("item_name"),
                        item_desc: res.fieldByName("item_desc"),
                        item_category: res.fieldByName("item_category"),
                        longitude: res.fieldByName("longitude"),
                        latitude: res.fieldByName("latitude"),
                        status: res.fieldByName("status"),
                        created: res.fieldByName("created"),
                        updated: res.fieldByName("updated"),
                        owner_name: res.fieldByName("owner_name"),
                        owner_img_path: res.fieldByName("owner_img_path"),
                        img_path: res.fieldByName("img_path"),
                        code: res.fieldByName("code")
                    };
                    res.next();
                    count++;
                }
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            getDataById: function(id) {
                var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='" + id + "'";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var arr = [];
                res.isValidRow() && (arr = {
                    id: res.fieldByName("id"),
                    owner_id: res.fieldByName("owner_id"),
                    receiver_id: res.fieldByName("receiver_id"),
                    item_name: res.fieldByName("item_name"),
                    item_desc: res.fieldByName("item_desc"),
                    item_category: res.fieldByName("item_category"),
                    longitude: res.fieldByName("longitude"),
                    latitude: res.fieldByName("latitude"),
                    status: res.fieldByName("status"),
                    created: res.fieldByName("created"),
                    updated: res.fieldByName("updated"),
                    owner_name: res.fieldByName("owner_name"),
                    owner_img_path: res.fieldByName("owner_img_path"),
                    img_path: res.fieldByName("img_path"),
                    code: res.fieldByName("code")
                });
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            getDataByFid: function(f_id) {
                var u_id = Ti.App.Properties.getString("user_id") || 0;
                var collection = this;
                var sql = "select items.*, fm.total from items LEFT OUTER JOIN (select count(*) as total, u_id, item_id from message where u_id = ? AND (read is null OR read != 1) group by item_id) as fm on items.id = fm.item_id where (items.status = 2 OR items.status = 5) AND (( items.owner_id = ? AND items.receiver_id = ?) OR ( items.owner_id = ? AND items.receiver_id = ?)) order by items.created desc";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                console.log(sql + " " + u_id + " " + f_id);
                var res = db.execute(sql, f_id, f_id, u_id, u_id, f_id);
                var arr = [];
                var count = 0;
                var row_count = res.fieldCount;
                for (var a = 0; row_count > a; a++) console.log(a + ":" + res.fieldName(a) + ":" + res.field(a));
                while (res.isValidRow()) {
                    arr[count] = {
                        id: res.fieldByName("id"),
                        owner_id: res.fieldByName("owner_id"),
                        receiver_id: res.fieldByName("receiver_id"),
                        item_name: res.fieldByName("item_name"),
                        item_desc: res.fieldByName("item_desc"),
                        item_category: res.fieldByName("item_category"),
                        longitude: res.fieldByName("longitude"),
                        latitude: res.fieldByName("latitude"),
                        status: res.fieldByName("status"),
                        created: res.fieldByName("created"),
                        updated: res.fieldByName("updated"),
                        owner_name: res.fieldByName("owner_name"),
                        owner_img_path: res.fieldByName("owner_img_path"),
                        img_path: res.fieldByName("img_path"),
                        total: res.fieldByName("total"),
                        code: res.fieldByName("code")
                    };
                    res.next();
                    count++;
                }
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            getMatchingDataByOwner: function() {
                var u_id = Ti.App.Properties.getString("user_id");
                var collection = this;
                var sql = "select match_item.*, friends.fullname from (select items.*, ir.total from items left outer join (select count(*) as total, message.u_id from message where message.to_id = ? AND message.read is null group by message.u_id) as ir on items.receiver_id = ir.u_id where (items.status = 2) AND items.owner_id = ? AND receiver_id != 0) as match_item left outer join friends ON friends.f_id = match_item.receiver_id ";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql, u_id, u_id);
                var arr = [];
                var count = 0;
                while (res.isValidRow()) {
                    arr[count] = {
                        total: res.fieldByName("total"),
                        id: res.fieldByName("id"),
                        owner_id: res.fieldByName("owner_id"),
                        receiver_id: res.fieldByName("receiver_id"),
                        receiver_name: res.fieldByName("friends.fullname"),
                        item_name: res.fieldByName("item_name"),
                        item_desc: res.fieldByName("item_desc"),
                        item_category: res.fieldByName("item_category"),
                        longitude: res.fieldByName("longitude"),
                        latitude: res.fieldByName("latitude"),
                        status: res.fieldByName("status"),
                        created: res.fieldByName("created"),
                        updated: res.fieldByName("updated"),
                        owner_name: res.fieldByName("owner_name"),
                        owner_img_path: res.fieldByName("owner_img_path"),
                        img_path: res.fieldByName("img_path"),
                        code: res.fieldByName("code")
                    };
                    res.next();
                    count++;
                }
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            getWaitingDataByOwner: function() {
                var u_id = Ti.App.Properties.getString("user_id");
                var collection = this;
                var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where owner_id = ? and actions = 1 and status = 0 group by item_id) as ir on items.id = ir.item_id where items.status = 1 AND items.owner_id = ? AND receiver_id = 0";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql, u_id, u_id);
                var arr = [];
                var count = 0;
                while (res.isValidRow()) {
                    arr[count] = {
                        total: res.fieldByName("total"),
                        id: res.fieldByName("id"),
                        owner_id: res.fieldByName("owner_id"),
                        receiver_id: res.fieldByName("receiver_id"),
                        item_name: res.fieldByName("item_name"),
                        item_desc: res.fieldByName("item_desc"),
                        item_category: res.fieldByName("item_category"),
                        longitude: res.fieldByName("longitude"),
                        latitude: res.fieldByName("latitude"),
                        status: res.fieldByName("status"),
                        created: res.fieldByName("created"),
                        updated: res.fieldByName("updated"),
                        owner_name: res.fieldByName("owner_name"),
                        owner_img_path: res.fieldByName("owner_img_path"),
                        img_path: res.fieldByName("img_path"),
                        code: res.fieldByName("code")
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
                console.log("calculate_distance");
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
                db.close();
                collection.trigger("sync");
                Ti.App.fireEvent("app:update_loading_text", {
                    text: "Calculating distance..."
                });
                Ti.App.fireEvent("app:next_loading");
            },
            saveArray: function(arr) {
                console.log("item save array");
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                db.execute("BEGIN");
                arr.forEach(function(entry) {
                    var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path, code, point) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                    db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point);
                    var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path=?, img_path=?, code=?, point=? WHERE id=?";
                    db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point, entry.id);
                });
                db.execute("COMMIT");
                db.close();
                collection.trigger("sync");
            },
            saveRecord: function(entry) {
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path, code, point) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point);
                var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path=?, img_path=?, code=?, point=? WHERE id=?";
                db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point, entry.id);
                db.close();
                collection.trigger("sync");
            },
            addColumn: function(newFieldName, colSpec) {
                var collection = this;
                var db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var fieldExists = false;
                resultSet = db.execute("PRAGMA TABLE_INFO(" + collection.config.adapter.collection_name + ")");
                while (resultSet.isValidRow()) {
                    resultSet.field(1) == newFieldName && (fieldExists = true);
                    resultSet.next();
                }
                fieldExists || db.execute("ALTER TABLE " + collection.config.adapter.collection_name + " ADD COLUMN " + newFieldName + " " + colSpec);
                db.close();
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

model = Alloy.M("items", exports.definition, []);

collection = Alloy.C("items", exports.definition, model);

exports.Model = model;

exports.Collection = collection;