$(document).ready(function(){
	setTimeout(loadMobilePage, 50);
});

function loadMobilePage() {
	//等待父窗口加载完成后，再加载资源信息
	if (typeof parent.lang == "undefined") {
		setTimeout(loadMobilePage, 50);
	} else {
		//加载语言
		loadVehiLang();
		setInputFocusBuleTip("#vehisearch", parent.lang.mobile_search);
		//加载车辆信息
		ajaxLoadMobileInfo();
		$("#btnExport").click(exportExcel);
		$('#vehisearch').on('keyup',function(e) {
			if(e.keyCode == 13) {
				queryVehiInfo();
			}
		});
	}
}

function loadVehiLang(){
	$("#vehiTitle").text(parent.lang.vehicle_navMobile);
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.mobile_name);
	$("#thIdno").text(parent.lang.mobile_idno);
	$("#thSex").text(parent.lang.mobile_sex);
	$("#thCardID").text(parent.lang.mobile_cardid);
	$("#thUserIDNO").text(parent.lang.mobile_userIdno);
	$("#thPost").text(parent.lang.mobile_post);
	$("#thAddress").text(parent.lang.mobile_address);
	$("#thTelephone").text(parent.lang.mobile_telephone);
	$("#thEquip").text(parent.lang.mobile_equip);
	$("#thRemarks").text(parent.lang.mobile_remarks);
	$("#thOperator").text(parent.lang.operator);
	$("#btnSearchMobile").text(parent.lang.search);
	$("#spanBtnExport").text(parent.lang.exportExcel);
}

function ajaxLoadMobileInfo(curpage, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#mobileTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof curpage !== "undefined" && curpage !== "") {
		temp = parseIntDecimal(curpage);
	}
	var action = "TerminalMobileAction_list.action";
	var query = false;
	if (typeof name !== "undefined" && name !== null && name !== "") {
		action = (action + "?name=" + name);
		query = true;
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxMobileList, pagination);
}

function doCheckQuery() {
	return true;
}

function doAjaxMobileList(json,action,success) {
	var empty = true;
	if (success) {
		if (!$.isEmptyObject(json.terminals)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.terminals, function (i, fn) {
				var row = $("#mobileTableTemplate").clone();
				fillRowMobile(row, fn);
				row.find("#tdIndex").text(k);
				row.find("#tdIdno").html("<a href=\"javascript:editMobileInfo('" + fn.idno + "');\">" + fn.idno + "</a>");
				var operatorHtml = "<a href=\"javascript:editMobileInfo('" + fn.idno + "');\">" + parent.lang.edit + "</a>";
				if (json.userMgr) {
					operatorHtml = operatorHtml + "&nbsp;&nbsp;<a href=\"javascript:showPermit('" + fn.idno + "', '" + fn.userAccount.name + "');\">" + parent.lang.vehicle_show_permit + "</a>";
					operatorHtml = operatorHtml + "<a href=\"javascript:vehiclePermit('" + fn.idno + "');\">" + parent.lang.usermgr_devPermit + "</a>";
				}
				row.find("#tdOperator").html(operatorHtml);
				row.attr("id", "tableTop_" + fn.idno);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#mobileTable");
				k = k + 1;
			});
		} 
		$.myajax.showPagination("#mobilePagination");
		json.pagination.id = "#mobilePagination";
		json.pagination.tableId = "#mobileTable";
		$.myajax.initPagination(action, json.pagination, doCheckQuery, doAjaxMobileList);
	}
	$.myajax.showLoading(false);
}

function fillRowMobile(row, terminal) {
	row.find("#tdName").html("<a href=\"javascript:editMobileInfo('" + terminal.idno + "');\">" + terminal.userAccount.name + "</a>");
	if (terminal.userSex == 2) {
		row.find("#tdSex").text(parent.lang.female);
	} else {
		row.find("#tdSex").text(parent.lang.male);
	}
	row.find("#thUserIDNO").text(terminal.userIDNO);
	row.find("#tdTelephone").text(terminal.simCard);	
	if (terminal.userPost == 1) {	
		row.find("#tdPost").text(parent.lang.postMember);
	} else {
		row.find("#tdPost").text(parent.lang.postCaptain);
	}
	row.find("#tdCardID").text(terminal.userCardID);
	row.find("#tdAddress").text(terminal.userAddress);
	row.find("#tdRemarks").text(terminal.remarks);
}

function editMobileInfo(idno) {
	$.dialog({id:'editmobile', title:parent.lang.mobile_edit,content:'url:vehicle/mobile_info.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doEditMobileSuc(idno, data) {
	$.dialog({id:'editmobile'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	$("#mobileTable").find("tr").each(function(){
			if (this.id == ("tableTop_" + idno)) {
				fillRowMobile($(this), data);
			}
		}
	);	
}


function getQueryVehiName() {
	var name = $.trim($("#vehisearch").val());
	if (name == parent.lang.mobile_search) {
		name = "";
	}
	return encodeURIComponent(name);
}

function queryVehiInfo() {
	ajaxLoadMobileInfo(1, getQueryVehiName());
}

//用户车辆许可信息
function vehiclePermit(idno) {
	$.dialog({id:'vehiPermit', title:parent.lang.usermgr_devPermit,content:'url:vehicle/mobile_vehi_permit.html?idno=' + idno
		, min:false, max:false, lock:true});
}

function doVehiclePermitSuc() {
	$.dialog({id:'vehiPermit'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
}

function resetDefaultPwd(idno) {
	if(!confirm(parent.lang.usermgr_user_tipResetDefaultPwd)) {
		return ;
	}

//	disableForm(true);
	$.myajax.showTopLoading(true, parent.lang.usermgr_user_resetPwdNow);
	$.myajax.jsonPost('TerminalMobileAction_resetPwd.action?idno=' + idno, null, false, function(json, success) {	
//		disableForm(false);
		$.myajax.showTopLoading(false);
		//关闭并退出对话框
		if (success) {
			$.dialog.tips(parent.lang.saveok, 1);
		}
	});
}

function exportExcel() {
	document.reportForm.action = "TerminalMobileAction_excel.action?name=" + getQueryVehiName();
	document.reportForm.submit(); 
}

function showPermit(idno, name) {
	$.dialog({id:'showPermit', title:name + "  -  " + parent.lang.vehicle_show_permit_title,content:'url:vehicle/show_permit.html?idno=' + idno
		, min:false, max:false, lock:true});
}

