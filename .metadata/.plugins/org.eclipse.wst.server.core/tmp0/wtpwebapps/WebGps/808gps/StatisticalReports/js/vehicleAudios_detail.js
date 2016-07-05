$(document).ready(function(){
	setTimeout(loadOfflineUpgradeDetailPage, 50);
});

var searchOpt = new searchOption(false, true);
var markerList = null; 

function loadOfflineUpgradeDetailPage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadOfflineUpgradeDetailPage, 50);
	} else {
		$('#toolbar-btn').flexPanel({
			ButtonsModel : [
				[{display: '', name : '', pclass : 'btnQuery',
					bgcolor : 'gray', hide : false}]
			]
		});
		$('#select-completion').flexPanel({
			ComBoboxModel :{
				button :
				[
					[{
						display: parent.lang.all, name : 'completion', pid : 'completion', pclass : 'buttom',bgcolor : 'gray',bgicon : 'true', hide : false,hidden: true
					}]
				],
				combox: {name : 'completion', option : arrayToStr(getCompletions())}
			}	
		});
		$('#selectName').flexPanel({
			InputModel : {display: parent.lang.selectVehicleTip,value:'',name : 'vehiIdnos', pid : 'vehiIdnos', pclass : 'buttom',bgicon : '',hidden:true, hide : false} 
		});
		
		$('#selecttime').flexPanel({
			ComBoboxModel :{
				input : {name : 'selecttime',pclass : 'buttom',bgicon : 'true',hidden: true,readonly: true},
				combox: 
					{name : 'selecttime', option : arrayToStr(getSelectTime(1))}
			}	
		});
		
		$('#select-selecttime li').each(function() {
			var index= $(this).attr('data-index');
			$(this).on('click',function() {
				selectTime(index, 1);
			});
			if(index == 0) {
				$(this).click();
			}
		});
		if(parent.screenWidth < 1280) {
			$('#sysuserLogDate').css('width','1100px');
		}
		//加载语言
		loadOfflineUpgradeDetailLang();
		//加载搜索选项
		searchOpt.initSearchOption();
		$('#combox-vehiIdnos').on('click keyup',selVehicle);
		$.myajax.showPagination('#clientPagination');
		$(".btnQuery").click(queryVehicleAudiosDetail);
		loadReportTableWidth();
		
	}
}

function loadOfflineUpgradeDetailLang(){
	searchOpt.loadLang();
	$("#reportTitle").text(parent.lang.report_vehicle_audio);
	$("#labelCompletion").text(parent.lang.mediaStatus);
}

function queryVehicleAudiosDetail() {
	var query = searchOpt.getQueryDataNew(false);
	if (query === null) {
		return ;
	}
	
	if($('#hidden-vehiIdnos').val() == null || $('#hidden-vehiIdnos').val() == '') {
		alert(parent.lang.report_selectVehiNullErr);
		return;
	}
	var pagintion = {};
	pagintion.currentPage = 1;
	pagintion.pageRecords = 24;
	
	var data = {};
	data.vehiIdnos = $('#hidden-vehiIdnos').val();
	
	var action = "StandardReportMediaAction_audioList.action";
	action += '?begintime='+query.begindate+'&endtime='+query.enddate+'&filetype='+$("#hidden-completion").val();
	$.myajax.jsonGetEx(action,doajaxParam,pagintion,data);
}

function doajaxParam(json, action, success){
	if(success) {
		$('#vehicleAudios').empty();
		if(json.infos == null || json.infos.length == 0){
			alert(parent.lang.noRecord);
		}
		$.each(json.infos, function(index,photo) {
			dis(index,photo);
		});
		$.myajax.showPagination("#clientPagination");
		json.pagination.id = "#clientPagination";
		json.pagination.tableId = "#clientTable";
		var data = {};
		data.vehiIdnos = $('#hidden-vehiIdnos').val();
		$.myajax.initPagination(action, json.pagination,doCheckAjaxParam,doajaxParam,data);
		$.myajax.showLoading(false);
	}
}

function doCheckAjaxParam() {
	return true;
}

var selIds;
//选择车辆
function selVehicle() {
	$.dialog({id:'info', title:parent.lang.selectVehicleTitle,content: 'url:StatisticalReports/selectInfo.html?type=selVehicle&singleSelect=true&selectAll=false&isOil=false',
		width:'800px',height:'530px', min:false, max:false, lock:true});
}

function doSelectVehicle(ids,vehicleList) {
	if(ids != null && ids == '0') {
		$('#combox-vehiIdnos').val(parent.lang.all_vehicles);
		$('#hidden-vehiIdnos').val(getNewArrayByArray(parent.vehicleList,'name').toString());
	}else {
		selIds = ids;
		if(ids != null && ids.split(',').length > 0) {
			if(ids.split(',').length > 1) {
				$('#combox-vehiIdnos').val(parent.lang.isSelected + ids.split(',').length);
			}else {
				$('#combox-vehiIdnos').val(vehicleList);
			}
		}
		$('#hidden-vehiIdnos').val(vehicleList);
	}
	$.dialog({id:'info'}).close();
}

function doExit() {
	$.dialog({id:'info'}).close();
}

function getCompletions() {
	var completions = [];
	completions.push({id:'2',name:parent.lang.all});
	completions.push({id:'0',name:parent.lang.normal});
	completions.push({id:'1',name:parent.lang.monitor_vehiStatusAlarm});
	return completions;
}

function dis(index,photo) {
	var content = '';
	content += '<div id="photo'+index+'" class="photo" >';
	content += '	<img src="image/icon6.jpg" class="photo-img" alt="" id=img'+ index +'  />';
	content += '	<span class="channel">'+ parent.lang.channel + ':' + photo.channel +'</span>';
	content += '	<span class="date" style="margin-left: 5px">'+ dateTime2TimeString(photo.fileSTime) +'</span>';
	content += '<form method="post" action="StandardReportMediaAction_getMedia.action?filePath='+photo.filePath+'&fileSize='+photo.fileSize+'"><input type="submit" style="margin-left: 5px" value="' + parent.lang.download + '"/></form>';
	content += '</div>';
	$('#vehicleAudios').append(content);
}