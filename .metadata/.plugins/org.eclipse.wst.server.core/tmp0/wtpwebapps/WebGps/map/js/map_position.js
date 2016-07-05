var api = frameElement.api, W = api.opener;
var GFRAME = null;
var vehiIdno = "100001";
var gpsValue = null;
var Geocoder = null; 
var toMap = "";
var isSystem = "";
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载地图信息
//	if(toMap==2){
//		initCommon("../google/theme/");
//	}else{
//		initCommon("theme/");
//	}
	
	GFRAME = new mapframe();
	GFRAME.createMap(true);
	toMap = getUrlParameter("toMap");
	isSystem = getUrlParameter("isSystem");
	if (toMap==2) {
		Geocoder = new BMap.Geocoder();
	}
	GFRAME.imagePath = "../js/map/image/";
	//在地图上显示车辆图标
	ajaxLoadInfo();
}); 

function ajaxLoadInfo() {
	var jingDu = getUrlParameter("jingDu");
	var weiDu = getUrlParameter("weiDu");
	$.myajax.showLoading(true, parent.lang.loading, this);
	
	var url = "";
	if (isSystem=="true") {
		url = "SysStatusAction_position.action?jingDu=" + jingDu + "&weiDu=" + weiDu+ "&toMap="+ toMap;
	} else if(isSystem=="808gps"){
		url = "StandardLoginAction_position.action?jingDu=" + jingDu + "&weiDu=" + weiDu+ "&toMap="+ toMap;
	}else {
		url = "PriviAction_position.action?jingDu=" + jingDu + "&weiDu=" + weiDu+ "&toMap="+ toMap;
	}
	//向服务器发送ajax请求
	$.myajax.jsonGet( url, function(json,action,success){
		if (success) {
			gpsValue = json.gpsValue;
			showPosition();
		}
		$.myajax.showLoading(false);
	}, null);
}

function showPosition() {
	if (!isLoadMapSuc()) {
		setTimeout(showPosition, 200);
	} else {
		//地图上显示位置
		insertVehicle(vehiIdno);
		var name = decodeURI(getUrlParameter("name"));
		setVehiName(vehiIdno, name);
		updateVehicle(vehiIdno, gpsValue.mapJingDu, gpsValue.mapWeiDu, 0, 7, "", "", "");
		selectVehicleEx(vehiIdno);
	}
}
