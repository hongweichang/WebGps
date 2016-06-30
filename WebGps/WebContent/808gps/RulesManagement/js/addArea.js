var api = frameElement.api, W = api.opener;

$(document).ready(function(){
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
}); 

function loadLang(){
	$("#editPwd").text(parent.lang.firstLogin);
	$("#labelPwd1").text(parent.lang.mark_city);
	$("#labelPwd2").text(parent.lang.mark_zone);
	$("#save").text(parent.lang.save);
}

function disableForm(disable) {
	diableInput("#pwd1", disable, true);
	diableInput("#pwd2", disable, true);
}

function ajaxSavePassword() {
	var bdary = new BMap.Boundary();
    var city = document.getElementById("pwd1").value;
    if(city == null || city == ""){
    	alert(parent.lang.mark_write_city);
    	return;
    }
    var zone = document.getElementById("pwd2").value;
    var name = "";
    if(zone == null || zone == ""){
    	name = city;
    }else{
    	name = zone;
    }
    var jingDu="";
    var weiDu="";
    bdary.get(name, function(rs){       //获取行政区域
    	var count = rs.boundaries.length; //行政区域的点有多少个
        for(var i = 0; i < count; i++){
        	var points = rs.boundaries[i].split(";");
        	for (var j = 0; j < points.length; j++) {
				var str = points[j].split(",");
				jingDu += str[0];
				weiDu += str[1];
				if(j != points.length - 1){
					jingDu += ",";
					weiDu += ",";
				}
			}
        }
        var data = {};
        data.jingDu = jingDu;
        data.weiDu = weiDu;
        data.city = city;
        data.zone = zone;
        var action = 'StandardVehicleRuleAction_addCityOrZone.action';
    	disableForm(true);
    	$.myajax.showLoading(true, parent.lang.saving);
    	$.myajax.jsonPost(action, data, false, function(json, success) {
    		disableForm(false);
    		$.myajax.showLoading(false);
    		if (success) {
    			$.dialog.tips(parent.lang.saveok, 1);
    		}
    	});
    });
}