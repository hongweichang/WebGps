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

//var geocoder = new BMap.Geocoder();
//var geocoder = new google.maps.Geocoder();
//调用googleAPI进行地址解析
function parseAddress (weidu,jingdu,arr,name){
	if (!initParseAddress) {
		return ;
	}
	if(typeof Geocoder != "undefined" && document.getElementById(arr)!=null){
		var point = new BMap.Point(jingdu, weidu);
		Geocoder.getLocation(point, function(results){
//		geocoder.geocode({"address":weidu+","+jingdu}, function(results,status) {
			if (name != "") {
				_str = "&nbsp;<span class='b'>" + name + ":</span>&nbsp;";
			} else {
				_str = "&nbsp;";
			}
			
			//if (status == google.maps.GeocoderStatus.OK) {
			if (results != null) {
				_str += results.address;
				//_str += results[0].formatted_address;
			}else{
				//_str += "Geocode was not successful for the following reason: " + status;
			}
			document.getElementById(arr).innerHTML=_str;
		});
	}
}

//调用googleAPI进行地址解析
function myParseAddress(jingdu,weidu,userdata){
	//var ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&callback=renderReverse&location=39.983424,116.322987&output=json&pois=0";
	var ajaxUrl = "http://api.map.baidu.com/geocoder/v2/?ak=A5XwmfizKyOvbYyvmxDLTZYi&output=json&pois=0&location=" + weidu + "," + jingdu + "&callback=?";
	$.jsonp({
    		url: ajaxUrl,
    		success: function (data) {
    			var address = "";
			var ret = false;
			var error = 0;
			if (data.status == 0) {
				address = data.result.formatted_address;
				ret = true;
			}
			try {
				if (isChrome) {
					app.sendMessage('OnParseAddress', [ret, address, userdata.toString(), error]);
				} else {
					window.external.OnParseAddress(ret, address, userdata.toString(), error);
				}
			} catch(err) { }
    		},
	    	error: function (xOptions, textStatus) {
        		try {
        			if (isChrome) {
					app.sendMessage('OnParseAddress', [false, "", userdata.toString(), 0]);
				} else {
					window.external.OnParseAddress(false, "", userdata.toString(), 0);
				}
			} catch(err) { }
    		}
	});
	/*
	$.ajax({ type: "GET",
		url: ajaxUrl,
		dataType: "jsonp", 
		success: function(data){
			return;
			var address = "";
			var ret = false;
			var error = 0;
			if (data.status == 0) {
				address = data.result.formatted_address;
			}
			try {
				//window.external.OnParseAddress(ret, address, userdata.toString(), error);
			} catch(err) { }
   		},
   		error: function (XMLHttpRequest, textStatus, errorThrown) { 
   			return;
   			try {
				//window.external.OnParseAddress(false, "", userdata.toString(), 0);
			} catch(err) { }
		},
		complete: function (xhr, textStatus) { 
			if (typeof(xhr) !== 'undefined') {
				if (typeof(xhr.onreadystatechange) !== 'unknown' ) {
					xhr.onreadystatechange = null;
				} 
				if (typeof(xhr.abort) !== 'unknown' ) {
					xhr.abort = null;
				}
				xhr = null;
			}
		}
   	});*/
   	
   	/*
	var geocoder = new BMap.Geocoder();
	var point = new BMap.Point(jingdu, weidu);
	geocoder.getLocation(point, function(results){
		var address = "";
		var ret = false;
		var error = 0;
		if (results != null) {
			address = results.address;
			ret = true;
		}
		
		try {
			window.external.OnParseAddress(ret, address, userdata.toString(), error);
		} catch(err) { }

		jingdu = null;
		weidu = null;
		userdata = null;
		point = null;
	});*/
}

