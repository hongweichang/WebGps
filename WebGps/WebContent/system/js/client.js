$(document).ready(function(){
	setTimeout(loadClientPage, 50);
}); 

function loadClientPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadClientPage, 50);
	} else {
		loadLang();
		loadClientList(1, null, decodeURIComponent(getUrlParameter("name")));
	}
}

var clientPage = "all";

function loadLang(){
	$("#clientTitle").text(parent.lang.client_title);
	$("#labelClientCount").text(parent.lang.client_labelClientCount);
	$("#labelUserCount").text(parent.lang.home_clientUserCount);
	$("#addClient").text(parent.lang.add);
	$("#spanClientOperatorTip").text(parent.lang.client_operatorTip);
	initClientHead();
	updatePageName();
}

function getPageName() {
	var name = parent.lang.unkown;
	if (clientPage == "all") {
		name = "";
	} else if(devicePage == "view") {
		name = parent.lang.client_view;
	}
	return name;
}

function updatePageName() {
	$("#pageName").text(getPageName());
}

function doEditClientSuc(id, data) {
	$.dialog({id:'editclient'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#clientTable").find("tr").each(function(){
			if (this.id == ("clientTable_" + id)) {
				fillRowClient($(this), data);
			}
		}
	);	
}