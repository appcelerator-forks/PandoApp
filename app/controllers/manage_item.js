var args = arguments[0] || {};
var loading = Alloy.createController("loading");
var current_tab = "donate";
var adopt_status_text = ["", "This item is waiting to be selected.", "Item taken"];
/**
 * Navigate to Conversation by u_id
 */
function navToFriendItem(e){
	var f_id = parent({name: "f_id"}, e.source);
	Alloy.Globals.Navigator.open("friends_items", {f_id: f_id});
}

/**
 * Navigate to Upload New Item
 */
function navToPersonalUpload(e){
	Alloy.Globals.Navigator.open("personal_upload");
}

/*
 	render table listing by current_tab
 * */

function render_table_view(){
	if(current_tab == "donate"){
		render_donate_list();
	}else{
		render_adopt_list();
	}
}

function render_adopt_list(){
	var model =  Alloy.createCollection("items");
	data = model.getData();
	var adopt_list = [];
	adopt_list.push(row_upload_item);
	
	/*
	 add upload button to the top 
	 * */
	var row_upload_item = $.UI.create("TableViewRow",{});
	var view_upload_item = $.UI.create("View",{
		classes: ['wfill', 'horz', 'hsize'],
		backgroundColor: "#ffffff"
	});
	var label_upload_item = $.UI.create("Label", {
		classes:['h5','wfill','hsize', 'padding'],
		text: "Donate your stuff to other."
	});
	view_upload_item.add(label_upload_item);
	row_upload_item.add(view_upload_item);
	row_upload_item.addEventListener("click", navToPersonalUpload);
	
	//donate_list.push(row_upload_item);
	
	for (var i=0; i < data.length; i++) {

		var tableviewrow = $.UI.create("TableViewRow",{});
		var view_container = $.UI.create("View",{
			classes: ['wfill', 'horz'],
			height: 70,
			backgroundColor: "#ffffff",
			item_response_id: data[i].id
		});
		
		var imageView_item_thumb = $.UI.create("ImageView",{
			
			width: 70,
			height: 70,
			defaultImage: "/images/default/small_item.png",
			image: data[i].img_path
		});
		
		var view_info_box = $.UI.create("View",{
			classes: ['hfill', 'vert', 'padding'],
			width: "auto"
		});
		
		var label_item_name = $.UI.create("Label",{
			classes:['h5','wfill','hsize'],
			textAlign: "left",
			text: data[i].item_name
		});
		
		var label_number_unread = $.UI.create("Label",{
			classes:['h6','wfill','hsize', 'font_light_grey'],
			textAlign: "left",
			text: adopt_status_text[data[i].status]
		});
		
		view_info_box.add(label_item_name);
		view_info_box.add(label_number_unread);
		
		view_container.add(imageView_item_thumb);
		//view_container.add(view_indicator);
		view_container.add(view_info_box);
		
		tableviewrow.add(view_container);
		adopt_list.push(tableviewrow);
	};
	$.tblview.setData(adopt_list);
}

function render_donate_list(){
	var model =  Alloy.createCollection("items");
	data = model.getWaitingDataByOwner();
	var donate_list = [];
	
	/*
	 add upload button to the top 
	 * */
	var row_upload_item = $.UI.create("TableViewRow",{});
	var view_upload_item = $.UI.create("View",{
		classes: ['wfill', 'horz'],
		height: 70,
		horizontalWrap: false,
		backgroundColor: "#ffffff"
	});
	var image_camera = $.UI.create("ImageView", {
		image: "/images/icons/icon_take_photo_nobg.png",
		width: "20%",
		left: 20,
		top: 10,
		bottom:10,
	});
	var label_upload_item = $.UI.create("Label", {
		classes:['h5','wfill','hfill', 'padding','bold'],
		textAlign: "center",
		text: "Donate your stuff to other"
	});
	view_upload_item.add(image_camera);
	view_upload_item.add(label_upload_item);
	row_upload_item.add(view_upload_item);
	row_upload_item.addEventListener("click", navToPersonalUpload);
	
	donate_list.push(row_upload_item);
	
	for (var i=0; i < data.length; i++) {

		var tableviewrow = $.UI.create("TableViewRow",{});
		var view_container = $.UI.create("View",{
			classes: ['wfill', 'horz'],
			height: 70,
			backgroundColor: "#ffffff",
			item_response_id: data[i].id
		});
		
		var imageView_item_thumb = $.UI.create("ImageView",{
			
			width: 70,
			height: 70,
			defaultImage: "/images/default/small_item.png",
			image: data[i].img_path
		});
		
		var view_info_box = $.UI.create("View",{
			classes: ['hfill', 'vert', 'padding'],
			width: "auto"
		});
		var total = data[i].total || 0;
		
		var label_item_name = $.UI.create("Label",{
			classes:['h5','wfill','hsize'],
			textAlign: "left",
			text: data[i].item_name
		});
		
		var label_number_unread = $.UI.create("Label",{
			classes:['h6','wfill','hsize', 'font_light_grey'],
			textAlign: "left",
			text: total+" people interest on it"
		});
		
		view_info_box.add(label_item_name);
		view_info_box.add(label_number_unread);
		
		view_container.add(imageView_item_thumb);
		//view_container.add(view_indicator);
		view_container.add(view_info_box);
		
		tableviewrow.add(view_container);
		donate_list.push(tableviewrow);
	};
	$.tblview.setData(donate_list);
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
 	Refresh
 * */
function refresh(){
	loading.start();
	getItemList(function(){
		getItemResponseList(function(){
			render_table_view();
			loading.finish();
		});
	});
	return;
}

function switchListing(e){
	var tab = parent({name: "tab"}, e.source);
	var text = children({name: "v", value:"label"}, $.firstTab);
	var secondtext = children({name: "v", value:"label"}, $.secondTab);
	
	if(tab == 1){
		current_tab = "donate";
		$.firstTab.backgroundColor = "#75d0cb";
		text.color = "#ffffff";
		
		$.secondTab.backgroundColor = "transparent";
		secondtext.color = "#75d0cb";
	}else if(tab == 2){
		current_tab = "adopt";
		$.secondTab.backgroundColor = "#75d0cb";
		secondtext.color = "#ffffff";
		
		$.firstTab.backgroundColor = "transparent";
		text.color = "#75d0cb";
	}
	refresh();
}

/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

function init(){
	$.win.add(loading.getView());
	refresh();
}

init();

Ti.App.addEventListener('manage_item:refresh',refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('manage_item:refresh',refresh);
	$.destroy();
	console.log("window close");
});
