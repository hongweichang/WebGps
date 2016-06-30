var companyTree;  //公司车辆树
var vehiGroupList = null;	//公司车队列表
var vehiAllList = null;	//车辆列表
var vehiFreeList = null;	//车辆列表
var sid = 0;  //根节点
var ismove = true;
var teamList = new Hashtable();
var lastSelectId = 0;

$(document).ready(function(){
	//加载语言
	loadLang();
	//加载车辆树
	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.setImagePath("../../js/dxtree/imgs/");
	companyTree.enableDragAndDrop(true);  //允许拖动
	companyTree.setDragHandler(doDragItem); //拖动事件
//	companyTree.enableCheckBoxes(1);
//	companyTree.enableThreeStateCheckboxes(true);
	companyTree.setOnClickHandler(doClickTree); //单击事件
//	companyTree.setOnDblClickHandler(doDblClickTree); //双击事件
//	companyTree.setOnOpenEndHandler(doOpenOrCloseTree); //节点展开/合拢结束事件
	
	initvehicleTable();
	
	$('#middle').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.vehicle_team_moveVehi, 
			name : '', 
			pclass : 'moveVehi',
			bgcolor : 'gray', 
			hide : false
		}],[{
			display: parent.lang.vehicle_team_removeVehi, 
			name : '', 
			pclass : 'removeVehi',
			bgcolor : 'gray', 
			hide : false
		} ]]
	});
	
	$('#toolbar-btn').flexPanel({
		ButtonsModel : [[{
			display: parent.lang.vehicle_team_add, 
			name : '',
			pclass : 'addGroup',
			bgcolor : 'gray',
			hide : false
		}],[{
			display: parent.lang.vehicle_team_edit, 
			name : '',
			pclass : 'editGroup',
			bgcolor : 'gray',
			hide : false
		} ],[{
			display: parent.lang.vehicle_team_del, 
			name : '',
			pclass : 'delGroup',
			bgcolor : 'gray',
			hide : false
		} ],[{
			display: parent.lang.vehicle_team_move, 
			name : '',
			pclass : 'moveGroup',
			bgcolor : 'gray',
			hide : false
		} ]]
	});
	
	setPanelWidth();
	
	$('.moveVehi').click(moveSelectDevice);
	$('.removeVehi').click(removeSelectDevice);
	$('.addGroup').click(addGroup);
	$('.editGroup').click(editGroup);
	$('.delGroup').click(delGroup);
	$('.moveGroup').click(moveGroup);
	//加载公司和车辆信息
	ajaxLoadInfo();
}); 

function loadLang(){
	$("#groupTitle").text(parent.lang.vehiTeam_management);
	$("#searchCompany").text(parent.lang.label_search_company);
	$("#searchVehicle").text(parent.lang.vehicle_team_labelSearchVehi);
	$("#searchFreeVehicle").text(parent.lang.vehicle_team_labelSearchVehi);
	
//	$("#addGroup").text(parent.lang.vehicle_team_add);
//	$("#editGroup").text(parent.lang.vehicle_team_edit);
//	$("#delGroup").text(parent.lang.vehicle_team_del);
//	$("#moveGroup").text(parent.lang.vehicle_team_move);
	$("#tipDrag").text(parent.lang.vehicle_team_drag_tip);
	$("#tipMove").text(parent.lang.vehicle_team_move_tip);
	
	$('#spanGroup').text(parent.lang.vehicle_team_companyTeamTree);
	$("#spanVehicleList").text(parent.lang.vehicle_team_vehicleList);
	$("#spanVehicleFree").text(parent.lang.vehicle_team_freeVehicleList);
}

//初始化车辆列表
function initvehicleTable(){
	$("#vehicleTable").flexigrid({
		url: "StandardVehicleTeamAction_loadVehiclesByCompany.action",
		dataType: 'json',
		colModel : [
		    {display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'id', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 200, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		useRp: true,
		title: false,
		autoload: false,
		singleSelect: false,
		rpOptions: [20, 50, 100, 150, 200], 
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: false,
		width: '600px',
		height: 'auto',
		resizable: false,
		onSuccess: vehicleTableSuccess
	});

	$("#freeVehicleTable").flexigrid({
		url: "StandardVehicleTeamAction_loadVehiclesByCompany.action",
		dataType: 'json',
		colModel : [
		    {display: parent.lang.index, name : 'index', width : 40, sortable : false, align: 'center'},
			{display: parent.lang.plate_number, name : 'id', width : 120, sortable : false, align: 'center'},
			{display: parent.lang.belong_company, name : 'company', width : 200, sortable : false, align: 'center'}
			],
		pernumber: parent.lang.pernumber,
		pagestat: parent.lang.pagestatInfo,
		pagefrom: parent.lang.pagefrom,
		pagetext: parent.lang.page,
		pagetotal: parent.lang.pagetotal,
		checkbox: true,
		findtext: parent.lang.find,
		procmsg: parent.lang.procmsg,
		nomsg : parent.lang.nomsg,
		usepager: true,
		useRp: true,
		title: false,
		autoload: false,
		singleSelect: false,
		rpOptions: [20, 50, 100, 150, 200], 
		rp: 50,
		showTableToggleBtn: false,
		showToggleBtn: false,
		width: '600px',
		height: 'auto',
		resizable: false,
		onSuccess: freeVehicleTableSuccess
	});
};

//车辆列表加载成功后执行
function vehicleTableSuccess() {
	var data = $("#vehicleTable").flexGetData();
	vehiAllList = data.rows;
	if(vehiAllList != null && data.total != null) {
		var treeGroupId = companyTree.getSelectOrParentGroupId();
		if (treeGroupId != null) {
			var team = teamList.get(Number(companyTree.getVehiGroupId(treeGroupId)));
			team.count = Number(data.total);
			teamList.put(Number(team.id), team);
			var newName = team.name + '&nbsp;&nbsp;('+ data.total +')';
			companyTree.setItemText(treeGroupId, newName, companyTree.getItemTooltip(treeGroupId));
		}
	}
	searchVehicle();
}

//待分配车辆列表加载成功后执行
function freeVehicleTableSuccess() {
	var data =  $("#freeVehicleTable").flexGetData();
	vehiFreeList = data.rows;
	if(vehiFreeList != null && data.total != null) {
		var treeGroupId = companyTree.getSelectOrParentGroupId();
		if (treeGroupId != null) {
			var vehiGroupId = companyTree.getVehiGroupId(treeGroupId);
			var team = teamList.get(Number(vehiGroupId));
			if(team.level == 2) {
				treeGroupId = companyTree.getTreeGroupId(team.companyId);
			}
			var parentTeam = teamList.get(Number(companyTree.getVehiGroupId(treeGroupId)));
			parentTeam.count = Number(data.total);
			teamList.put(Number(parentTeam.id), parentTeam);
			
			var newName = parentTeam.name + '&nbsp;&nbsp;('+ parent.lang.vehicle_team_unassignedCount + data.total +')';
			companyTree.setItemText(treeGroupId, newName, companyTree.getItemTooltip(treeGroupId));
		}
	}
	searchFreeVehicle();
}

function fillCellInfo(p, row, idx, index) {
	var pos = "";
	var name = p.colModel[idx].name;
	if(name == 'company') {
		pos = teamList.get(Number(row['parentId'])).name;
	}else if(name == 'id'){
		pos = row['id'];
	}else {
		pos = changeNull(row[name]);
	}
	return pos;
}

function ajaxLoadInfo() {
	/**
	 * 获得账号下可选公司和车队
	 */
	$.myajax.jsonGet('StandardVehicleTeamAction_loadCompanyTeamsCount.action', function(json,action,success){
		if(success) {
			vehiGroupList = json.infos;
			for(var i = 0; i < vehiGroupList.length; i++) {
				if(parent.companyId == vehiGroupList[i].id) {
					sid = vehiGroupList[i].parentId;
				}
				teamList.put(Number(vehiGroupList[i].id),vehiGroupList[i]);
			}
			companyTree.deleteItem(companyTree.getTreeGroupId(sid), false);
			companyTree.fillGroup(vehiGroupList, sid, parent.lang.all_vehicles);
			
			teamList.each(function(key,value) {
				var treeGroupId = companyTree.getTreeGroupId(key);
				var newName = value.name;
				if(value.level == 1) {
					newName += '&nbsp;&nbsp;('+ parent.lang.vehicle_team_unassignedCount + value.count +')';
				}else {
					newName += '&nbsp;&nbsp;('+ value.count +')';
				}
				companyTree.setItemText(treeGroupId, newName, companyTree.getItemTooltip(treeGroupId));
			});
		};
	}, null);
	
	//清空表格
	$('#vehicleTable').flexClear();
	$('#freeVehicleTable').flexClear();
}

//单击事件  点击公司或车队显示所属车辆
function doClickTree() {
	var treeGroupId = companyTree.getSelectOrParentGroupId();
	if (treeGroupId != null) {
		var vehiGroupId = companyTree.getVehiGroupId(treeGroupId);
		if(vehiGroupId != sid) {
			var team = teamList.get(Number(vehiGroupId));
			if(team != null) {
				if(team.level == 2) {
					var params = [];
					params.push({
						name: 'id',
						value: vehiGroupId
					});
					$('#vehicleTable').flexOptions(
							{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
					
					if(lastSelectId != team.companyId) {
						var params2 = [];
						params2.push({
							name: 'id',
							value: team.companyId
						});
						
						$('#freeVehicleTable').flexOptions(
								{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params2}).flexReload();
					}
						
					lastSelectId = team.companyId;
				}else if(team.level == 3) {
					
				}else {
					$('#vehicleTable').flexClear();
					var params = [];
					params.push({
						name: 'id',
						value: vehiGroupId
					});
					
					$('#freeVehicleTable').flexOptions(
							{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
					
					lastSelectId = vehiGroupId;
				}
			}
		}else {
			$('#vehicleTable').flexOptions({newp: 0,params: false}).flexClear();
			$('#freeVehicleTable').flexOptions({newp: 0,params: false}).flexClear();
		}
	}
}

function addGroup() {
	var treeGroupId = companyTree.getSelectOrParentGroupId();
	if (treeGroupId != null && treeGroupId != '*_0' && treeGroupId != companyTree.getTreeGroupId(sid)) {
		var vehiGroupId = companyTree.getVehiGroupId(treeGroupId);
		var team = teamList.get(Number(vehiGroupId));
		if(team != null && team.level == 3) {
			alert(parent.lang.vehicle_team_selectGroupNode);
		}else {
			$.dialog({id:'addgroup', title:parent.lang.vehicle_team_add
				, content:'url:OperationManagement/VehicleTeam_info.html?parentId=' + vehiGroupId + "&parent=" + encodeURI(companyTree.getItemText(treeGroupId))
				, min:false, max:false, lock:true});
		}
	} else {
		alert(parent.lang.vehicle_team_selectGroupNode);
	}
}

function doAddGroupSuc(data) {
	$.dialog({id:'addgroup'}).close();
	$.dialog.tips(parent.lang.addok, 1);
	parent.isChangedVehiGroup = true;
	data.id = data.id.toString();
	data.level = 2;
	data.count = 0;
	data.parentId = Number(data.parentId);
	var parentTeam = teamList.get(Number(data.parentId));
	if(parentTeam.level == 2) {
		data.companyId = parentTeam.companyId;
	}else {
		data.companyId = data.parentId;
	}
	if(parent.vehiGroupList) {
		parent.vehiGroupList.push(data);
	}
	teamList.put(Number(data.id),data);
	companyTree.insertNewTeam(data.parentId, data.id, data.name + '&nbsp;&nbsp;(0)');
	var params = [];
	params.push({
		name: 'id',
		value: data.id
	});
	$('#vehicleTable').flexOptions(
			{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
}

function editGroup() {
	var treeGroupId = companyTree.getSelectGroupId();
	if (treeGroupId != null) {
		var vehiGroupId = companyTree.getVehiGroupId(treeGroupId);
		var parentGroupText = companyTree.getParentText(treeGroupId);
		if(teamList.get(Number(vehiGroupId)) == null || teamList.get(Number(vehiGroupId)).level == 1 
				|| teamList.get(Number(vehiGroupId)).level == 3) {
			alert(parent.lang.vehicle_team_editNotCompanyNode);
		}else {
			$.dialog({id:'editgroup', title:parent.lang.vehicle_group_edit
				, content:'url:OperationManagement/VehicleTeam_info.html?id=' + vehiGroupId + "&parent=" + encodeURI(parentGroupText)
				, min:false, max:false, lock:true});
		}
	} else {
		alert(parent.lang.vehicle_group_selectTeamNode);
	}
}

function doEditGroupSuc(id, data) {
	$.dialog({id:'editgroup'}).close();
	parent.isChangedVehiGroup = true;
	if(parent.vehiGroupList) {
		for(var i = 0; i < parent.vehiGroupList.length; i++) {
			if(parent.vehiGroupList[i].id == id) {
				parent.vehiGroupList[i].name = data.name;
				break;
			}
		}
	}
	var oldTeam = teamList.get(Number(data.id));
	oldTeam.name = data.name;
	teamList.put(Number(data.id),oldTeam);
	companyTree.setItemText(companyTree.getTreeGroupId(data.id), data.name + '&nbsp;&nbsp;('+ oldTeam.count +')');
	$('#vehicleTable').flexReload();
}

function delGroup(id) {
	var treeGroupId = companyTree.getSelectGroupId();
	if (treeGroupId != null) {
		//判断是否还存在子结点信息
		if (companyTree.hasChildren(treeGroupId)) {
			alert(parent.lang.vehicle_team_groupHasChild);
			return ;
		}
		var vehiGroupId = companyTree.getVehiGroupId(treeGroupId);
		if(teamList.get(Number(vehiGroupId)) == null || teamList.get(Number(vehiGroupId)).level == 1
				|| teamList.get(Number(vehiGroupId)).level == 3) {
			alert(parent.lang.vehicle_team_editNotCompanyNode);
			return;
		}
		if(!confirm(parent.lang.delconfirm)) {
			return ;
		}
		
		//显示的消息
		$.myajax.showLoading(true, parent.lang.deleting);
		$.myajax.jsonGet("StandardVehicleTeamAction_delete.action?id=" + vehiGroupId, function(json,action,success){
			$.myajax.showLoading(false);
			if (success) {
				teamList.remove(Number(treeGroupId));
				var parentCom = companyTree.getParentId(treeGroupId);
				companyTree.deleteItem(treeGroupId);
				if (parentCom != null && parentCom != "") {
					var subs = companyTree.getSubItems(parentCom);
					if (subs != "") {
						var subsItem = subs.split(",");
						companyTree.selectItem(subsItem[0]);
					} else {
						companyTree.selectItem(parentCom);
					}
				}
				parent.isChangedVehiGroup = true;
			}
		}, null);
	} else {
		alert(parent.lang.vehicle_team_selectGroupNode);
	}
}

//idSrc移动的节点  idDest移动到的节点
function doDragItem(idSrc, idDest) {
 //移动车队后不能再触发移动
	if(!ismove) {
		ismove = true;
		parent.isChangedVehiGroup = true;
		return true;
	}
	//如果处于相同层次结构
	if (companyTree.getParentId(idSrc) == idDest) {
		return false;
	}
	
	//判断目标结点是否为车辆结点
	if (!companyTree.isGroupItem(idDest)) {
		return false;
	}
	
	var action;
	//判断源结点是否为分组结点
	if (companyTree.isGroupItem(idSrc) && companyTree.getVehiGroupId(idDest) != sid) {
		var groupId = companyTree.getVehiGroupId(idSrc);
		if(teamList.get(Number(groupId)) == null || teamList.get(Number(groupId)).level == 1
				|| teamList.get(Number(groupId)).level == 3) {
			alert(parent.lang.vehicle_team_editNotCompanyNode);
			return;
		}
		//移动分组
		action = "StandardVehicleTeamAction_move.action?groupId=" + companyTree.getVehiGroupId(idSrc);
	} else {
		//如果是车辆不允许拖动到根结点
		if (companyTree.isRootItem(idDest) && companyTree.getVehiGroupId(idDest) == sid) {
			return false;
		}
		//移动车辆
		action = "StandardVehicleTeamAction_move.action?vehiIdno=" + encodeURI(idSrc);
	}
	
	//向服务器发送请求
	//显示的消息
	var data = {};
	data.parentId = companyTree.getVehiGroupId(idDest);
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		if (!success) {
			//如果更新失败，则直接刷新整个列表
			ajaxLoadInfo();
		}
		var team = teamList.get(Number(companyTree.getVehiGroupId(idSrc)));
		var parentTeam = teamList.get(Number(data.parentId));
		team.parentId = Number(data.parentId);
		if(parentTeam.level == 2) {
			team.companyId = parentTeam.companyId;
		}else {
			team.companyId = team.parentId;
		}
		teamList.put(Number(team.id),team);
		parent.isChangedVehiGroup = true;
	}, null);
	return true;
}

function moveGroup() {
	//是否选择跟结点信息
	if (!companyTree.isSelectNull() && !companyTree.isSelectRootItem()) {
		var selId = companyTree.getSelectedItemId();
		var url;
		if (companyTree.isGroupItem(selId)) {
			var groupId = companyTree.getVehiGroupId(selId);
			if(teamList.get(Number(groupId)) == null || teamList.get(Number(groupId)).level == 1
					 || teamList.get(Number(groupId)).level == 3) {
				alert(parent.lang.vehicle_team_editNotCompanyNode);
				return;
			}
			url = 'url:OperationManagement/VehicleTeam_move.html?groupId=' + groupId + "&name=" + encodeURI(companyTree.getItemText(selId));
		} else {
			url = 'url:OperationManagement/VehicleTeam_move.html?vehiIdno=' + encodeURI(selId) + "&name=" + encodeURI(companyTree.getItemText(selId));;
		}	
		
		$.dialog({id:'movegroup', title:parent.lang.vehicle_team_move, content:url
			, min:false, max:false, lock:true});
	}
}

function doMoveGroupSuc(data) {
	$.dialog({id:'movegroup'}).close();
	//目标分组
	var targetId = companyTree.getTreeGroupId(data.parentId);
	if (data.groupId) {
		ismove = false;
		//移动整个结点
		var subItems = companyTree.getSubItems(targetId).split(",");
		var lastGroupItem = "";
		var vehiIndex = 0;
		for (var i = 0; i < subItems.length; i += 1) {
			if (!companyTree.isGroupItem(subItems[i])) {
				break;
			} else {
				lastGroupItem = subItems[i];
			}
			vehiIndex = i;
		}
		
		var groupId = companyTree.getTreeGroupId(data.groupId);
		if (lastGroupItem === "") {
			//先移动到末尾
			companyTree.moveItem(groupId, "item_child", targetId);
			//先删除车辆结点，然后插入分组结点，再从末尾插入结点
			for (var i = vehiIndex; i < subItems.length; i += 1) {
				if (subItems[i] !== "" && !companyTree.isGroupItem(subItems[i])) {
					var vehiName = companyTree.getItemText(subItems[i]);
					companyTree.deleteItem(subItems[i]);
					companyTree.insertVehicleItem(companyTree.getVehiGroupId(targetId), subItems[i], vehiName, getVehiImg(subItems[i]));
				} 
			}
		} else {
			companyTree.moveItem(groupId, "item_sibling", lastGroupItem);
		}
		companyTree.selectItem(groupId);
		parent.isChangedVehiGroup = true;
	} else {
		var vehiName = companyTree.getItemText(data.vehiIdno);
		//先删除一个结点
		companyTree.deleteItem(data.vehiIdno);
		//再插入车辆结点
		companyTree.insertVehicleItem(companyTree.getVehiGroupId(targetId), data.vehiIdno, vehiName, getVehiImg(data.vehiIdno));	
		companyTree.selectItem(data.vehiIdno);
		//加载车辆列表
		$.myajax.jsonGet('StandardVehicleAction_loadVehicles.action?type=0', function(json,action,success){
			if(success) {
				vehiAllList = json.vehicles;
			}
		});
	}
}

function searchCompany() {
	setTimeout(function() {
		var name = $.trim($("#name").val());
		if (name != "" && vehiGroupList != null) {
			companyTree.searchCompany(name);
		} 
	}, 200);
}

function searchVehicle() {
	setTimeout(function() {
		var name = $.trim($("#vehiName").val());
		if(vehiAllList != null && vehiAllList.length > 0) {
			for (var i = 0; i < vehiAllList.length; i++) {
				if(name == '') {
					if($('#vehicleTable #row'+vehiAllList[i].id).hasClass('trSelected')) {
						$('#vehicleTable #row'+vehiAllList[i].id).click();
					}
				}else {
					if(vehiAllList[i].id.indexOfNotCase(name) >= 0) {
						if(!$('#vehicleTable #row'+vehiAllList[i].id).hasClass('trSelected')) {
							$('#vehicleTable #row'+vehiAllList[i].id).click();
						}
					}else {
						if($('#vehicleTable #row'+vehiAllList[i].id).hasClass('trSelected')) {
							$('#vehicleTable #row'+vehiAllList[i].id).click();
						}
					}
				}
			}
		}
	}, 200);
}

function searchFreeVehicle() {
	setTimeout(function() {
		var name = $.trim($("#freeName").val());
		if(vehiFreeList != null && vehiFreeList.length > 0) {
			for (var i = 0; i < vehiFreeList.length; i++) {
				if(name == '') {
					if($('#freeVehicleTable #row'+vehiFreeList[i].id).hasClass('trSelected')) {
						$('#freeVehicleTable #row'+vehiFreeList[i].id).click();
					}
				}else {
					if(vehiFreeList[i].id.indexOfNotCase(name) >= 0) {
						if(!$('#freeVehicleTable #row'+vehiFreeList[i].id).hasClass('trSelected')) {
							$('#freeVehicleTable #row'+vehiFreeList[i].id).click();
						}
					}else {
						if($('#freeVehicleTable #row'+vehiFreeList[i].id).hasClass('trSelected')) {
							$('#freeVehicleTable #row'+vehiFreeList[i].id).click();
						}
					}
				}
			}
		}
	}, 200);
}

function moveSelectDevice() {
	//获取选中的节点
	var rows = $('#freeVehicleTable').selectedRows();
	var idnos = [];
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
		//	idnos.push(rows[i][0].RowIdentifier);
			idnos.push(rows[i][2].Value);
		}
	}
	if (idnos.length == 0) {
		alert(parent.lang.vehicle_team_selectFreeVehi);
		return;
	}
	//获取选中的节点Id 
	var selId = companyTree.getSelectedItemId();
	//是否选中分组节点
	if (!companyTree.isGroupItem(selId)) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	
	//是否选中根节点
	if (companyTree.isRootItem(selId)) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	var vehiGroupId = companyTree.getVehiGroupId(selId);
	var team = teamList.get(Number(vehiGroupId));
	if(team.level == 1 || team.level == 3) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	
	var action = "StandardVehicleTeamAction_moveSelect.action?groupId=" + companyTree.getVehiGroupId(selId);
	var data = {};
	data.vehiIdnos = idnos.toString();
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		if(success) {
			var params = [];
			params.push({
				name: 'id',
				value: vehiGroupId
			});
			$('#vehicleTable').flexOptions(
					{newp: 1,sortname: '', sortorder: '', query: '', qtype: '',params:params}).flexReload();
			$('#freeVehicleTable').flexReload();
		}
	}, null);
}

function removeSelectDevice() {
	var rows = $('#vehicleTable').selectedRows();
	var idnos = [];
	if(rows != null && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
		//	idnos.push(rows[i][0].RowIdentifier);
			idnos.push(rows[i][2].Value);
		}
	}
	if (idnos.length == 0) {
		alert(parent.lang.vehicle_team_selectGroupVehi);
		return;
	}
	
	//获取选中的节点Id 
	var selId = companyTree.getSelectedItemId();
	//是否选中分组节点
	if (!companyTree.isGroupItem(selId)) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	
	//是否选中根节点
	if (companyTree.isRootItem(selId)) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	var vehiGroupId = companyTree.getVehiGroupId(selId);
	var team = teamList.get(Number(vehiGroupId));
	if(team.level == 1) {
		alert(parent.lang.vehicle_group_selectTeamNode);
		return ;
	}
	var action = "StandardVehicleTeamAction_removeSelect.action";
	var data = {};
	data.vehiIdnos = idnos.toString();
	$.myajax.showTopLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		$.myajax.showTopLoading(false);
		if(success) {
			$('#vehicleTable').flexReload();
			$('#freeVehicleTable').flexReload();
		}
	}, null);
}

function setPanelWidth() {
	var width = $(window).width();
	if(width < 1024) {
		width = 1024;
	}
	width = width - $('#middle').width() - 60;
	$("#left").width(width*3/5);
	$("#right").width(width*2/5 - 5);
	$('.companyList').width($("#left").width()*2/5 - 5);
	$('.vehicleList').width($("#left").width()*3/5);
	$('#company_tree').height($('#left').height() - $('.companyList .labelList').height() - $('.companyList .searchList').height() - 10);
	$('.vehicleList .flexigrid .bDiv').height($('#left').height() - $('.vehicleList .labelList').height() - $('.vehicleList .searchList').height() - $('.vehicleList .flexigrid .hDiv').height() - $('.vehicleList .flexigrid .pDiv').height()-28);
	$('#right .flexigrid .bDiv').height($('#right').height() - $('#right .labelList').height() - $('#right .searchList').height() - $('#right .flexigrid .hDiv').height() - $('#right .flexigrid .pDiv').height()-28);
}