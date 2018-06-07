/*
var favicon;

chrome.extension.onMessage.addListener( 
	function(request, sender, sendResponse) {
		favicon = $('link[rel="shortcut icon"]').attr("href");
		console.log( favicon );
		alert( favicon );
	}
);
*/

var tabUrl;
var tabTitle;

//获取当前标签的网址和标题
function getCurrentTabUrl(callback){
	chrome.tabs.getSelected(function(tab){
		tabUrl = tab.url;
		tabTitle = tab.title;
		callback(tabUrl,tabTitle);
	});
}

//监听点击事件
document.addEventListener("DOMContentLoaded", function() {
	getCurrentTabUrl( function(tabUrl,tabTitle){
		$("#website").html("URL：" + tabUrl);
		$("#title").html("title：" + tabTitle);
//		$("#QRcode").qrcode(tabUrl);

		//读取favicon，页面中的link中设置，或在域名根目录
		var host = urlGetHost( tabUrl );
//		console.log( host );
		var faviconURL = host+"/favicon.ico";
//		console.log( favicon );
		var logoImg = new Image();
		logoImg.src = faviconURL;
		logoImg.onerror = function(){
//			console.log("favicon no exist");
			makeQR( tabUrl );			//无logo二维码
		}
		
//		console.log( logoImg );
		logoImg.onload = function(){
//			console.log( logoImg.width );console.log( logoImg.height );
			makeQR( tabUrl, logoImg );	//有logo二维码
		}
		
/*		$("#QRcode").qrcode({
			text:tabUrl,
			ecLevel: 'H',
//			mode: 4, mSize: 0.3, //mPosX: 0.5, mPosY: 0.5,
//			image: $("#testImg") [0],
//			image: logoImg
		});
		
		var canvas = $("#QRcode").children("canvas")[0];
//		console.log(canvas);
		var imgBase64 = canvas.toDataURL("image/png");

		$("#downBtn").attr("href", imgBase64).attr("download", tabTitle );
*/
	});
});

//生成QR code
function makeQR( url, img=null ){
	if( !img ){		//纯URL
		$("#QRcode").qrcode({
			text:tabUrl,
			ecLevel: "H",
			background: "#FFF"
		});
	}else{			//包含Logo
		$("#QRcode").qrcode({
			text:tabUrl,
			ecLevel: "H",
			background: "#FFF",
			mode: 4, mSize: 0.2, 
			image: img
		});
	}
	var canvas = $("#QRcode").children("canvas")[0];
//		console.log(canvas);
	var imgBase64 = canvas.toDataURL("image/png");

	$("#downBtn").attr("href", imgBase64).attr("download", tabTitle );
}


//从URL中截取HOST
function urlGetHost( url ){
	var res0Arr = url.split("//");
	//console.log( res0Arr );
	var res1Arr = res0Arr[1].split("/");
	return res0Arr[0] + "//" + res1Arr[0];
}