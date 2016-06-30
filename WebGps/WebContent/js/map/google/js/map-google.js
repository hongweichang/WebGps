// JavaScript Document
window.mapobject = window.google || {};//设置全局的命名空间
mapobject.maps = google.maps || {};
mapobject.maps.MapTypeId = google.maps.MapTypeId||{};
mapobject.maps.initMap = function(id, jindu, weidu, zoom){
	this.MAP_CENTER_LAT = weidu;
	this.MAP_CENTER_LNG = jindu;
	
	this.MAX_ZOOM = zoom;
	this.container = id;
	var myLatlng = new mapobject.maps.LatLng(this.MAP_CENTER_LAT,this.MAP_CENTER_LNG);
	var myOptions = {zoom:this.MAX_ZOOM,scaleControl:true,center:myLatlng,mapTypeId:mapobject.maps.MapTypeId.ROADMAP,mapTypeControlOptions:{mapTypeIds:[mapobject.maps.MapTypeId.ROADMAP,mapobject.maps.MapTypeId.SATELLITE]}};
	var map = new mapobject.maps.Map(document.getElementById(this.container),myOptions);
	
	overlay = new mapobject.maps.OverlayView();
	overlay.draw = function() {};
	overlay.setMap(map);
	return map;
};

//单击设置marker在地图中心，缩放级别放
function dblclickSetRoomCenter(weidu,jingdu,map){
	var _zoom = map.getZoom();
	if(_zoom<11){
		map.setCenter(new mapobject.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(11);
	}else if(_zoom>=11&&_zoom<=18){
		map.setCenter(new mapobject.maps.LatLng(Number(weidu), Number(jingdu)));
		map.setZoom(_zoom+2);
	}
};

var geocoder = new google.maps.Geocoder();
//调用googleAPI进行地址解析
function parseAddress (weidu,jingdu,arr,name){
	if (!initParseAddress) {
		return ;
	}
	if(document.getElementById(arr)!=null){
		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			if (name != "") {
				_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
			} else {
				_str = "&nbsp;";
			}
			if (status == google.maps.GeocoderStatus.OK) {
				_str += results[0].formatted_address;
			}else{
				//_str += "Geocode was not successful for the following reason: " + status;
			}
			document.getElementById(arr).innerHTML=_str;
		});
	}
}

//调用googleAPI进行地址解析
function parseAddressEx (weidu,jingdu,callback){
	geocoder.geocode({"address":weidu+","+jingdu}, callback);
}

//调用googleAPI进行地址解析
function myParseAddress(jingdu,weidu,userdata){
	geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
		var address = "";
		var ret = false;
		var error = 0;
		if (status == google.maps.GeocoderStatus.OK) {
			address = results[0].formatted_address;
			ret = true;
		}else{
			if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
				error = 1;
			} else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
				error = 2;
			} else if (status == google.maps.GeocoderStatus.REQUEST_DENIED) {
				error = 3;
			} else {
				error = 4;
			}
			//ZERO_RESULTS		用于表示地理编码成功，但未返回任何结果。如果地理编码过程中传递的偏远位置 address 或 latlng 并不存在，就会出现这种情况
			//OVER_QUERY_LIMIT	用于表示您超出了自己的配额
			//REQUEST_DENIED	用于表示您的请求遭拒，这通常是由于缺少 sensor 参数
			//INVALID_REQUEST	通常用于表示缺少查询内容（address 或 latlng）
			//_str += "Geocode was not successful for the following reason: " + status;
		}
		if (isChrome) {
			app.sendMessage('OnParseAddress', [ret, address, userdata.toString(), error]);
		} else {
			window.external.OnParseAddress(ret, address, userdata.toString(), error);
		}
	});
}