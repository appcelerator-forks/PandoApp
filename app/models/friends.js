exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY",
		    "f_id": "INTEGER",
		    "u_id": "INTEGER",
		    "fullname": "TEXT",
		    "username": "TEXT",
		    "email": "TEXT",
		    "password": "TEXT",
		    "mobile": "TEXT",
		    "facebook_id": "TEXT",
		    "facebook_link": "TEXT",
		    "status": "INTEGER",
		    "last_login": "TEXT",
		    "created": "TEXT",
		    "updated": "TEXT",
		    "img_path": "TEXT",
		    "thumb_path": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "friends",
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
			getData : function(f_id){
				var collection = this;
				var addon = (f_id)?" AND f_id="+f_id:"";
				var u_id = Ti.App.Properties.getString('user_id');
                var sql = "SELECT  friends.*, fm.total FROM "+collection.config.adapter.collection_name+" LEFT OUTER JOIN (select count(*) as total, u_id from message where to_id = ? AND read is null group by u_id) as fm on fm.u_id = friends.f_id where friends.u_id = ?"+addon;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, u_id, u_id);
                var arr = [];
                var count = 0;
                while (res.isValidRow()){
					arr[count] = {
					    id: res.fieldByName('id'),
					    f_id: res.fieldByName('f_id'),
					    u_id: res.fieldByName('u_id'),
					    fullname: res.fieldByName('fullname'),
					    username: res.fieldByName('username'),
					    email: res.fieldByName('email'),
					    password: res.fieldByName('password'),
					    mobile: res.fieldByName('mobile'),
					    facebook_id: res.fieldByName('facebook_id'),
					    facebook_link: res.fieldByName('facebook_link'),
					    status: res.fieldByName('status'),
					    last_login: res.fieldByName('last_login'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    img_path: res.fieldByName('img_path'),
					    total: res.fieldByName('total'),
					    thumb_path: res.fieldByName('thumb_path'),
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
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, f_id, u_id, fullname, username, email, password, mobile, facebook_id, facebook_link, status, last_login, created, updated, img_path, thumb_path) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.f_id, entry.u_id, entry.fullname, entry.username, entry.email, entry.password, entry.mobile, entry.facebook_id, entry.facebook_link, entry.status, entry.last_login, entry.created, entry.updated, entry.img_path, entry.thumb_path);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET f_id=?, u_id=?, fullname=?, username=?, email=?, password=?, mobile=?, facebook_id=?, facebook_link=?, status=?, last_login=?, created=?, updated=?, img_path=?, thumb_path=? WHERE id=?";
					db.execute(sql_query, entry.f_id, entry.u_id, entry.fullname, entry.username, entry.email, entry.password, entry.mobile, entry.facebook_id, entry.facebook_link, entry.status, entry.last_login, entry.created, entry.updated, entry.img_path, entry.thumb_path, entry.id);
				});
				console.log(db.getRowsAffected()+"insert into friend 1");
				db.execute("COMMIT");
	            db.close();
	            collection.trigger('sync');
			},
			saveRecord: function(entry){
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, f_id, u_id, fullname, username, email, password, mobile, facebook_id, facebook_link, status, last_login, created, updated, img_path, thumb_path) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				db.execute(sql_query, entry.id, entry.f_id, entry.u_id, entry.fullname, entry.username, entry.email, entry.password, entry.mobile, entry.facebook_id, entry.facebook_link, entry.status, entry.last_login, entry.created, entry.updated, entry.img_path,  entry.thumb_path);
				var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET f_id=?, u_id=?, fullname=?, username=?, email=?, password=?, mobile=?, facebook_id=?, facebook_link=?, status=?, last_login=?, created=?, updated=?, img_path=?, thumb_path=? WHERE id=?";
				db.execute(sql_query, entry.f_id, entry.u_id, entry.fullname, entry.username, entry.email, entry.password, entry.mobile, entry.facebook_id, entry.facebook_link, entry.status, entry.last_login, entry.created, entry.updated, entry.img_path,  entry.thumb_path, entry.id);
				console.log(db.getRowsAffected+"insert into item response");
	            db.close();
	            collection.trigger('sync');
			},
			addColumn : function( newFieldName, colSpec) {
				var collection = this;
				var db = Ti.Database.open(collection.config.adapter.db_name);
				if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
				var fieldExists = false;
				resultSet = db.execute('PRAGMA TABLE_INFO(' + collection.config.adapter.collection_name + ')');
				while (resultSet.isValidRow()) {
					if(resultSet.field(1)==newFieldName) {
						fieldExists = true;
					}
					resultSet.next();
				}  
			 	if(!fieldExists) { 
					db.execute('ALTER TABLE ' + collection.config.adapter.collection_name + ' ADD COLUMN '+newFieldName + ' ' + colSpec);
				}
				db.close();
			},
		});

		return Collection;
	}
};