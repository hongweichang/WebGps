$(document).ready(function(){
	loadVehicleNav();
});

function loadVehicleNav() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadVehicleNav, 50);
	} else {
		loadLang();
	}
}

function loadLang(){
	$("#liVehicle").text(parent.lang.vehicle_navVehicle);
	$("#liGroup").text(parent.lang.vehicle_navGroup);
}

function switchVehiPage(page, url) {
	//切换导航焦点
	var allpages = ["vehicle","group"];
	var allnodes = document.getElementsByName('vehiMenuItem');
	for(var i=0; i<allpages.length; i++){
		if(page == allpages[i]){
			allnodes[i].className = "befor";
		}else{
			allnodes[i].className = "";
		}
	}
	//进行页面重定向
	parent.localReportUrl(url);
}
