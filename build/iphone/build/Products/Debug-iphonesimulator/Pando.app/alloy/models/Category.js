var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

exports.definition = {
    config: {
        columns: {
            c_id: "INTEGER PRIMARY KEY",
            c_name: "TEXT",
            c_level: "INTEGER",
            c_parent: "INTEGER",
            status: "INTEGET",
            img_path: "TEXT"
        },
        adapter: {
            type: "sql",
            collection_name: "category",
            idAttribute: "c_id"
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
                Ti.App.Properties.getString("user_id");
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " where c_parent = 0 ";
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var res = db.execute(sql);
                var arr = [];
                var count = 0;
                while (res.isValidRow()) {
                    arr[count] = {
                        c_id: res.fieldByName("c_id"),
                        c_name: res.fieldByName("c_name"),
                        c_level: res.fieldByName("c_level"),
                        c_parent: res.fieldByName("c_parent"),
                        status: res.fieldByName("status"),
                        img_path: res.fieldByName("img_path")
                    };
                    res.next();
                    count++;
                }
                res.close();
                db.close();
                collection.trigger("sync");
                return arr;
            },
            saveArray: function(arr) {
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                db.execute("BEGIN");
                arr.forEach(function(entry) {
                    var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (c_id, c_name, c_level, c_parent, status, img_path) VALUES (?,?,?,?,?,?)";
                    db.execute(sql_query, entry.c_id, entry.c_name, entry.c_level, entry.c_parent, 1, entry.img_path);
                    var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET c_name=?, c_level=?, c_parent=?, status=?, img_path=? WHERE c_id=?";
                    db.execute(sql_query, entry.c_name, entry.c_level, entry.c_parent, 1, entry.img_path, entry.c_id);
                });
                console.log(db.getRowsAffected() + "insert into item response 1");
                db.execute("COMMIT");
                console.log(db.getRowsAffected() + "insert into item response 2");
                db.close();
                collection.trigger("sync");
            },
            saveRecord: function(entry) {
                var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                "android" != Ti.Platform.osname && db.file.setRemoteBackup(false);
                var sql_query = "INSERT OR IGNORE INTO " + collection.config.adapter.collection_name + " (c_id, c_name, c_level, c_parent, status, img_path) VALUES (?,?,?,?,?,?)";
                db.execute(sql_query, entry.c_id, entry.c_name, entry.c_level, entry.c_parent, 1, entry.img_path);
                var sql_query = "UPDATE " + collection.config.adapter.collection_name + " SET c_name=?, c_level=?, c_parent=?, status=?, img_path=? WHERE c_id=?";
                db.execute(sql_query, entry.c_name, entry.c_level, entry.c_parent, entry.status, entry.img_path, entry.c_id);
                console.log(db.getRowsAffected + "insert into item response");
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

model = Alloy.M("category", exports.definition, []);

collection = Alloy.C("category", exports.definition, model);

exports.Model = model;

exports.Collection = collection;