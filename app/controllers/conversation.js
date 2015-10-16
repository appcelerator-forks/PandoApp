var args = arguments[0] || {};
var f_id = args.f_id;
var item_id = args.id;

var u_id = Ti.App.Properties.getString('user_id') || 0;
var user_thumb_path = Ti.App.Properties.getString('thumb_path') || "";
var loading = Alloy.createController("loading");

//get friend data
var friends = Alloy.createCollection("friends");
var friends_data = friends.getData(f_id);

//get items data
var items = Alloy.createCollection("items");
var items_data = items.getDataById(item_id);
console.log(items_data);

//set message as read
var message = Alloy.createCollection("message");
message.messageRead({item_id:item_id});

/**
 * Send message
 */
function SendMessage(){
	console.log(f_id+" "+u_id);
	console.log(item_id+" "+$.message.value);
	API.callByPost({url: "sendMessageUrl", params:{to_id: f_id, item_id: item_id, u_id: u_id, message: $.message.value, target: "friends"}});
	
	var params = {u_id: u_id, to_id: f_id, message: $.message.value, type: "text", read: 1, item_id: item_id};
	var messager = Alloy.createCollection('message');
	console.log(params);
	messager.saveRecord(params);
	$.message.value = "";
	refresh();
	setTimeout(scrollToBottom, 1000);
}

/*
 button code events
 * */
function onQRCode(){
	var owner = (items_data.owner_id == u_id)?1:0;
	var code = items_data.code || 0;
	Alloy.Globals.Navigator.open("qr_code", {item_id: item_id, owner: owner, code: code});
}

function render_item_box(){
	$.item_box.removeAllChildren();
	
	var view_container = $.UI.create("View", {
		classes: ['hsize', 'wfill', 'horz'],
		height: 80,
	});
	
	var imageview_item = $.UI.create("ImageView",{
		left:10,
		top:10,
		width: 60,
		height: "auto",
		defaultImage: "/images/default/small_item.png",
		image: items_data.img_path
	});
	
	var view_info = $.UI.create("View",{
		classes: ['wfill','hsize','vert','padding']
	});
	
	var label_item_name = $.UI.create("Label",{
		classes:['h5','wfill','hsize','bold'],
		textAlign: "left",
		text: items_data.item_name
		
	});
	switch(items_data.status){
		case 2:
			var status_text = "Waiting for receive";
			break;
		case 5:
			var status_text = "Item Received";
			break;
	}
	var label_days_ago = $.UI.create("Label",{
		classes:['h5','wfill','hsize'],
		textAlign: "left",
		text: status_text
	});
	
	view_info.add(label_item_name);
	view_info.add(label_days_ago);
	view_container.add(imageview_item);
	view_container.add(view_info);
	$.item_box.add(view_container);
	var line = $.UI.create("View", {
		classes:['gray-line']
	});
	$.item_box.add(line);
	/*
	 completed code box
	 * 
	console.log(items_data.owner_id+" "+u_id);
	if(items_data.owner_id == u_id || items_data.status == 5){
		var view_complete_box = $.UI.create("View",{
			classes:['wfill','hsize', 'box'],
			top: 10,
			bottom: 10
		});
	
		var label_completed_code = $.UI.create("Label",{
			classes:['h5','wfill','hsize','bold', 'padding'],
			text: "Complete Code - "+items_data.code
		});
		view_complete_box.add(label_completed_code);
		$.item_box.add(view_complete_box);
	}else{
		var input_completed_code = $.UI.create("TextField",{
			classes:['h5','wfill','hsize','bold', 'padding'],
			hintText: "Completed Code"
		});
		
		var button_completed = $.UI.create("Button",{
			classes:['small_button'],
			bottom: 10,
			width: 100,
			title: "Completed"
		});
		
		button_completed.addEventListener('click', function (e){
			var completed_code = input_completed_code.value || "";
			if(completed_code != ""){
				API.callByPost({url: "validateTransactionCodeUrl", params:{code: completed_code, item_id: item_id}}, function(responseText){
					var res = JSON.parse(responseText);
					var arr = res.data;
					var items = Alloy.createCollection('items');
					items.saveArray(arr);
					refresh();
				});
				
			}else{
				Common.createAlert("Error", "Completed Code cannot be empty.");
			}
		});
		$.item_box.add(input_completed_code);
		$.item_box.add(button_completed);
	}*/
}

function render_conversation(){
	$.inner_box.removeAllChildren();
	
	for (var i=0; i < data.length; i++) {
		var view_container = $.UI.create("View",{
			classes: ['hsize','wfill','horz','padding']
		});
		var thumb_path = (data[i].u_id == u_id)?user_thumb_path:data[i].thumb_path;

		var imageview_thumb_path = $.UI.create("ImageView", {
			top: 10,
			width: 60,
			height: "auto",
			defaultImage: "/images/default/small_item.png",
			image: thumb_path
		});
		
		var view_text_container = $.UI.create("View", {
			classes:  ['hsize', 'vert', 'box', 'padding'],
			width: "70%"
		});
		var label_message = $.UI.create("Label", {
			classes:['h5', 'wfill', 'padding'],
			text: data[i].message
		});
		var label_time = $.UI.create("Label", {
			classes:['h5', 'wfill', 'padding'],
			top:0,
			text: data[i].created,
			textAlign: "right"
		});
		view_text_container.add(label_message);
		view_text_container.add(label_time);
		if(data[i].u_id == u_id){
			view_container.add(view_text_container);
			view_container.add(imageview_thumb_path);
		}else{
			view_container.add(imageview_thumb_path);
			view_container.add(view_text_container);
		}
		
		$.inner_box.add(view_container);
	}
}

function scrollToBottom(){
	$.chatroom.scrollToBottom();
}

/*
 	Refresh
 * */
function refresh(){
	loading.start();
	data = message.getData(item_id);
	render_item_box();
	render_conversation();
	loading.finish();
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
	$.f_name.text = friends_data[0].fullname;
}

init();

$.chatroom.addEventListener("postlayout", scrollToBottom);

Ti.App.addEventListener('conversation:refresh', refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('conversation:refresh',refresh);
	Ti.App.fireEvent("friends:refresh");
	Ti.App.fireEvent("personal:refresh");
	$.destroy();
	console.log("window close");
});
