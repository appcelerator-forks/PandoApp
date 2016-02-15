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
	            allowImageEditing:false,
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
		item_desc: $.item_desc.value,
		photoLoad: photoLoad,
		longitude: longitude,
		latitude: latitude
		};
		console.log(records);
	loading.start();
	API.callByPostImage({url: "addItemUrl", params: records}, 
		function(responseText){
			console.log("addItemUrl");
			console.log(responseText);
			var result = JSON.parse(responseText);
			if(result.status == "error"){
				Common.createAlert("Error", result.data[0]);
				loading.finish();
				return false;
			}else{
				loading.finish();
				Common.createAlert("Congraturation", "Item Upload Successful", 
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
	console.log(image_preview);
	var media = image_preview.getMedia();
	$.item_image.image = media;
	photoLoad = 1;
}

function openCategorylist(e){
	$.item_desc.blur();
	$.item_name.blur();
	var category_value = $.item_category.value || "";

	var model =  Alloy.createCollection("category");
	data = model.getData();
	
	var view_container = $.UI.create("View", {
		classes:['wfill','hsize','vert'],
		backgroundColor: "#ffffff",
		bottom: 0,
	});
	
	var button_selected = $.UI.create("Button",{
		classes:['button'],
		title: "Select",
		bottom: 10,
	});
	
	var picker = Ti.UI.createPicker();
	
	var pickerdata = [];
	var selected_row = 0;
	for (var i=0; i < data.length; i++) {
		if(category_value == data[i].c_name){
			selected_row = i;
		}
	  	pickerdata[i] = Ti.UI.createPickerRow({title: data[i].c_name});
	};
	
	picker.add(pickerdata);
	
	view_container.add(picker);
	view_container.add(button_selected);
	
	button_selected.addEventListener("click", function(e){
		$.item_category.value = picker.getSelectedRow(0).title;
		view_container.removeAllChildren();
		$.win.remove(view_container);
	});
	
	$.win.add(view_container);
	picker.setSelectedRow(0, selected_row, false);
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

$.item_category.addEventListener("click", openCategorylist);
$.item_desc.addEventListener('focus',function(e){
    if(e.source.value == e.source._hintText){
        e.source.value = "";
        e.source.color = "#000000";
    }
});
$.item_desc.addEventListener('blur',function(e){
    if(e.source.value==""){
        e.source.value = e.source._hintText;
        e.source.color = "#cccccc";
    }
});

Ti.App.addEventListener("imagePreview: imageCallback", imageCallback);

$.win.addEventListener("close", function(){
	Ti.App.fireEvent('manage_item:refresh');
	$.destroy();
	console.log("window close");
});
