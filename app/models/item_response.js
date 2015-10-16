exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY",
		    "owner_id": "INTEGER",
		    "item_id": "INTEGER",
		    "requestor_id": "INTEGER",
		    "requestor_name": "TEXT",
		    "requestor_img_path": "TEXT",
		    "actions": "INTEGER", //1 - yes , 2 - no
		    "status": "INTEGER", //0 - havent decide, 1 - yes, 2 -reject
		    "updated": "TEXT",
		    "created": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "item_response",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			getData : function(item_id){
				var collection = this;
				var u_id = Ti.App.Properties.getString('user_id');
                var sql = "SELECT item_response.*, items.item_name, items.img_path FROM "+collection.config.adapter.collection_name+" left outer join items on items.id = item_response.item_id where item_response.item_id = ? AND item_response.owner_id = ? AND item_response.status = 0 and item_response.actions = 1";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, item_id, u_id);
                var arr = [];
                var count = 0;
                /**
                 * debug use
                 
                var row_count = res.fieldCount;
                for(var a = 0; a < row_count; a++){
            		 console.log(a+":"+res.fieldName(a)+":"+res.field(a));
            	 }*/
            	
                while (res.isValidRow()){
					arr[count] = {
					    id: res.fieldByName('id'),
					    item_name: res.fieldByName('item_name'),
					    item_img_path: res.fieldByName('img_path'),
					    owner_id: res.fieldByName('owner_id'),
					    item_id: res.fieldByName('item_id'),
					    requestor_id: res.fieldByName('requestor_id'),
					    requestor_img_path: res.fieldByName('requestor_img_path'),
					    requestor_name: res.fieldByName('requestor_name'),
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			saveArray : function(arr){
				
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
                
                arr.forEach(function(entry) {
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, owner_id, item_id, requestor_id, status, actions, updated, created, requestor_name, requestor_img_path) VALUES (?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.owner_id, entry.item_id, entry.requestor_id, entry.status, entry.actions, entry.updated, entry.created, entry.requestor_name, entry.requestor_img_path);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET owner_id=?, item_id=?, requestor_id=?, status=?, actions=?, updated=?, created=?, requestor_name=?, requestor_img_path=? WHERE id=?";
					db.execute(sql_query, entry.owner_id, entry.item_id, entry.requestor_id, entry.status, entry.actions, entry.updated, entry.created, entry.requestor_name, entry.requestor_img_path, entry.id);
				});
				console.log(db.getRowsAffected()+"insert into item response 1");
				db.execute("COMMIT");
				console.log(db.getRowsAffected()+"insert into item response 2");
	            db.close();
	            collection.trigger('sync');
			},
			saveRecord: function(entry){
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, owner_id, item_id, requestor_id, status, actions, updated, created, requestor_name, requestor_img_path) VALUES (?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.owner_id, entry.item_id, entry.requestor_id, entry.status, entry.actions, entry.updated, entry.created, entry.requestor_name, entry.requestor_img_path);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET owner_id=?, item_id=?, requestor_id=?, status=?, actions=?, updated=?, created=?, requestor_name=?, requestor_img_path=? WHERE id=?";
					db.execute(sql_query, entry.owner_id, entry.item_id, entry.requestor_id, entry.status, entry.actions, entry.updated, entry.created, entry.requestor_name, entry.requestor_img_path, entry.id);
				console.log(db.getRowsAffected+"insert into item response");
	            db.close();
	            collection.trigger('sync');
			}
		});

		return Collection;
	}
};