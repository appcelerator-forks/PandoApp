var args = arguments[0] || {};
var current_point;
var loading = Alloy.createController("loading");
var ObjDate = new Date();
var lives = Ti.App.Properties.getString('lives') || 5;
var estimate_time = Ti.App.Properties.getString('estimate_time') || ObjDate.getTime()/1000;
var waiting_time = 20;
var lives_bar = {
	0: "/images/icons/bar_0.png",
	1: "/images/icons/bar_1.png",
	2: "/images/icons/bar_2.png",
	3: "/images/icons/bar_3.png",
	4: "/images/icons/bar_4.png",
	5: "/images/icons/bar_6.png",
};
var yes_no = "";
var sound_no = Ti.Media.createSound({url:"/sound/bloop_x.wav"});
var sound_yes = Ti.Media.createSound({url:"/sound/game-sound-correct.wav"});
var item_response = Alloy.createCollection("item_response");
var items = Alloy.createCollection("items");
var message = Alloy.createCollection("message"); // for first time create message use.
var data = items.getData();
// declare for local use.
var my_timer;
var item;
var point = 0;
var user_point = 0;

var countDown =  function( m , s, fn_tick, fn_end  ) {
	return {
		total_sec:m*60+s,
		timer:this.timer,
		running: false,
		set: function(m,s) {
			this.total_sec = parseInt(m)*60+parseInt(s);
			this.time = {m:m,s:s};
			return this;
		},
		start: function() {
			var self = this;
			this.running = true;
			this.timer = setInterval( function() {
				if (self.total_sec) {
					self.total_sec--;
					var minutes = parseInt(self.total_sec/60);
					var sec = (self.total_sec%60);
					if (minutes < 10){
						minutes = "0" + minutes;
					} 
					if (sec < 10){
						sec = "0" + sec;
					} 
					self.time = { m : minutes, s: sec };
					fn_tick();
				}
				else {
					self.stop();
					fn_end();
				}
				}, 1000 );
			return this;
		},
		stop: function() {
			clearInterval(this.timer);
			this.running = false;
			this.time = {m:00,s:00};
			this.total_sec = 0;
			return this;
		}
	};
};

function timer(update){
	if(!update){
		my_timer = new countDown(0,0, 
		function() {
			$.time.text = my_timer.time.m+":"+my_timer.time.s;
		},
		function() {
			if(lives < 5){
				timer();
			}
			refreshLife();
		});
	}
	var ObjDate = new Date();
	var now = Math.floor(ObjDate.getTime()/1000)+1;
	var sec_left = estimate_time - now;
	sec_left = Math.floor(sec_left%waiting_time);
	
	if(sec_left > 0){
		var minutes = Math.floor(sec_left / 60);
		var seconds = Math.floor(sec_left - minutes * 60);
		my_timer.set(minutes,seconds);
	}
	if(!my_timer.running){
		my_timer.start();
	}
}

function refreshLife(){
	var ObjDate = new Date();
	var now = Math.floor(ObjDate.getTime()/1000);
	var sec_left = estimate_time - now - 1;

	var life_in_waiting = Math.ceil(sec_left/waiting_time);

	if(life_in_waiting >= 0){
		lives = 5 - life_in_waiting;
	}else{
		lives = 5;
	}
	//$.lives_bar.image = lives_bar[lives];
	$.life.text = lives;
}

/*
  function abandon 
 * */
function animation(item, callback){
	var animation = Titanium.UI.createAnimation({
		opacity:0,
		duration: 500
	});
	item.animate(animation);
	animation.addEventListener("complete", function(){console.log('call');callback && callback();});
	
	return ;
}

var items =  function(counter) {
	return {
		counter: counter,
		set: function(counter) {
			this.counter = parseInt(counter);
			return this;
		},
		init: function() {
			console.log("total items number: "+this.counter);
			if(!this.counter){
				var rect = $.item_container.rect;
				console.log(rect.width);
				var view = $.UI.create("ImageView",{
					classes:['box'],
					width: rect.width,
					height: rect.width,
					image: "/images/default/item.png",
				});
				$.item_container.add(view);
			}else{
				$.item_container.removeAllChildren();
				this.insetItem();
				this.insetItem();
				//this.displayCurrentItemInfo();
				$.item_container.children[0].addEventListener("postlayout",function(){
					
					var rect = $.item_container.children[0].rect;
					$.label_no_more.height = rect.height;
				});
			}
			return this;
		},
		insetItem: function(){
			if(this.counter){
				var item_data = data[this.counter-1];
				var view_container = $.UI.create("View",{
					id: item_data.id,
					owner_id: item_data.owner_id,
					classes: ['wfill','hsize']
				});
				console.log(item_data.item_name);
				var label_item_name = $.UI.create("Label",{
					classes: ['wfill','hsize','padding'],
					text: item_data.item_name,
					color: "#ffffff"
				});
				var view_item_name = $.UI.create("View",{
					top: 0,
					classes: ['wfill','hsize', 'shadow'],
					zIndex: 10
				});
				var imgview = $.UI.create("ImageView",{
					zIndex: this.counter,
					classes: ["wfill"],
					height: "auto",
					id:  item_data.id,
					owner_id: item_data.owner_id,
					item_name:  item_data.item_name,
					owner_name: item_data.owner_name,
					owner_img_path: item_data.owner_img_path,
					image: item_data.img_path,
					defaultImage: "/images/default/item.png",
					zIndex: 1
				});
				view_item_name.add(label_item_name);
				view_container.add(imgview);
				view_container.add(view_item_name);
				this.counter --;
				$.item_container.add(view_container);
			}else{
				console.log("no more");
			}
			return this;
		},
		ItemRemove: function(action){
			var parent = this;
			// set next item info
			if($.item_container.children[0].zIndex != 1){
				//this.displayCurrentItemInfo(1);
			}else{
				//this.resetCurrentItemInfo();
			}
			//if yes call api to sent request to owner
			var u_id = Ti.App.Properties.getString('user_id');
			var item_upload = $.item_container.children[0];
			API.callByPost({url:"addToItemResponseUrl", params: {point: point, item_id: item_upload.id, owner_id: item_upload.owner_id, requestor_id: u_id, actions: action}}, function(response_text){
				//on succes insert into item_response
				var res = JSON.parse(response_text);
				var model = Alloy.createCollection("item_response");
				if(res.status == "success"){
					console.log("item response save");
					console.log(res.data);
					model.saveRecord(res.data);
					get_point();
				}
			});
			animation($.item_container.children[0], function(){
				var model = Alloy.createCollection("user_items");
				model.markRead({id: $.item_container.children[0].id, action:action });
				$.item_container.remove($.item_container.children[0]);
			});
		}, displayCurrentItemInfo: function(index){
			index = index || 0;
			var item_name = $.item_container.children[index].item_name;
			var owner_name = $.item_container.children[index].owner_name;
			var owner_img_path = $.item_container.children[index].owner_img_path;
			
			$.item_name.text = item_name;
			$.owner_name.text = owner_name;
			$.owner_img_path.image = owner_img_path;
		},resetCurrentItemInfo: function(){
			$.item_name.text = "";
			$.owner_name.text = "";
			$.owner_img_path.image = "";
		}
	};
};

function navTo(e){
	if(typeof e.source.controller != "undefined"){
		Alloy.Globals.Navigator.open(e.source.controller);
	}
}

function get_point(){
	var user_model = Alloy.createCollection("user");
	var item_response_model = Alloy.createCollection("item_response");
	var up = user_model.getPoint();
	var sp = item_response_model.getSpendPoint();
	console.log(up+"-"+sp);
	user_point = up - sp;
	$.point.text = user_point;
	console.log("latest point from d"+user_point);
}

function checkpoint(p){
	return (user_point >= p)?true:false;
}

function callback_yes(){
	if(!items.counter){
		Common.createAlert("Message", "No more item. Please try again later");
		return ;
	}
	if(!lives){
		Common.createAlert("Message", "No more lives. Please try again later");
		return ;
	}
	Common.dialogTextfield(function(p){
		console.log("user point before check point"+user_point);
		if(!checkpoint(p)){
			Common.createAlert("Message", "Not enough point. Please try again later");
			return;
		}
		if(!p){
			Common.createAlert("Message", "Please insert your bid amount.");
			return;
		}
		point = p || 0;
		lives = lives - 1;
		Ti.App.Properties.setString('lives', lives);
		//$.lives_bar.image = lives_bar[lives];
		$.life.text = lives;
		
		var ObjDate = new Date();
		var now = Math.floor(ObjDate.getTime()/1000)+1;
		//set estimate times
		if(now > estimate_time){
			estimate_time = parseInt(now)+waiting_time;
		}else{
			estimate_time = parseInt(estimate_time) + waiting_time;
		}
		Ti.App.Properties.setString('estimate_time', estimate_time);
		timer(1);
		
		sound_yes.play();
		refreshLife();
		item.ItemRemove(1); // 1 = yes
		item.insetItem();
	});
}

function callback_no(){
	point = 0;
	if(!items.counter){
		Common.createAlert("Message", "No more item. Please try again later");
		return ;
	}
	if(!lives){
		Common.createAlert("Message", "No more lives. Please try again later");
		return ;
	}
	sound_no.play();
	item.ItemRemove(2); // 2 = no 
	console.log('insert');
	item.insetItem();
}

/*
 	Sync data from server
 * */
function getItemList(callback){
	var checker = Alloy.createCollection('updateChecker'); 
	var isUpdate = checker.getCheckerById(1);
	var last_updated = isUpdate.updated || "";
	API.callByPost({url:"getItemListUrl", params: {last_updated: ""}}, function(responseText){
		var model = Alloy.createCollection("items");
		var res = JSON.parse(responseText);
		var arr = res.data || null;
		model.saveArray(arr);
		checker.updateModule(1,"items", Common.now());
		callback && callback();
	});
}

function getItemResponseList(callback){
	console.log('c');
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

function leftright_refresh(){
	$.left_right_button.removeAllChildren();
	var left_right = Alloy.createController("_left_right");
	var label_desc = "Swipe left or right to select";
	left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
}

function refresh(){
	get_point();
	loading.start();
	getItemList(function(){
		getItemResponseList(function(){
			var model = Alloy.createCollection("items");
			data = model.getData();
			console.log(data.length);
			item = new items(data.length);
			item.init();
			loading.finish();
		});
	});
}


function init(){
	$.win.add(loading.getView());
	refreshLife();
	get_point();
	//$.lives_bar.image = lives_bar[lives];
	$.life.text = lives;
	timer();
	
	var left_right = Alloy.createController("_left_right");
	var label_desc = "Swipe left or right to select";
	left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
	
	var rect = $.label_no_more.rect;
	console.log(rect.width);
	$.label_no_more.height = rect.width;
	//Deparecated function
	//left_right.generate_indicator($.indicator);
	//left_right.add_event($.indicator, callback_yes, callback_no);
}

init();

Ti.App.addEventListener('home:refresh',refresh);
Ti.App.addEventListener('home:leftright_refresh',leftright_refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('home:refresh',refresh);
	$.destroy();
	console.log("window close");
});
