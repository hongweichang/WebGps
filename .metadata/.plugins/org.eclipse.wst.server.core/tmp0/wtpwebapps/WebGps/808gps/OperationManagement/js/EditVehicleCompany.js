var api = frameElement.api, W = api.opener;
var sid = null;
var companys = [];
var companyTree; 
var companyId = null;
var vehiIds = getUrlParameter("vehiIds");
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}]
		]
	});
	//加载语言
	loadLang();
	//加载车辆树
	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.setImagePath("../../js/dxtree/imgs/");
	//companyTree.enableCheckBoxes(1);
	//companyTree.enableThreeStateCheckboxes(true);
	companyTree.setOnClickHandler(doClickTree); //单击事件
	companys = parent.companys;
	sid = parent.companyId;
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parent.companyId) {
			sid = companys[i].parentId;
		}
	}
	companyTree.fillCompany(companys, sid);
	//companyTree.setOnDblClickHandler(doDblClickTree); //双击事件
	//companyTree.setOnOpenEndHandler(doOpenOrCloseTree); //节点展开/合拢结束事件
	setPanelWidth();
	$(".btnSave").click(ajaxSaveVehis);
}); 

function loadLang(){
	$("#searchCompany").text(parent.lang.label_search_company);
}

function setPanelWidth() {
	var width = $(window).width();
	$('.companyList').width(width- 2);
	$('#company_tree').height($(window).height() - $('.companyList .labelList').height() - $('.companyList .searchList').height() - 60);
}

function doClickTree() {
	companyId = companyTree.getVehiGroupId(companyTree.getSelectedItemId());
}

function searchCompany() {
	setTimeout(function() {
		var name = $.trim($("#name").val());
		if (name != "" && companys != null) {
			companyTree.searchCompany(name);
		} 
	}, 200);
}

function ajaxSaveVehis() {
	if(companyId == null || companyId == sid){
		$.dialog.tips(parent.lang.selectCompanyTip, 1);
		return;
	}
	var data={};
	var company = {};
	company.id = companyId;
	if(company.id != null && company.id != '') {
		data.company = company;
	}	
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	var action = 'StandardVehicleAction_exitVehiCompany.action?vehiIds=' + vehiIds;
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		//关闭并退出对话框
		if (success) {
			W.doEditVehiCompanySuccess();
		}
	});
}