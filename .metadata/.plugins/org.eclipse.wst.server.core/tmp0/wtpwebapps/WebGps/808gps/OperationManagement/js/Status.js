var api = frameElement.api, W = api.opener;
var type = getUrlParameter("type");
$(document).ready(function(){
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
				display: parent.lang.all , name : '', pclass : 'btnAll',bgcolor : 'gray', hide : false
			}]]
	});
	
	var action = '';
	var colModel = [];
	if(type == 'client') {
		$('#onlineTip').text(parent.lang.clientOnlineCount);
		getOnlineCount();
		action = 'StandardUserAction_getOnlineClientList.action';
		colModel = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.login_account, name : 'account', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.person_name, name : 'name', width : 100, sortable : false, align: 'center', hide: false},
			{display: parent.lang.status_address, name : 'address', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_clientLoginTime, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_clientType, name : 'type', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status_clientUserSvr, name : 'server', width : 100, sortable : false, align: 'center'}
		];
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.login_account+'/'+parent.lang.name, name : 'user', pfloat : 'left'}
		});
	}else if(type == 'device') {
		$('#onlineTip').text(parent.lang.deviceOnlineCount);
		getOnlineCount();
		action = 'StandardDeviceAction_getOnlineDeviceList.action';
		colModel = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.device_number, name : 'devIDNO', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.device_serial, name : 'serialID', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceJingWei, name : 'position', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceGpsTime, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_address, name : 'address', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_network, name : 'network', width : 40, sortable : false, align: 'center', hide: false},
			{display: parent.lang.status_deviceGWaySvr, name : 'server', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceProtocol, name : 'protocol', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceAudioCodec, name : 'audioCodec', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceDiskType, name : 'diskType', width : 100, sortable : false, align: 'center'}
		];
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.device_number, name : 'device', pfloat : 'left'}
		});
	}else if(type == 'unRegDevice') {
		$('#onlineTip').text(parent.lang.unregDeviceCount);
		getOnlineCount();
		action = 'StandardDeviceAction_getUnregDeviceList.action';
		colModel = [
			{display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.operator, name : 'operator', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.device_number, name : 'devIDNO', width : 80, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceJingWei, name : 'position', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceGpsTime, name : 'time', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_address, name : 'address', width : 150, sortable : false, align: 'center'},
			{display: parent.lang.status_network, name : 'network', width : 40, sortable : false, align: 'center', hide: false},
			{display: parent.lang.status_deviceGWaySvr, name : 'server', width : 100, sortable : false, align: 'center'},
			{display: parent.lang.status_deviceProtocol, name : 'protocol', width : 100, sortable : false, align: 'center'}
		];
		$('#toolbar-search').flexPanel({
			SerachBarModel :
				{display: parent.lang.device_number, name : 'device', pfloat : 'left'}
		});
	}

	$('#infoTable').flexigrid({
		url: action,
		dataType: 'json',
		colModel : colModel,
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
//				checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		autoload: true,
		useRp: true,
		title: false,
		rp: 15,
		showTableToggleBtn: true,
		showToggleBtn: false,
		width: 'auto',//Math.round(6 * parent.screenWidth/7) - 5,
		onSubmit: false,//addFormData,
		height: 350
	});
	
	$('#toolbar-search .y-btn').on('click',function(){
		loadQuery(1);
	});
	$('#toolbar-search .search-input').on('keydown',function(e){
		if(e.keyCode == 13) {
			loadQuery(2);
		}
	});
	
	$('.btnAll','#toolbar-btn').on('click',function(){
		loadQuery(3);
	});
}

function loadQuery(type) {
	var name = '';
	if(type == '1' || type == '2') {
		name = $('#toolbar-search .search-input').val();
	}
	var params = [];
	params.push({
		name: 'name',
		value: name
	});
	$('#infoTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'account') {
		if(row['userAccount']) {
			pos = row['userAccount'].account;
		}
	}else if(name == 'name') {
		if(type == 'client' && row['userAccount']) {
			pos = row['userAccount'].name;
		}
	}else if(name == 'address') {
		if(type =='client') {
			pos = row['clientIP'] + ',' + row['port'];
		}else {
			pos = row['devStatus'].ip + ',' + row['devStatus'].port;
		}
	}else if(name == 'time') {
		if(type == 'client') {
			pos = dateFormat2TimeString(new Date(row['updateTime']));
		}else {
			pos = dateFormat2TimeString(new Date(row['devStatus'].gpsTime));
		}
	}else if(name == 'company') {
		if(type == 'client' && row['userAccount']) {
			pos = row['userAccount'].company.name;
		}else if(row['device']) {
			pos = row['device'].company.name;
		}
	}else if(name == 'type') {
		if(type == 'client') {
			pos = getClientType(row[name]);
		}
	}else if(name == 'server') {
		if(row['svrInfo']) {
			pos = row['svrInfo'].name;
		}
	}else if(name == 'devIDNO') {
		pos = row['devStatus'].devIdno;
	}else if(name == 'serialID') {
		pos = row['device'].serialID;
	}else if(name == 'network') {
		pos = getNetworkName(row['devStatus'].network,row['devStatus'].netName);
	}else if(name == 'position') {
		var position = gpsGetPosition(row['devStatus'].jingDu,row['devStatus'].weiDu,row['devStatus'].status1);
		if(position.length > 2) {
			pos = "<a class=\"blue\" href=\"javascript:showMapPosition('" + row['devStatus'].devIdno + "','" + row['devStatus'].jingDu + "','" + row['devStatus'].weiDu + "');\">" + position + "</a>";
		}
	}else if(name == 'protocol') {
		pos = getProtocolName(row['devStatus'].protocol) + "-" + (row['devStatus'].factoryDevType>>16);
	}else if(name == 'audioCodec') {
		pos = getAudioCodecName(row['device'].audioCodec);
	}else if(name == 'diskType') {
		pos = getDiskTypeName(row['device'].diskType);
	}else if(name == 'operator') {
		pos = "<a href=\"javascript:addUnregDevice('" + row['devStatus'].devIdno + "');\"><span id=\"linkSale\">" + parent.lang.add + "</span></a>";
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

//添加设备
function addUnregDevice(idno) {
	W.addDevice(idno);
}

//获取在线数目
function getOnlineCount() {
	var action = '';
	if(type == 'client') {
		action = 'StandardUserAction_getOnlineClientCount.action';
	}else if(type == 'device') {
		action = 'StandardDeviceAction_getOnlineDeviceCount.action';
	}else if(type == 'unRegDevice') {
		action = 'StandardDeviceAction_getUnregDeviceCount.action';	
	}
	$.myajax.jsonGet( action, function(json,action,success){
		if(success) {
			if(type == 'client') {
				$('#onlineCount').text(json.onlineCount);
			}else if(type == 'device') {
				$('#onlineCount').text(json.onlineCount);
			}else if(type == 'unRegDevice') {
				$('#onlineCount').text(json.unregCount);	
			}
		};
	}, null);
}
//获取客户端类型
function getClientType(index) {
	var clientType = '';
	if (index == 1) {
		clientType = parent.lang.status_clientWindow;
	} else if (index == 2) {
		clientType = parent.lang.status_clientWeb;
	} else if (index == 3) {
		clientType = parent.lang.status_clientIphone;
	} 
	return clientType;
}
//获取网络类型
function getNetworkName(index,name) {
	var netName = "";
	var network = parseIntDecimal(index);
	if (network == 1) {
		netName = "WIFI(" + name + ")";
	} else if (network == 0) {
		netName = "3G";
	} else if (network == 3) {
		netName = "4G";
	}  else {
		netName = "NET";
	}
	return netName;
}

function getProtocolName(protocol) {
	//#define MDVR_PROTOCOL_TYPE_WKP			1	//WKP协议
	//#define MDVR_PROTOCOL_TYPE_TTX			2	//通天星协议
	//#define MDVR_PROTOCOL_TYPE_TQ			3	//天琴协议
	//#define MDVR_PROTOCOL_TYPE_HANV			4	//HANV部标协议
	//#define MDVR_PROTOCOL_TYPE_GOOME		5	//谷米协议（兼容泰比特）
	//#define MDVR_PROTOCOL_TYPE_808			6	//808部标协议
	//#define MDVR_PROTOCOL_TYPE_RM			7	//RM部标协议
	//#define MDVR_PROTOCOL_TYPE_YD			8	//YD协议
	var proName = "";
	if (protocol == 1) {
		proName = "$$dc";
	} else if (protocol == 2) {
		proName = "$$dc-EX";
	} else if (protocol == 3) {
		proName = "TianQing";
	} else if (protocol == 4) {
		proName = "HV";
	} else if (protocol == 5) {
		proName = "GOOME";
	} else if (protocol == 6) {
		proName = "808";
	} else if (protocol == 7) {
		proName = "RM";
	} else if (protocol == 8) {
		proName = "YD";
	}
	return proName;
}

function getAudioCodecName(codec) {
//	#define PLAY_A_TYPE_UNKOWN					0
//	#define PLAY_A_TYPE_G726_40KBPS				1
//	#define PLAY_A_TYPE_ADPCM					2
//	#define PLAY_A_TYPE_G726_MEDIA_40KBPS		3
//	#define PLAY_A_TYPE_G726_MEDIA_32KBPS		4
//	#define PLAY_A_TYPE_G726_MEDIA_24KBPS		5
//	#define PLAY_A_TYPE_G726_MEDIA_16KBPS		6
//	#define PLAY_A_TYPE_G726_32KBPS				7
//	#define PLAY_A_TYPE_G726_24KBPS				8
//	#define PLAY_A_TYPE_G726_16KBPS				9
//	#define PLAY_A_TYPE_G711A					10
//	#define PLAY_A_TYPE_G711U					11
	var proName = "";
	if (codec == 1) {
		proName = "G726_40KBPS";
	} else if (codec == 2) {
		proName = "ADPCM";
	} else if (codec == 3) {
		proName = "G726_MEDIA_40KBPS";
	} else if (codec == 4) {
		proName = "G726_MEDIA_32KBPS";
	} else if (codec == 5) {
		proName = "G726_MEDIA_24KBPS";
	} else if (codec == 6) {
		proName = "G726_MEDIA_16KBPS";
	} else if (codec == 7) {
		proName = "G726_32KBPS";
	} else if (codec == 8) {
		proName = "G726_24KBPS";
	} else if (codec == 9) {
		proName = "G726_16KBPS";
	} else if (codec == 10) {
		proName = "G711A";
	} else if (codec == 11) {
		proName = "G711U";
	}
	return proName;
}

function getDiskTypeName(diskType) {
	var typeName = "";
	if (diskType == 1) {
		typeName = "SD";
	} else if (diskType == 2) {
		typeName = "HDD";
	} else if (diskType == 3) {
		typeName = "SSD";
	}
	return typeName;
}

function showMapPosition(name, jingDu, weiDu) {
	var url = "";
	if (parent.langIsChinese()) {
		url = 'url:'+getRootPath()+'/map/map_position_baidu.html?toMap=2&isSystem=808gps&name=';
//		url = 'url:report/map_position_cn.html?name=';
	} else {
		url = 'url:'+getRootPath()+'/map/map_position.html?toMap=1&isSystem=808gps&name=';
	}
	$.dialog({id:'mapposition', title:parent.lang.report_show_position,content:url + encodeURI(name) + '&jingDu=' + jingDu + '&weiDu=' + weiDu
		, min:false, max:false, lock:true});
}
