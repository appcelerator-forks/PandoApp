

function event_touch(obj){
	obj.addEventListener("touchstart", function(e){
		current_point = {x: e.x, y:e.y};
	});
	
	obj.addEventListener("touchmove", function(e){
		var floatpoint = ((e.x - current_point.x)/100);
		if((e.x - current_point.x) < 0){
			if(floatpoint < -0.5){
				yes_no = "yes";
			}else{
				yes_no = "";
			}
			$.left_button_indicator.setOpacity(-floatpoint);
		}else{
			if(floatpoint > 0.5){
				yes_no = "no";
			}
			$.right_button_indicator.setOpacity(floatpoint);
		}
	});
	
	obj.addEventListener("touchend", function(e){
		var d = new Date();
		var now = Math.floor(d.getTime()/1000);
		if(yes_no == "yes"){
			lives = lives - 1;
			Ti.App.Properties.setString('lives', lives);
			$.lives_bar.image = lives_bar[lives];
			
			//set estimate times
			if(now > estimate_time){
				estimate_time = parseInt(now)+waiting_time;
			}else{
				estimate_time = parseInt(estimate_time) + waiting_time;
			}
			Ti.App.Properties.setString('estimate_time', estimate_time);
			timer(1);
			animation("left", this);
			sound_yes.play();
			refreshLife();
			item.insetItem();
		}else if(yes_no == "no"){
			animation("right", this);
			sound_no.play();
			item.insetItem();
		}else{
			$.left_button_indicator.setOpacity(0);
			$.right_button_indicator.setOpacity(0);
		}
		
		yes_no = "";
	});
}