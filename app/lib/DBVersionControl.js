/*********************
*** DB VERSION CONTROL ***
* 
* Current Version 1.1
* 
**********************/

// update user device token
exports.checkAndUpdate = function(e){
	var dbVersion = Ti.App.Properties.getString("dbVersion");
	if (dbVersion == '1.0') {
	  /*
	   version 1.1 upgrade
	   * */
	  var message_model = Alloy.createCollection('message'); 
	  message_model.addColumn("read", "INTEGER");
	  dbVersion = '1.1';
	}
	dbVersion = "1.1";
	if(dbVersion == '1.1'){
		var user_model = Alloy.createCollection('user'); 
	    user_model.addColumn("point", "INTEGER");
	    console.log('add point arrr');
	    var items = Alloy.createCollection('items'); 
	    items.addColumn("point", "INTEGER");
	    var item_response_model = Alloy.createCollection('item_response'); 
	    item_response_model.addColumn("point", "INTEGER");
	    dbVersion = '1.2';
	}
	Ti.App.Properties.setString("dbVersion", dbVersion);
};

