var args = arguments[0] || {};
var current_point;
var answer = "";
var left_indicator;
var right_indicator;
var username = Ti.App.Properties.getString(username);

$.generate_button = function(container, desc, yes_callback, no_callback){
	var left_handed = Ti.App.Properties.getString('left-handed') || "";
	var button_image = (left_handed != "")?"/images/icons/button_left-handed.png":"/images/icons/button_right-handed.png";
	var left_button_image = (left_handed != "")?"/images/icons/button_yes.png":"/images/icons/button_no_right-handed.png";
	var right_button_image = (left_handed != "")?"/images/icons/button_no.png":"/images/icons/button_yes_right-handed.png";

	var view_slider = $.UI.create("View", {
		height: 54,
		borderColor: "#bbb",
		borderRadius: 26,
		classes: ['wfill'],
		top: 10,
		bottom: 10,
	});
	var imageview_button = $.UI.create("ImageView", {
		classes: ['hfill'],
		top: 2,
		bottom: 2,
		width: 80,
		image: button_image
	});
	var label_sliderText = $.UI.create("Label", {
		classes: ['wsize', 'hsize', 'h6'],
		text: desc
	});
	
	view_slider.add(imageview_button);
	view_slider.add(label_sliderText);
	container.add(view_slider);
	var offset={};
	
	imageview_button.addEventListener('touchstart', function(e) {
		offset.x = e.x;
	});
	
	imageview_button.addEventListener("touchmove", function(e){
		if(Titanium.Platform.osname == "android"){
			var moveX = imageview_button.left + (e.x - offset.x);
		}else{	
			var moveX = e.x + imageview_button.animatedCenter.x - imageview_button.getWidth();
		}
		if(moveX + imageview_button.getWidth() >= view_slider.getRect().width){
			return;
			//moveX = view_slider.getLeft() + view_slider.getWidth() - (imageview_button.getWidth()/2);
		}else if(moveX <= 0){
			return;
			//moveX = view_slider.getLeft() + (imageview_button.getWidth()/2);
		}
		if(moveX > view_slider.getRect().width * 0.5){
			answer = "right";
			imageview_button.image = right_button_image;
		}else if(moveX < view_slider.getRect().width * 0.25){
			answer = "left";
			imageview_button.image = left_button_image;
		}else{
			answer = "";
			imageview_button.image = button_image;
		}
		
		imageview_button.setLeft(moveX);
	});
	
	imageview_button.addEventListener("touchend", function(e){
		if(answer == "left"){
			if(left_handed != ""){
				yes_callback && yes_callback();
			}else{
				no_callback && no_callback();
			}
		}else if(answer == "right"){
			if(left_handed != ""){
				no_callback && no_callback();
			}else{
				yes_callback && yes_callback();
			}
		}else{
			
		}
		imageview_button.setLeft();
		imageview_button.image = button_image;
		answer = "";
	});
};

/*
 Deprecated function for generate button
 * */
$.generate_button_old = function(container){
	var left_handed = Ti.App.Properties.getString('left-handed') || "";
	var left_button_image = (left_handed != "")?"/images/icons/button_yes.png":"/images/icons/button_no_right-handed.png";
	var right_button_image = (left_handed != "")?"/images/icons/button_no.png":"/images/icons/button_yes_right-handed.png";
	
	var undo_view = $.UI.create("View", {
		classs:['hfill'],
		width: "20%"
	});
	
	var left_view = $.UI.create("View", {
		classs:['hfill'],
		width: "30%",
		employee_id: i,
		employee_name: name[i]
	});
	
	var name = ['gart', 'onn','george'];
	var obj = {name: "gart", ic: "123123123"};
	alert(name[1]);
	
	var right_view = $.UI.create("View", {
		classs:['hfill'],
		width: "30%"
	});
	
	var willingtobuy_view = $.UI.create("View", {
		classs:['hfill'],
		width: "20%"
	});
	
	var left_button = $.UI.create("ImageView",{
		classes: ['hsize'],
		width: "80%",
		image: left_button_image,
		left: 0
	});
	
	var right_button = $.UI.create("ImageView",{
		classes: ['hsize'],
		width: "80%",
		image: right_button_image,
		right: 0
	});
	
	left_view.add(left_button);
	right_view.add(right_button);
	
	container.add(undo_view);
	container.add(left_view);
	container.add(right_view);
	container.add(willingtobuy_view);
	return ;
};

$.generate_indicator = function(container){
	var left_handed = Ti.App.Properties.getString('left-handed') || "";
	var left_button_image = (left_handed != "")?"/images/icons/button_yes.png":"/images/icons/button_no_right-handed.png";
	var right_button_image = (left_handed != "")?"/images/icons/button_no.png":"/images/icons/button_yes_right-handed.png";
	
	left_indicator = $.UI.create("ImageView",{
		classes: ['wsize'],
		height: 40,
		image: left_button_image,
		left: 0,
		zIndex: 999,
		opacity: 0,
	});
	
	right_indicator = $.UI.create("ImageView",{
		classes: ['wsize'],
		height: 40,
		image: right_button_image,
		right: 0,
		zIndex: 999,
		opacity: 0,
	});
	
	container.add(left_indicator);
	container.add(right_indicator);
	return ;
};

$.add_event = function(container, yes_callback, no_callback){
	var left_handed = Ti.App.Properties.getString('left-handed') || "";
	var pwidth = Ti.Platform.displayCaps.platformWidth;
	var image_view = parent({name:"isParent", value:"yes"}, container);
	var current_image_point;
	console.log(image_view);
	image_view.addEventListener("touchstart", function(e){
		current_point = {x: e.x, y:e.y};
		current_image_point_diff = {x: e.x - image_view.animatedCenter.x, y: e.y - image_view.animatedCenter.y};
	});
	
	image_view.addEventListener("touchmove", function(e){
		
		var moveX = e.x + image_view.animatedCenter.x - pwidth - current_image_point_diff.x;
		var moveY = e.y + image_view.animatedCenter.y - pwidth - current_image_point_diff.y - 40;
		var floatpoint = ((image_view.animatedCenter.x - (pwidth/2))/pwidth);
		console.log(floatpoint);
		if((e.x - current_point.x) < 0){
			if(floatpoint < -0.25){
				answer = "left";
			}else{
				answer = "";
			}
			
		}else{
			if(floatpoint > 0.25){
				answer = "right";
			}
		}
		var angle = 25 * floatpoint;
		
		container.transform = Ti.UI.create2DMatrix().rotate(angle);
		container.animate({top:moveY, left:moveX, duration:1});
	});
	
	image_view.addEventListener("touchend", function(e){
		container.animate({left:-pwidth, duration:500});
		console.log('done');
		return;
		if(answer == "left"){
			container.animate({left:-pwidth, duration:500});
			if(left_handed != ""){
				yes_callback(image_view);
			}else{
				no_callback(image_view);
			}
		}else if(answer == "right"){
			container.animate({left:pwidth, duration:500});
			if(left_handed != ""){
				console.log(image_view);
				no_callback(image_view);
			}else{
				yes_callback(image_view);
			}
		}else{
			container.animate({top:0, left:0, duration:500});
			container.transform = Ti.UI.create2DMatrix().rotate(0);
		}
		
		answer = "";
	});
	return ;
};