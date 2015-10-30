var args = arguments[0] || {};
var u_id = Ti.App.Properties.getString('user_id');
var photoLoad = 0;
var loading = Alloy.createController("loading");
var image_preview;
/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

function buy_premium_account(){
	var in_app_purchase = Alloy.createController("in_app_purchase").getView();
	$.win.add(in_app_purchase);
	//in_app_purchase.open();
}

/**
 * load photo for item thumbnail.
 */
function loadPhoto(){
	var dialog = Titanium.UI.createOptionDialog({ 
	    title: 'Choose an image source...', 
	    options: ['Camera','Photo Gallery', 'Cancel'], 
	    cancel:2 //index of cancel button
	});
	  
	dialog.addEventListener('click', function(e) { 
	     
	    if(e.index == 0) { //if first option was selected
	        //then we are getting image from camera
	        Titanium.Media.showCamera({ 
	            success:function(event) { 
	                image_preview = Alloy.Globals.Navigator.open("image_preview", {media: event.media});
	         	},
	            cancel:function(){
	                //do somehting if user cancels operation
	            },
	            error:function(error) {
	                //error happend, create alert
	                var a = Titanium.UI.createAlertDialog({title:'Camera'});
	                //set message
	                if (error.code == Titanium.Media.NO_CAMERA){
	                    a.setMessage('Device does not have camera');
	                }else{
	                    a.setMessage('Unexpected error: ' + error.code);
	                }
	 
	                // show alert
	                a.show();
	            },
	            allowImageEditing:true,
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	            saveToPhotoGallery:true
        	});
        }else if(e.index == 1){
        	Titanium.Media.openPhotoGallery({
	            success: function(event){
	            	image_preview = Alloy.Globals.Navigator.open("image_preview", {media: event.media});
	            	//var image_preview = Alloy.createController("image_preview", {media: event.media}).getView();
	            	//image_preview.open();
	            	//previewImage(event);
	          	},
	          	cancel: function() {
	               
	            },
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	        });
	    }
	});
	dialog.show();
}

function callback_yes(){
	loading.start();
	var owner_id = Ti.App.Properties.getString('user_id');
	var filedata = (Ti.Platform.osname == "android")?$.item_image.toImage().media:$.item_image.toImage();
	var records = {
		Filedata: filedata, 
		u_id: u_id, 
		fullname: $.fullname.value, 
		email: $.email.value,
		mobile: $.mobile.value,
		photoLoad: photoLoad
		};
	API.callByPostImage({url: "updateProfileUrl", params: records}, 
		function(responseText){
			var result = JSON.parse(responseText);
			if(result.status == "error"){
				Common.createAlert("Error", result.data[0]);
				loading.finish();
				return false;
			}else{
				loading.finish();
		   		Ti.App.Properties.setString('fullname', records.fullname);
		   		Ti.App.Properties.setString('email', records.email);
		   		Ti.App.Properties.setString('mobile', records.mobile);
		   		Ti.App.Properties.setString('img_path', result.data.img_path);
   				Ti.App.Properties.setString('thumb_path', result.data.thumb_path);

				Common.createAlert("Notification", "Profile Update Successful", 
				function(){
					$.win.close();
				});
			}
		}
	);
}

function callback_no(){
	$.win.close();
}

function loadUserInfo(){
	var fullname = Ti.App.Properties.getString('fullname');
	var email = Ti.App.Properties.getString('email');
	var mobile = Ti.App.Properties.getString('mobile');
	var img_path = Ti.App.Properties.getString('img_path') || "images/icons/default_avatar.png";
	
	$.fullname.value = fullname;
	$.email.value = email;
	$.mobile.value = mobile;
	
	//load avatar
	$.item_image.image = img_path;
	//$.item_image.width = Ti.UI.FILL;
}

function imageCallback(e){
	var media = image_preview.getMedia();
	$.item_image.image = media;
	photoLoad = 1;
}

function init(){
	var left_right = Alloy.createController("_left_right");
	var label_desc = "Swipe left or right to select";
	
	//$.inner_box.add(left_right.generate_button(label_desc));
	left_right.generate_button($.inner_box, label_desc, callback_yes, callback_no);
	left_right.generate_indicator($.item_container);
	//left_right.add_event($.win, callback_yes, callback_no);
	loadUserInfo();
	$.win.add(loading.getView());
}

init();

Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);

$.win.addEventListener("close", function(){
	Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);
	$.destroy();
	console.log("window close");
});
