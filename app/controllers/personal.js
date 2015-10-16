var args = arguments[0] || {};
var u_id = Ti.App.Properties.getString('user_id');
var items = Alloy.createCollection("items");
var loading = Alloy.createController("loading");
var data;
var match_data;
/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

/**
 * Navigate to Conversation by u_id
 */
function navToConversation(e){
	var u_id = parent({name: "u_id"}, e.source);
	Alloy.Globals.Navigator.open("conversation", {u_id: u_id});
}

/**
 * Navigate to Upload New Item
 */
function navToPersonalUpload(e){
	Alloy.Globals.Navigator.open("personal_upload");
}


/**
 * Navigate to Conversation by u_id
 */
function navToConversation(e){
	var f_id = parent({name: "f_id"}, e.source);
	var id = parent({name: "id"}, e.source);
	Alloy.Globals.Navigator.open("conversation", {f_id: f_id, id: id});
}


/**
 * Navigate to Waiting List by item_id
 */
function navToWaitingList(e){
	var item_response_id = parent({name: "item_response_id"}, e.source);
	Alloy.Globals.Navigator.open("personal_waiting_list", {id: item_response_id});
}
/*
 	render waiting list
 * */
function render_waiting_list(){
	$.inner_box.removeAllChildren();
	for (var i=0; i < data.length; i++) {

		var view_container = $.UI.create("View",{
			classes: ['hsize', 'wfill', 'horz'],
			item_response_id: data[i].id
		});
		
		var imageView_item_thumb = $.UI.create("ImageView",{
			top: 10,
			width: 60,
			height: "auto",
			defaultImage: "/images/default/small_item.png",
			image: data[i].img_path
		});
		
		var view_info_box = $.UI.create("View",{
			classes: ['hsize', 'vert', 'padding'],
			width: "70%"
		});
		var total = data[i].total || 0;
		
		var label_item_name = $.UI.create("Label",{
			classes:['h5','wfill','hsize'],
			textAlign: "left",
			text: data[i].item_name
		});
		
		var label_number_unread = $.UI.create("Label",{
			classes:['h6','wfill','hsize'],
			color: "#333333",
			textAlign: "left",
			text: total+" people interest on it"
		});
		
		view_info_box.add(label_item_name);
		view_info_box.add(label_number_unread);
		
		view_container.add(imageView_item_thumb);
		view_container.add(view_info_box);
		$.inner_box.add(view_container);
		
		view_container.addEventListener("click", navToWaitingList);
	};
	
	//matching List
	$.matching_inner_box.removeAllChildren();
	for (var i=0; i < match_data.length; i++) {
		var view_container = $.UI.create("View",{
			classes: ['hsize', 'wfill', 'horz'],
			f_id: match_data[i].receiver_id,
			id: match_data[i].id
		});
		
		var imageView_item_thumb = $.UI.create("ImageView",{
			top: 10,
			width: 60,
			height: "auto",
			defaultImage: "/images/default/small_item.png",
			image: match_data[i].img_path
		});
		
		var view_info_box = $.UI.create("View",{
			classes: ['hsize', 'vert', 'padding'],
			width: "70%"
		});
		var total = match_data[i].total || 0;
		
		var label_item_name = $.UI.create("Label",{
			classes:['h5','wfill','hsize'],
			textAlign: "left",
			text: match_data[i].item_name
		});
		
		var label_receiver_name = $.UI.create("Label",{
			classes:['h5','wfill','hsize'],
			textAlign: "left",
			text: match_data[i].receiver_name
		});
		
		var label_number_unread = $.UI.create("Label",{
			classes:['h6','wfill','hsize'],
			color: "#333333",
			textAlign: "left",
			text: total+" Unread message"
		});
		
		view_info_box.add(label_item_name);
		view_info_box.add(label_receiver_name);
		view_info_box.add(label_number_unread);
		
		
		view_container.add(imageView_item_thumb);
		view_container.add(view_info_box);
		$.matching_inner_box.add(view_container);
		
		view_container.addEventListener("click", navToConversation);
	}
}

/*
 	Sync data from server
 * */
function getItemList(callback){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(1);
	var last_updated = isUpdate.updated || "";

	API.callByPost({url:"getItemListUrl", params: {last_updated: last_updated}}, function(responseText){
		var model = Alloy.createCollection("items");
		var res = JSON.parse(responseText);
		var arr = res.data || null;
		model.saveArray(arr);
		checker.updateModule(1,"items", Common.now());
		callback && callback();
	});
}

function getItemResponseList(callback){
	var checker = Alloy.createCollection('updateChecker'); 
	var u_id = Ti.App.Properties.getString('user_id');
	
	var isUpdate = checker.getCheckerById(2, u_id);
	var last_updated = isUpdate.updated || "";
	
	API.callByPost({url:"getItemResponseByUidUrl", params: {last_updated: "", u_id: u_id}}, function(responseText){
		var model = Alloy.createCollection("item_response");
		var res = JSON.parse(responseText);
		var arr = res.data || null;
		model.saveArray(arr);
		checker.updateModule(2,"item_response", Common.now(), u_id);
		callback && callback();
	});
}
/*
 refresh
 * */
function refresh(){
	loading.start();
	getItemList(function(){
		getItemResponseList(function(){
			var model =  Alloy.createCollection("items");;
			data = model.getWaitingDataByOwner();
			match_data = model.getMatchingDataByOwner();
			render_waiting_list();
			$.label_waiting_list.text = "Waiting List ("+data.length+")";
			$.label_matching_list.text = "Matching List ("+match_data.length+")";
			loading.finish();
		});
	});
}

function init(){
	$.win.add(loading.getView());
	refresh();
}

init();

Ti.App.addEventListener('personal:refresh',refresh);

$.win.addEventListener("close", function(){
	$.destroy();
	console.log("window close");
	Ti.App.removeEventListener('personal:refresh',refresh);
});
