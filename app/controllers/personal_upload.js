var args = arguments[0] || {};
var loading = Alloy.createController("loading");
var photoLoad = 0;
var image_preview;
/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}


/**
 * private function for crop image use. later export to a new object.
 */

function previewImage(event){
	var image = event.media;
    var win = $.UI.create("Window", {
    	barColor:"#75d0cb",
    	title: "Photo Preview",
    	classes: ['vert', 'wfill', 'hfill'],
    	navBarHidden:"false"
    });
    var pWidth = Titanium.Platform.displayCaps.platformWidth;
    var thumb_width = pWidth - 20;
    var thumb_height = thumb_width * 0.7;
    var view_crop = $.UI.create("View", {
    	width: thumb_width,
    	height: thumb_height,
    });
    var scrollview_crop = $.UI.create("ScrollView",{
    	width: thumb_width,
    	height: thumb_height,
    	contentWidth: pWidth,
    	contentHeight: Ti.UI.SIZE,
    	backgroundColor: "#ffffff",
    	classes:['box'],
    	platform: "ios"
    });
    
    var button_save = $.UI.create("Button", {
    	classes: ['hszie', 'wsize'],
    	title: "Crop"
    });
    button_save.addEventListener('click', function(){
    	var croppedImage = view_crop.toImage();
		$.item_image.image = croppedImage;
		$.item_image.width = Ti.UI.FILL;
		$.item_image.left = 10;
		$.item_image.right = 10;
		photoLoad = 1;
		win.close();
    });
    
    var imageView = Ti.UI.createImageView({
		width: Ti.UI.FILL,
		height: "auto",
		image:event.media
	});
			
    scrollview_crop.add(imageView);
    view_crop.add(scrollview_crop);
   	win.add(view_crop);
    win.add(button_save);
    Alloy.Globals.Navigator.openWindow(win);
   // Alloy.Globals.Navigator.navGroup.openWindow(win);
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
	            success:function(event){
	            	image_preview = Alloy.Globals.Navigator.open("image_preview", {media: event.media});
	          	},
	          	cancel:function() {
	               
	            },
	            mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO],
	        });
	    }
	});
	dialog.show();
}

function callback_yes(){
	if(!photoLoad){
		Common.createAlert("Warning", "Please upload the item photo");
		return ;
	}
	
	var owner_id = Ti.App.Properties.getString('user_id'); 
	var filedata = (Ti.Platform.osname == "android")?$.item_image.toImage().media:$.item_image.toImage();
	
    var longitude = Ti.App.Properties.getString('longitude');
    var latitude = Ti.App.Properties.getString('latitude');
	var records = {
		Filedata: filedata, 
		owner_id: owner_id, 
		item_name: $.item_name.value, 
		item_category: $.item_category.value,
		photoLoad: photoLoad,
		longitude: longitude,
		latitude: latitude
		};
	loading.start();
	API.callByPostImage({url: "addItemUrl", params: records}, 
		function(responseText){
			console.log(responseText);
			var result = JSON.parse(responseText);
			if(result.status == "error"){
				Common.createAlert("Error", result.data[0]);
				loading.finish();
				return false;
			}else{
				loading.finish();
				Common.createAlert("Notificatin", "Item Upload Successful", 
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
	$.win.add(loading.getView());
}

init();

Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);

$.win.addEventListener("close", function(){
	Ti.App.fireEvent('personal:refresh');
	$.destroy();
	console.log("window close");
});
