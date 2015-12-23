var args = arguments[0] || {};
var current_point;
var loading = Alloy.createController("loading");
var ObjDate = new Date();
var estimate_time = Ti.App.Properties.getString('estimate_time') || ObjDate.getTime()/1000;
var waiting_time = 20;
var yes_no = "";
var sound_no = Ti.Media.createSound({url:"/sound/bloop_x.wav"});
var sound_yes = Ti.Media.createSound({url:"/sound/game-sound-correct.wav"});

// declare model
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
			//$.time.text = my_timer.time.m+":"+my_timer.time.s;
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

/*
  function abandon 
 * */
function animation(item, callback){
	var animation = Titanium.UI.createAnimation({
		opacity:0,
		duration: 500
	});
	item.animate(animation);
	animation.addEventListener("complete", function(){callback && callback();});
	
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
				var view = $.UI.create("ImageView",{
					width: rect.width,
					height: rect.width,
					backgroundColor: "#75d0cb",
					image: "/images/default/item.png",
				});
				$.item_container.add(view);
			}else{
				$.item_container.removeAllChildren();
				this.insetItem();
				this.insetItem();
				//this.displayCurrentItemInfo();
			}
			return this;
		},
		insetItem: function(){
			if(this.counter){
				var pwidth = Ti.Platform.displayCaps.platformWidth;
				var item_data = data[this.counter-1];
				var view_container = $.UI.create("View",{
					id: item_data.id,
					isParent: "yes",
					top:0,
					zIndex: this.counter,
					width:pwidth,
					labelname: item_data.item_name,
					owner_id: item_data.owner_id,
					classes: ['hsize', 'vert']
				});
				
				var label_item_name = $.UI.create("Label",{
					classes: ['wfill','hfill','padding'],
					text: item_data.item_name,
					color: "#ffffff"
				});
				var view_item_name = $.UI.create("View",{
					top: 0,
					classes: ['wfill', 'shadow'],
					backgroundColor: "#323136",
					height: 40,
					zIndex: 10
				});
				var imgview = $.UI.create("ImageView",{
					zIndex: this.counter,
					width:pwidth,
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
				var left_right = Alloy.createController("_left_right");
				left_right.add_event(view_container, callback_yes, callback_no);
			}else{
				console.log("no more");
			}
			return this;
		},
		ItemRemove: function(action, item_image){
			var parent = this;
			console.log($.item_container.children.length+" number of children");
			for (var i=0; i < $.item_container.children.length; i++) {
			  console.log($.item_container.children[i].labelname);
			};
			console.log(item_image);
			console.log(item_image.labelname);
			animation(item_image, function(){
				console.log('removed');
				$.item_container.remove(item_image);
				console.log($.item_container.children.length+" number of children");
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

function render_structure(){
	var pwidth = Ti.Platform.displayCaps.platformWidth;
	$.left_right_button.top = pwidth + 40;
}

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
	user_point = up - sp;
	$.point.text = user_point;
}

function checkpoint(p){
	return (user_point >= p)?true:false;
}

function callback_yes(view){
	/*if(!item.counter){
		Common.createAlert("Message", "No more item. Please try again later");
		return ;
	}*/
	if(false){
		Common.createAlert("Message", "No more lives. Please try again later");
		return ;
	}
	Common.dialogTextfield(function(p){
		if(!checkpoint(p)){
			Common.createAlert("Message", "Not enough point. Please try again later");
			return;
		}
		if(!p){
			Common.createAlert("Message", "Please insert your bid amount.");
			return;
		}
		point = p || 0;
		//$.lives_bar.image = lives_bar[lives];
		//$.life.text = lives;
		
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
		item.ItemRemove(1, view); // 1 = yes
		item.insetItem();
	});
}

function callback_no(view){
	point = 0;
	/*if(!item.counter){
		Common.createAlert("Message", "No more item. Please try again later");
		return ;
	}*/
	if(false){
		Common.createAlert("Message", "No more lives. Please try again later");
		return ;
	}
	sound_no.play();
	item.ItemRemove(2, view); // 2 = no 
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
	//$.left_right_button.removeAllChildren();
	var left_right = Alloy.createController("_left_right");
	var label_desc = "Swipe left or right to select";
	//left_right.generate_button($.left_right_button, label_desc, callback_yes, callback_no);
}

function refresh(){
	get_point();
	loading.start();
	getItemList(function(){
		getItemResponseList(function(){
			var model = Alloy.createCollection("items");
			data = model.getData();
			item = new items(data.length);
			item.init();
			loading.finish();
		});
	});
}


function init(){
	$.win.add(loading.getView());
	get_point(); 
	render_structure();
	//timer();
	
	var left_right = Alloy.createController("_left_right");
	left_right.generate_button_old($.left_right_button);
}

init();

Ti.App.addEventListener('home:refresh',refresh);
Ti.App.addEventListener('home:leftright_refresh',leftright_refresh);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('home:refresh',refresh);
	$.destroy();
});
