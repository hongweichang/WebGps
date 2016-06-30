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
	}else{
		alert(lg.zoomMax);
	}
};

var geocoder = new google.maps.Geocoder();
//调用googleAPI进行地址解析
function parseAddress (weidu,jingdu,arr,name){
	if(document.getElementById(arr)!=null){
		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
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