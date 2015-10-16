var args = arguments[0] || {};
var media = args.media;
var photoLoad = 0;
var loading = Alloy.createController("loading");
var croppedImage;

$.getMedia = function(){
	return croppedImage;
};

/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

/**
 * Button cancel
 */
function onCancel(){
	
}

/**
 * Button sent
 */
function image_save(){
	croppedImage = $.inner_box.toImage();
	console.log(croppedImage);
	var evtData = {
        media: croppedImage
   	};
	Ti.App.fireEvent("imagePreview: imageCallback", evtData);
	closeWindow();
}

function init(){
	$.win.add(loading.getView());
	var pWidth = Titanium.Platform.displayCaps.platformWidth;
	$.inner_box.width = pWidth;
	$.inner_box.height = pWidth;
	
	var original_image = $.UI.create("ImageView", {
			image: media,
			zIndex: 10,
			opacity: 0.8,
		});
		
	var baseHeight = original_image.rect.height;
	var baseWidth = original_image.rect.width;
	var offset={};
	var pinching = false;
	var moving = false;
	
	original_image.addEventListener('pinch', function(e) {
			if(moving == false){
				pinching = true;
				console.log(baseHeight+" "+e.scale);
			    original_image.height = baseHeight * e.scale;
			    original_image.width = baseWidth * e.scale;
			    console.log( Math.round(original_image.width) + ' x ' + Math.round(original_image.height));
		   }
	});
	original_image.addEventListener('touchstart', function(e) {
		offset.x = e.x;
		offset.y = e.y;
	    baseHeight = original_image.height || original_image.rect.height;
	    baseWidth = original_image.width || original_image.rect.width;
	});
	/*original_image.addEventListener('touchmove', function(e) {
		if(pinching == false){
			moving = true;
			var moveX = e.x - offset.x + original_image.animatedCenter.x;
			var moveY = e.y - offset.y + original_image.animatedCenter.y;
			console.log(moveX+"="+e.x - offset.x+"+"+original_image.animatedCenter.x);
			original_image.setLeft(moveX);
			original_image.setTop(moveY);
		}
	});*/
	original_image.addEventListener('touchend', function(e) {
		pinching = false;
		moving = false;
	});
	$.inner_box.add(original_image);
}

init();

$.win.addEventListener("close", function(){
	$.destroy();
	console.log("window close");
});
