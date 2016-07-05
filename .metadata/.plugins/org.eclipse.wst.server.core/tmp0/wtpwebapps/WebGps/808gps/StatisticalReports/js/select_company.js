var api = frameElement.api, W = api.opener;
var companyTree;
var searchTimer = null;
var onlySelectOne = false;
var parentId = 0;
var companyGroupList = parent.companys;
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [
			[{display: parent.lang.save, name : '', pclass : 'btnSave',
				bgcolor : 'gray', hide : false}]
		]
	});
	//加载语言
	loadSelectCompanyLang();
	//初始化树
	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.setImagePath("../../js/dxtree/imgs/");
	var temp = getUrlParameter("onlySelectOne");
	if (temp != "" && temp == "true") {
		onlySelectOne = true;
	}
	if (!onlySelectOne) {
		companyTree.enableCheckBoxes(true);
		companyTree.enableThreeStateCheckboxes(true);
	} else {
		companyTree.enableCheckBoxes(false);
		companyTree.enableThreeStateCheckboxes(false);
	}
	//加载
//	for(var i = 0; i < parent.vehiGroupList.length; i++) {
//		if(parent.vehiGroupList[i].id == parent.companyId) {
//			parentId = parent.vehiGroupList[i].parentId;
//		}
//	}
	
	for(var i = 0; i < companyGroupList.length; i++) {
		companyGroupList[i].parentId = 0;
	}
	companyTree.fillGroup(companyGroupList,0, parent.lang.all_companies);
//	companyTree.fillVehicle(parent.vehicleList);
	//初始化选中的
	var companys = getUrlParameter("companys").split(",");
	if (!onlySelectOne) {
		for (var i = 0; i < companys.length; i = i + 1) {
			companyTree.setCheck('*_'+companys[i], true);
		}
	} else {
		if (companys.length > 0 && companys[0] != "") {
			companyTree.selectItem('*_'+companys[0]);
			companyTree.focusItem('*_'+companys[0]);
		}
	}
	$(".btnSave").click(saveSelectCompany);
}); 

function loadSelectCompanyLang(){
	$("#labelSearch").text(parent.lang.label_search_company);
	$("#labelSelectCompany").text(parent.lang.label_selected_company);
	$("#save").text(parent.lang.save);
}

function saveSelectCompany() {
	var selCompanys = [];
	if (!onlySelectOne) {
		var companys = companyTree.getAllChecked().split(",");
		for (var i = 0; i < companys.length; i = i + 1) {
			if (companyTree.isGroupItem(companys[i]) && companys[i] != '*_' + parentId) {
				selCompanys.push(companys[i].split('_')[1]);
			}
		}
	} else {
		var selId = companyTree.getSelectedItemId();
		if (companyTree.isRootItem(selId) && companyTree.isGroupItem(selId) && selId != '*_' + parentId) {
			selCompanys.push(selId.split('_')[1]);
		} else {
			alert(parent.lang.report_selectCompanyNullErr);
			return ;
		}
	}
	W.doSelectCompany(selCompanys);
}

function searchCompany() {
	if (searchTimer == null) {
		searchTimer = setTimeout(function() {
			var name = $.trim($("#name").val());
			if (name !== "") {
				companyTree.searchCompany(name);
			}
			searchTimer = null;
		}, 200);
	}
}