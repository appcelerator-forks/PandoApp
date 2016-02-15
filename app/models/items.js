   /***status
    *	1- ACTIVE
    *	2- GIVE TO SOMEONE
    *   3- BANNED
    *   4- REMOVE
    *   5- TRANSACTION SUCCESS
    ****/
exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY ",
		    "owner_id": "INTEGER",
		    "receiver_id": "INTEGER",
		    "item_name": "TEXT",
		    "img_path": "TEXT",
		    "item_desc": "TEXT",
		    "item_category": "TEXT",
		    "longitude": "TEXT",
		    "latitude": "TEXT",
		    "status": "INTEGER",
		    "created": "TEXT",
		    "code":"TEXT",
		    "updated": "TEXT",
		    "owner_name": "TEXT",
		    "owner_img_path": "TEXT",
		    "distance": "TEXT",
		    "point": "INTEGER"
		},
		adapter: {
			type: "sql",
			collection_name: "items",
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
			getData : function(category, keyword){
				var u_id = Ti.App.Properties.getString('user_id') || 0;
				console.log(typeof category);
				var category_sql = (typeof category != "undefined" && category != "")?" AND item_category = '"+category+"' ":"";
				var keyword_sql = (typeof keyword != "undefined" && keyword != "")?" AND item_name like '%"+keyword+"%' ":"";
				var collection = this;
                var sql = "select * from items where id not in (SELECT item_id FROM item_response where requestor_id = ?)"+category_sql+keyword_sql+" AND status = 1 AND owner_id != ? order by distance and created desc";
                console.log(sql);
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, u_id, u_id);
                var arr = []; 
                var count = 0;
                
                /**
                 * debug use
                 
                var row_count = res.fieldCount;
                for(var a = 0; a < row_count; a++){
            		 console.log(a+":"+res.fieldName(a)+":"+res.field(a));
            	 }*/
            	
                while (res.isValidRow()){
            		//console.log(res.fieldByName('i_id')+",");
					arr[count] = {
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    distance: res.fieldByName('distance'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getDataById : function(id){
				var collection = this;
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name + " WHERE id='"+ id+ "'" ;
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
				}
                //	return;
                var res = db.execute(sql);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
						id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
				} 
		 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getDataByFid : function(f_id){
				var u_id = Ti.App.Properties.getString('user_id') || 0;
				var collection = this;
                var sql = "select items.*, fm.total from items LEFT OUTER JOIN (select count(*) as total, u_id, item_id from message where u_id = ? AND (read is null OR read != 1) group by item_id) as fm on items.id = fm.item_id where (items.status = 2 OR items.status = 5) AND (( items.owner_id = ? AND items.receiver_id = ?) OR ( items.owner_id = ? AND items.receiver_id = ?)) order by items.created desc";

                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                console.log(sql+" "+u_id+" "+f_id);
                var res = db.execute(sql, f_id, f_id, u_id, u_id, f_id);

                var arr = []; 
                var count = 0;
                
                /**
                 * debug use
                 */
                var row_count = res.fieldCount;
                for(var a = 0; a < row_count; a++){
            		 console.log(a+":"+res.fieldName(a)+":"+res.field(a));
            	 }
            	
                while (res.isValidRow()){
            		//console.log(res.fieldByName('i_id')+",");
					arr[count] = {
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    total: res.fieldByName('total'),
					    code: res.fieldByName('code')
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getMatchingDataByOwner: function(){
				var u_id = Ti.App.Properties.getString('user_id');
				var collection = this;
                //var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where owner_id = ? and actions = 1) as ir on items.id = ir.item_id where items.status = 1 AND items.owner_id = ? and items.receiver_id is null";
                var sql = "select match_item.*, friends.fullname from (select items.*, ir.total from items left outer join (select count(*) as total, message.u_id from message where message.to_id = ? AND message.read is null group by message.u_id) as ir on items.receiver_id = ir.u_id where (items.status = 2) AND items.owner_id = ? AND receiver_id != 0) as match_item left outer join friends ON friends.f_id = match_item.receiver_id order by match_item.updated desc";
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, u_id, u_id);
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
						total: res.fieldByName('total'),
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    receiver_name: res.fieldByName('friends.fullname'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getWaitingDataByOwner: function(){
				var u_id = Ti.App.Properties.getString('user_id');
				var collection = this;
                //var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where owner_id = ? and actions = 1) as ir on items.id = ir.item_id where items.status = 1 AND items.owner_id = ? and items.receiver_id is null";
                var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where owner_id = ? and actions = 1 group by item_id) as ir on items.id = ir.item_id where items.status != 3 AND items.status != 4 AND items.owner_id = ? order by items.updated desc";
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, u_id, u_id);
                var arr = []; 
                var count = 0;
                var row_count = res.fieldCount;
                for(var a = 0; a < row_count; a++){
            		 console.log(a+":"+res.fieldName(a)+":"+res.field(a));
            	 }
                while (res.isValidRow()){
                		//console.log(res.fieldByName('i_id')+",");
					arr[count] = {
						total: res.fieldByName('total'),
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getWaitingDataByRequestor: function(){
				var u_id = Ti.App.Properties.getString('user_id');
				var collection = this;
                //var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where owner_id = ? and actions = 1) as ir on items.id = ir.item_id where items.status = 1 AND items.owner_id = ? and items.receiver_id is null";
                var sql = "select items.*, ir.total from items left outer join (SELECT item_id, count(*) as total FROM item_response where requestor_id = ? and actions = 1 group by item_id) as ir on items.id = ir.item_id where items.status != 3 AND items.status != 4 AND items.owner_id != ? order by items.updated desc";
                var sql = "select items.* from items, item_response where items.id = item_response.item_id AND item_response.requestor_id = ? AND items.status != 3 AND items.status != 4 AND items.owner_id != ? order by items.updated desc";
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, u_id, u_id);
                var arr = []; 
                var count = 0;
                while (res.isValidRow()){
                		//console.log(res.fieldByName('i_id')+",");
					arr[count] = {
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
					res.next();
					count++;
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			getUnreadMessageByItemId : function(item_id, f_id){
				 var collection = this;
				var addon = "";
				
                var sql = "SELECT items.*, fm.total FROM " + collection.config.adapter.collection_name + " LEFT OUTER JOIN  (select count(*) as total, item_id from message where item_id = ? AND u_id = ? AND read is null group by item_id) as fm on fm.item_id = items.id WHERE items.id=?";
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var res = db.execute(sql, item_id, f_id, item_id);
                var arr = []; 
               
                if (res.isValidRow()){
					arr = {
					    total: res.fieldByName('total'),
					    id: res.fieldByName('id'),
					    owner_id: res.fieldByName('owner_id'),
					    receiver_id: res.fieldByName('receiver_id'),
					    item_name: res.fieldByName('item_name'),
					    item_desc: res.fieldByName('item_desc'),
					    item_category: res.fieldByName('item_category'),
					    longitude: res.fieldByName('longitude'),
					    latitude: res.fieldByName('latitude'),
					    status: res.fieldByName('status'),
					    created: res.fieldByName('created'),
					    updated: res.fieldByName('updated'),
					    owner_name: res.fieldByName('owner_name'),
					    owner_img_path: res.fieldByName('owner_img_path'),
					    img_path: res.fieldByName('img_path'),
					    code: res.fieldByName('code')
					};
				} 
			 
				res.close();
                db.close();
                collection.trigger('sync');
                return arr;
			},
			calculate_distance : function(){
				console.log("calculate_distance");
				var collection = this;
				var u_id = Ti.App.Properties.getString('user_id') || 0;
				console.log(u_id);
                var sql = "SELECT * FROM " + collection.config.adapter.collection_name +" where distance != NULL AND owner_id != ? AND status = 1";
                
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                var lon2 = Ti.App.Properties.getString('longitude') || 0;
   				var lat2 = Ti.App.Properties.getString('latitude') || 0;
   				console.log(lon2);
   				console.log(lat2);
                var res = db.execute(sql, u_id);
                var count = 0;
                while (res.isValidRow()){
					lon1 = res.fieldByName('longitude');
					lat1 = res.fieldByName('latitude');
					var id = res.fieldByName('id');
					var dist = countDistanceByKM(lon1, lat1, lon2, lat2);
					
					var sql_update =  "UPDATE "+collection.config.adapter.collection_name+" SET distance=? where id=?";
					db.execute(sql_update, dist, id);
					
					console.log(dist);
					res.next();
					count++;
				}
				db.close();
	            collection.trigger('sync');
				Ti.App.fireEvent('app:update_loading_text', {text: "Calculating distance..."});
				Ti.App.fireEvent('app:next_loading');
			},
			saveArray : function(arr){
				console.log("item save array");
				var collection = this;
                db = Ti.Database.open(collection.config.adapter.db_name);
                if(Ti.Platform.osname != "android"){
                	db.file.setRemoteBackup(false);
                }
                db.execute("BEGIN");
               
                arr.forEach(function(entry) {
	                var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path, code, point) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
					db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point);
					var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path=?, img_path=?, code=?, point=? WHERE id=?";
					db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point, entry.id);
				});
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
                
              	var sql_query =  "INSERT OR IGNORE INTO "+collection.config.adapter.collection_name+" (id, owner_id, receiver_id, item_name, item_desc, item_category, longitude, latitude, status, created, updated, owner_name, owner_img_path, img_path, code, point) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
				db.execute(sql_query, entry.id, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point);
				var sql_query =  "UPDATE "+collection.config.adapter.collection_name+" SET owner_id=?, receiver_id=?, item_name=?, item_desc=?, item_category=?, longitude=?, latitude=?, status=?, created=?, updated=?, owner_name=?, owner_img_path=?, img_path=?, code=?, point=? WHERE id=?";
				db.execute(sql_query, entry.owner_id, entry.receiver_id, entry.item_name, entry.item_desc, entry.item_category, entry.longitude, entry.latitude, entry.status, entry.created, entry.updated, entry.owner_name, entry.owner_img_path, entry.img_path, entry.code, entry.point, entry.id);
				
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
			}
		});

		return Collection;
	}
};

var countDistanceByKM = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
    if (d>1) return Math.round(d)+"km";//+"km";
    else if (d<=1) return Math.round(d*1000)+"m";
    return d;
};