var api = frameElement.api, W = api.opener;
var curPage = null;

$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#typeTitle").text(parent.lang.vehicle_vehiType);
	$("#addType").text(parent.lang.add);
	initTypeHead();
}

function initTypeHead() {
	$("#thIndex").text(parent.lang.index);
	$("#thName").text(parent.lang.monitor_myMapType);
	$("#thOperator").text(parent.lang.operator);
}

function ajaxLoadInfo(){
	$.myajax.cleanTableContent("#typeTable");
	//显示加载过程
	$.myajax.showLoading(true);
	var temp = 1;
	var action = "VehicleAction_listType.action";
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxTypeList, pagination);
}

function doAjaxTypeList(json,action,success) {
	var empty = true;
	if (success) {
		if (json.vehiTypes != null && !$.isEmptyObject(json.vehiTypes)) {
			empty = false;
			var k = (json.pagination.currentPage - 1) * json.pagination.pageRecords + 1;
			$.each(json.vehiTypes, function (i, fn) {
				var row = $("#typeTableTemplate").clone();
				fillRowType(row, fn);
				row.find("#tdIndex").text(k);
				var temp = "";
				temp = "<a href=\"javascript:selectTypeInfo('" + fn.id + "','" + fn.name + "');\">" + parent.lang.select + "</a> ";
				temp = temp + "<a href=\"javascript:editTypeInfo('" + fn.id + "');\">" + parent.lang.edit + "</a> ";
				temp = temp + "<a href=\"javascript:delTypeInfo('" + fn.id + "');\">" + parent.lang.del + "</a>";
				row.find("#tdOperator").html(temp);
				row.attr("id", "typeTable_" + fn.id);
				if ( (i % 2) == 1) {
					row.attr("class", "tabdata bluebg");
				}
				row.show();
				row.appendTo("#typeTable");
				k = k + 1;
			});
		}  
		//显示分页信息
		$.myajax.showPagination("#typePagination");
		json.pagination.id = "#typePagination";
		json.pagination.tableId = "#typeTable";
		$.myajax.initPagination(action, json.pagination, doCheckTypeQuery, doAjaxTypeList);
	}
	$.myajax.showLoading(false);
	parent.resizeFrame();
}

function doCheckTypeQuery() {
	return true;
}

function fillRowType(row, vehiType) {
	row.find("#selectIdList").val(vehiType.id);
	row.find("#tdName").text(vehiType.name);
}

function addType() {
	$.dialog({id:'addtype', title:parent.lang.add,content:'url:vehicle/typeinfo.html'
		, min:false, max:false, lock:true, parent: api});
}

function doAddTypeSuc(id,data) {
	$.dialog({id:'addtype'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	W.restVehiType(id, data);
	ajaxLoadInfo(0);
}

function doEditTypeSuc(id, data) {
	$.dialog({id:'edittype'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	//查找对应的行数据
	ajaxLoadInfo(0);
	W.restVehiType(id, data);
	/*$("#typeTable").find("tr").each(function(){
			if (this.id == ("typeTable_" + id)) {
				fillRowType($(this), data);
			}
		}
	);*/	
}
function selectTypeInfo(id,name){
	W.doSelectTypeSuc(id,name);
}

function editTypeInfo(id) {
	$.dialog({id:'edittype', title:parent.lang.edit,content:'url:vehicle/typeinfo.html?id=' + id
		, min:false, max:false, lock:true, parent: api});
}

function delTypeInfo(id) {
	if(!confirm(parent.lang.delconfirm)) {
		return ;
	}
	$.myajax.showLoading(true, parent.lang.deleting);
	$.myajax.jsonGet("VehicleAction_deleteType.action?id=" + id, function(json,action,success){
		$.myajax.showLoading(false);
		var curpage = $("#typePagination").find("#hideCurrentPage").text();
		loadTypeList(curpage, getUrlParameter("id"));
	}, null);
	W.restVehiType(id,null);
}

function loadTypeList(page, parentId, name) {
	//清除之前加载的数据
	$.myajax.cleanTableContent("#typeTable");
	//显示加载过程
	$.myajax.showLoading(true);
	//向服务器发送ajax请求
	var temp = 1;
	if (typeof page !== "undefined" && page !== "") {
		temp = parseIntDecimal(page);
	}
	var action = "VehicleAction_listType.action";
	var hasQuery = false;
	if (typeof parentId !== "undefined" && parentId !== null && parentId !== "") {
		clientParentId = parentId;
		action += ("?parentId=" + parentId);
		hasQuery = true;
	}
	if (typeof name != "undefined" && name !== null && name !== "") {
		if (hasQuery) {
			action += ("&name=" + encodeURIComponent(name));
		} else {
			action += ("?name=" + encodeURIComponent(name));
		}
	}
	var pagination={currentPage:temp, pageRecords:10};
	$.myajax.jsonGet(action, doAjaxTypeList, pagination);
}