var args = arguments[0] || {};
var item_id = args.item_id;
var owner = args.owner || 0;
var owner_id = args.owner_id || 0;
var code = args.code || 0;
var loading = Alloy.createController("loading");
console.log(item_id);
/**
 * Closes the Window
 */
function closeWindow(){
	$.win.close();
}

function render_scanner(){
	var SCANNER = require("scanner");
	
	// Create a window to add the picker to and display it. 
	var window = SCANNER.createScannerWindow();
		
	// create start scanner button
	var button = SCANNER.createScannerButton(); 
	
	SCANNER.init(window); 
	SCANNER.openScanner("1");
}

function render_qrcode(){
	var qrcode = require('qrcode');
	console.log(item_id+"||"+code+"||"+owner_id);
	var userQR = qrcode.QRCode({
		typeNumber: 4,
		errorCorrectLevel: 'M'
	});
	
	var qrcodeView = userQR.createQRCodeView({
		width: 200,
		height: 200,
		margin: 4,
		text: item_id+"||"+code+"||"+owner_id
	}); 
	
	return qrcodeView;
}

function update_compelete_code(e){
	console.log(e.res);
	var res = e.res;
	var _item_id = res[0];
	var _code = res[1];
	var u_id = Ti.App.Properties.getString('user_id') || 0;
	
	
	API.callByPost({url: "validateTransactionCodeUrl", params:{code: _code, item_id: _item_id, receiver_id: u_id}}, function(responseText){
		var res = JSON.parse(responseText);
		if(res.status == "success"){
			console.log(_item_id+" "+_code+" "+u_id+" after scan");
			var arr = res.data;
			console.log(arr);
			var items = Alloy.createCollection('items');
			items.saveArray(arr);
			Common.createAlert("Notification", "Item pairing is successful.", function(e){
				Ti.App.fireEvent('conversation:refresh');
			});
			
			closeWindow();
		}else{
			Common.createAlert("Notification", res.error_code, render_scanner);
		}
	});
}

function refresh(){
	loading.start();
	if(!owner){
		render_scanner();
	}else{
		$.qrcode.add(render_qrcode());
	}
	loading.finish();
}

function init(){
	$.win.add(loading.getView());
	loading.start();
	if(!owner){
		render_scanner();
	}else{
		$.qrcode.add(render_qrcode());
	}
	loading.finish();
}

init();

Ti.App.addEventListener('qr_code:update_compelete_code', update_compelete_code);

$.win.addEventListener("close", function(){
	Ti.App.removeEventListener('qr_code:update_compelete_code', update_compelete_code);
	$.destroy();
	console.log("window close");
});

