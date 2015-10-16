var args = arguments[0] || {};

/*
 * left-hand switch event handle
 * */

function switch_left_handed(e){
	if(e.source.value===true){
		Ti.App.Properties.setString('left-handed', "yes");
	}else{
		Ti.App.Properties.setString('left-handed', "");
	}
}

/*
 * edit profile event handle
 * */
function nav2Profile(){
	Alloy.Globals.Navigator.open("setting_profile");
}

/*
 * logout event handle
 * */
function logout(){
	var user = require("user");
	user.logout(function(){
		Alloy.Globals.Navigator.navGroup.close();
		var win = Alloy.createController("auth/login").getView();
    	win.open();
	});	
}

function check_switch(){
	var left_handed = Ti.App.Properties.getString('left-handed') || "";
	if(left_handed != ""){
		$.left_handed_switch.value = true;
	}
}

function closeWindow(){
	$.win.close();
}

function init(){
	check_switch();
}

init();

$.win.addEventListener("close", function(){
	$.destroy();
	Ti.App.fireEvent("home:leftright_refresh");
	console.log("window close");
});