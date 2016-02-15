var args = arguments[0] || {};
var item_response_id = args.id;
var items_response_model = Alloy.createCollection("item_response");
var data = items_response_model.getDataById(item_response_id);
var item;

console.log(data);

/*
 	Item object - generate, remove, display, events
 * */

var items =  function(counter) {
	return {
		counter: counter,
		set: function(counter) {
			this.counter = parseInt(counter);
			return this;
		},
		init: function() {
			this.insetItem();
			this.insetItem();
			this.displayCurrentItemInfo();
			$.item_container.children[0].addEventListener("postlayout",function(){
				var rect = $.item_container.children[0].rect;
				console.log(rect.height+" image height");
				$.label_no_more.height = rect.height;
			});
			
			return this;
		},
		insetItem: function(){
			console.log("total items number: "+this.counter);
			if(this.counter){
				var item_data = data[this.counter-1];
				console.log(item_data.point+" item point!!");
				var imgview = $.UI.create("ImageView",{
					zIndex: this.counter,
					classes: ["wfill"],
					height: "auto",
					id:  item_data.id,
					point:  item_data.point,
					item_name: item_data.item_name,
					item_img_path: item_data.item_img_path,
					requestor_name: item_data.requestor_name,
					defaultImage: "/images/default/item.png",
					image: item_data.requestor_img_path
				});
				this.counter --;
				$.item_container.add(imgview);
			}else{
				console.log("no more");
			}
			return this;
		},
		ItemRemove: function(action){
			var parent = this;
			// set next item info
			if($.item_container.children[0].zIndex != 1){
				this.displayCurrentItemInfo(1);
			}else{
				this.resetCurrentItemInfo();
				closeWindow();
			}
			//if yes call api to sent request to owner
			
			var u_id = Ti.App.Properties.getString('user_id');
			var item_upload = $.item_container.children[0];
			API.callByPost({url:"updateItemResponseUrl", params: {id: item_upload.id, status: action}}, function(response_text){
				//on succes insert into item_response
				var res = JSON.parse(response_text);
				var model = Alloy.createCollection("items");
				if(res.status == "success"){
					console.log("work");
					console.log(res.data);
					model.saveRecord(res.data);
				}
			});
			if(action == 1){
				Common.createAlert("Notification","User selected.", function(){
					closeWindow();
				});
			}
			animation($.item_container.children[0], function(){
				console.log('remove '+$.item_container.children[0].id);
				$.item_container.remove($.item_container.children[0]);
			});
		}, displayCurrentItemInfo: function(index){
			index = index || 0;
			var label_field_1 = $.item_container.children[index].requestor_name;
			var label_field_2 = $.item_container.children[index].point || 0;
			//var img_path = $.item_container.children[index].item_img_path;
			
			$.label_field_1.text = label_field_1;
			$.label_field_2.text = label_field_2;
			//$.img_path.image = img_path;
		}, resetCurrentItemInfo: function(){
			$.label_field_1.text = "";
			$.label_field_2.text = "";
			//$.img_path.image = "";
		}
	};
};

function animation(item, callback){
	var animation = Titanium.UI.createAnimation({
		opacity:0,
		duration: 500
	});
	item.animate(animation);
	animation.addEventListener("complete", function(){console.log('callback from animate');callback && callback();});
	
	return ;
}

function callback_yes(){
	item.ItemRemove(1);
}

function callback_no(){
	item.ItemRemove(2);
}
/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

function init(){
	if(data.length > 0){
		item = new items(data.length);
		item.init();
	}
	var left_right = Alloy.createController("_left_right");
	var label_desc = "Swipe left or right to select";
	left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
	left_right.generate_indicator($.indicator);
	//left_right.add_event($.indicator, callback_yes, callback_no);
}

init();

$.win.addEventListener("close", function(){
	$.destroy();
	console.log("window close");
	Ti.App.fireEvent('personal:refresh');
});
