/**
 * 公司车队和车辆显示的树结构
 * 如果车辆数量少于等于200辆，则直接显示
 * 如果车辆数量大于200辆，则按公司车队和车辆分开显示
 */
function vehicleTeamTree() {
	this.teamTree = null;  //公司车队树
	this.vehiTree = null;   //车辆树
	this.teamList = null;  //公司车队列表
	this.vehiList = null;  //车辆列表
	this.teamTreeId = null; //公司车队树id
	this.vehiTreeId = null; //车辆树id
	this.teamVehiList = new Hashtable(); // 公司车辆关联列表
	this.isMoreThan = false;  //车辆是否超过限制
	this.isSearch = false;  //是否搜索
	this.isMoreSelect = true; //是否多选
	this.isLoadChn = false; //是否加载通道
	this.rootId = 0; //公司车队树根节点 
	this.oldSelectTeamId = 0; //上一次选中的节点
	this.searchTeamId = null;  //搜索公司id
	this.searchVehiId = null;  //搜索车辆id
	this.countGroup = false;  //是否计算车辆数目
}

//赋值是否搜索
vehicleTeamTree.prototype.setIsSearch = function(isSearch) {
	this.isSearch = isSearch;
}

//赋值是否多选
vehicleTeamTree.prototype.setIsMoreSelect = function(isMore) {
	this.isMoreSelect = isMore;
}

//是否多选
vehicleTeamTree.prototype.getIsMoreSelect = function() {
	return this.isMoreSelect;
}

//赋值是否加载通道
vehicleTeamTree.prototype.setIsLoadChn = function(isLoadChn) {
	this.isLoadChn = isLoadChn;
}

//赋值计算车辆数目
vehicleTeamTree.prototype.setCountGroup = function(countGroup) {
	this.countGroup = countGroup;
}

//赋值公司车队树根节点 
vehicleTeamTree.prototype.setRootId = function(rootId) {
	this.rootId = rootId;
}

//赋值公司车队列表
vehicleTeamTree.prototype.setTeamList = function(teamList) {
	this.teamList = teamList;
}

//赋值车辆列表
vehicleTeamTree.prototype.setVehiList = function(vehiList) {
	for (var i = 0; i < this.teamList.length; i++) {
		this.teamVehiList.put(this.teamList[i].id.toString(), []);
	}
	if(vehiList != null) {
		for (var i = 0; i < vehiList.length; i++) {
			var vehis = this.teamVehiList.get(vehiList[i].parentId.toString());
			vehis.push(vehiList[i]);
		}
		if(vehiList.length > 200) {
			this.isMoreThan = true;
		}else {
			this.vehiList = vehiList;
		}
	}
}

/**
 * 初始化公司车辆树
 * @param teamTreeId  公司车队 id
 * @param vehiTreeId  车辆  id
 * @param imgSrc   节点图片地址
 * @param checked  是否有选择框
 */
vehicleTeamTree.prototype.initVehiTeamTree = function(teamTreeId, vehiTreeId, imgSrc) {
	if(imgSrc == null || imgSrc == '') {
		imgSrc = '../../js/dxtree/imgs/';
	}
	this.teamTreeId = teamTreeId;
	this.vehiTreeId = vehiTreeId;
	//初始化公司车队树
	this.initTeamTree(imgSrc);
	//初始化车辆树
	this.initVehiTree(imgSrc);
}

//赋值车辆树高宽
vehicleTeamTree.prototype.setHeight = function(height1, height2) {
	if(this.isMoreThan) {
		document.getElementById(this.teamTreeId).style.height = height1 +'px';
		document.getElementById(this.vehiTreeId).style.height = height2 +'px';
	}else {
		document.getElementById(this.teamTreeId).style.height = (height1 + height2 + 32) + 'px';
	}
}

//初始化公司车队树
vehicleTeamTree.prototype.initTeamTree = function(imgSrc) {
	document.getElementById(this.teamTreeId).style.display = 'block';
	this.teamTree = new dhtmlXTreeObject(this.teamTreeId, "100%", "100%", 0);
	this.teamTree.setImagePath(imgSrc);
	if(this.isMoreThan) {
		var vehiTeamTree = this;
		this.teamTree.setOnClickHandler(function(itemId) {
			vehiTeamTree.doClickTeamTree(itemId);
		}); //单击事件
	}else {
		if(this.isMoreSelect) {
			this.teamTree.enableCheckBoxes(1);
		}
		this.teamTree.enableThreeStateCheckboxes(this.isMoreSelect);
	}
}

//初始化车辆树
vehicleTeamTree.prototype.initVehiTree = function(imgSrc) {
	if(this.isMoreThan) {//超过限制 重新加载车辆树
		document.getElementById(this.vehiTreeId).style.display = 'block';
		this.vehiTree = new dhtmlXTreeObject(this.vehiTreeId, "100%", "100%", 0);
		this.vehiTree.setImagePath(imgSrc);
		if(this.isMoreSelect) {
			this.vehiTree.enableCheckBoxes(1);
		}
		this.vehiTree.enableThreeStateCheckboxes(this.isMoreSelect);
	}
}

//双击事件
vehicleTeamTree.prototype.setOnDblClickHandler = function(dbClick) {
	if(this.isMoreThan) {
		this.vehiTree.setOnDblClickHandler(dbClick);
	}else {
		this.teamTree.setOnDblClickHandler(dbClick);
	}
}

//选中事件
vehicleTeamTree.prototype.setOnCheckHandler = function(checkHandle) {
	if(this.isMoreThan) {
		this.vehiTree.setOnCheckHandler(checkHandle);
	}else {
		this.teamTree.setOnCheckHandler(checkHandle);
	}
}

////单击事件
vehicleTeamTree.prototype.setOnClickHandler = function(click) {
	if(this.isMoreThan) {
		this.vehiTree.setOnClickHandler(click);
	}else {
		this.teamTree.setOnClickHandler(click);
	}
}

//右键事件
vehicleTeamTree.prototype.setOnRightClickHandler = function(rightClick) {
	if(this.isMoreThan) {
		this.teamTree.setOnRightClickHandler(rightClick);
		this.vehiTree.setOnRightClickHandler(rightClick);
	}else {
		this.teamTree.setOnRightClickHandler(rightClick);
	}
}

//加载公司车队树信息
vehicleTeamTree.prototype.loadVehiTeamTree = function(searchTeamId, searchVehiId, vehiFunc) {
	//加载公司信息
	this.loadTeamTree();
	//加载车辆信息
	this.loadVehiTree(vehiFunc);
	
	this.searchTeamId = searchTeamId;
	this.searchVehiId = searchVehiId;
	if(this.isSearch) {
		$('#'+this.searchTeamId).show();
		this.initSearchTeamCond();
		if(this.isMoreThan) {
			$('#'+this.searchVehiId).show();
			this.initSearchVehiCond();
		}
	}
}

//加载公司信息
vehicleTeamTree.prototype.loadTeamTree = function() {
	if(this.teamList != null) {
		if(this.isMoreThan) {
			this.teamTree.fillGroup(this.teamList, this.rootId, parent.lang.all_companies);
		}else {
			this.teamTree.fillGroup(this.teamList, this.rootId, parent.lang.all_vehicles);	
		}
		if(this.countGroup) {
			this.countGroupTeamOnline(this.teamTree, this.teamTree.getTreeGroupId(this.rootId));
		}
	}
}

//计算公司下有多少车辆
vehicleTeamTree.prototype.countGroupTeamOnline = function(thisTree, treeGroupId) {
	var data = {};
	data.count = 0;
	data.onlineCount = 0;
	if(treeGroupId != null && treeGroupId != '') {
		if(thisTree.isGroupItem(treeGroupId)) {
			var vehis = this.teamVehiList.get(thisTree.getVehiGroupId(treeGroupId).toString());
			if(vehis != null) {
				data.count += vehis.length;
				for (var k = 0; k < vehis.length; k++) {
					if(vehis[k].isOnline()) {
						data.onlineCount++;
					}
				}
			}
			var items = thisTree.getSubItems(treeGroupId);
			if(items != null && items != '') {
				var itemIds = items.split(',');
				for (var j = 0; j < itemIds.length; j++) {
					if (thisTree.isChannelItem(itemIds[j])) {
						continue;
					}
					if(thisTree.isGroupItem(itemIds[j]) && itemIds[j] != '') {
						var sum = this.countGroupTeamOnline(thisTree, itemIds[j]);
						data.count += sum.count;
						data.onlineCount += sum.onlineCount;
					}
				}
			}
		}
	}
	if (treeGroupId == thisTree.getMyRootItemId()) {
		var rootName = parent.lang.all_vehicles;
		if(this.isMoreThan && thisTree != this.vehiTree) {
			rootName = parent.lang.all_companies;
		}
		var newName = rootName + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
		thisTree.setItemText(treeGroupId, newName, thisTree.getItemTooltip(treeGroupId));
	} else {
		var team = parent.vehicleManager.getTeam(thisTree.getVehiGroupId(treeGroupId));
		if (team != null) {
			var newName = team.getName() + '&nbsp;&nbsp;('+ data.onlineCount + '/' + data.count +')';
			thisTree.setItemText(treeGroupId, newName, thisTree.getItemTooltip(treeGroupId));
		}
	}
	return data;
}

//加载车辆信息
vehicleTeamTree.prototype.loadVehiTree = function(func) {
	if(this.isMoreThan) {//超过限制 重新加载车辆树
		var vehis = this.teamVehiList.get(this.rootId);
		if(vehis == null) {
			vehis = [];
		}
		this.vehiTree.setVehicleList(vehis, this.isLoadChn);
		this.vehiTree.fillGroup([], this.rootId, parent.lang.all_vehicles);
		if(this.countGroup) {
			this.countGroupTeamOnline(this.vehiTree, this.vehiTree.getTreeGroupId(this.rootId));
		}
		this.oldSelectTeamId = this.rootId;
		this.dynamicLoadVehicle(this.vehiTree, func);
	}else {
		//不超过则加载到公司车队树上
		this.teamTree.setVehicleList(this.vehiList, this.isLoadChn);
		this.dynamicLoadVehicle(this.teamTree, func);
	//	this.teamTree.fillVehicle(this.vehiList);
	}
}

//动态加载车辆信息
vehicleTeamTree.prototype.dynamicLoadVehicle = function(thisTree, func) {
	var vehiTeamTree = this;
	if (!thisTree.dynamicLoadVehicle()) {
		setTimeout(function() {
			vehiTeamTree.dynamicLoadVehicle(thisTree, func);
		}, 80);
	} else {
		if((typeof func) == 'function') {
			func();
		}
	}
}

//加载选中的公司节点 
vehicleTeamTree.prototype.loadSelectTeamTree = function(selectTeamId, selectVehiId) {
	var selectGroupId = this.teamTree.getTreeGroupId(selectTeamId);
	if(this.isMoreThan) {//超过限制
		this.vehiTree.deleteItem(this.vehiTree.getTreeGroupId(this.rootId), false);
		this.vehiTree.fillGroup([], selectTeamId, parent.lang.all_vehicles);
		
		var vehis = this.teamVehiList.get(selectTeamId.toString());
		if(vehis == null) {
			vehis = [];
		}
		this.vehiTree.setVehicleList(vehis, this.isLoadChn);
		if(this.countGroup) {
			this.countGroupTeamOnline(this.vehiTree, this.vehiTree.getTreeGroupId(selectTeamId));
		}
		this.oldSelectTeamId = selectTeamId;
		this.dynamicLoadVehicle(this.vehiTree);
		
		this.teamTree.selectItem(selectGroupId);
		this.teamTree.focusItem(selectGroupId);
		this.teamTree.setCheck(selectGroupId, true);
		if(selectVehiId != null && selectVehiId != '') {
			this.vehiTree.selectItem(selectVehiId);
			this.vehiTree.focusItem(selectVehiId);
			this.vehiTree.setCheck(selectVehiId, true);
		}
	}else {
		if(selectVehiId != null && selectVehiId != '') {
			this.teamTree.selectItem(selectVehiId);
			this.teamTree.focusItem(selectVehiId);
			this.teamTree.setCheck(selectVehiId, true);
		}else {
			this.teamTree.selectItem(selectGroupId);
			this.teamTree.focusItem(selectGroupId);
			this.teamTree.setCheck(selectGroupId, true);
		}
	}
}

//公司树单击事件
vehicleTeamTree.prototype.doClickTeamTree = function(itemId) {
	if(itemId != null && itemId != '') {
		var selectTeamId = this.vehiTree.getVehiGroupId(itemId);
		if(this.oldSelectTeamId != selectTeamId) {
			this.vehiTree.deleteItem(this.vehiTree.getTreeGroupId(this.oldSelectTeamId), false);
			this.vehiTree.fillGroup([], selectTeamId, parent.lang.all_vehicles);
			$('#'+this.searchVehiId+' .so_box ul').empty();
			$('#'+this.searchVehiId+' .so_box').css('border','0 none');
			$('#'+this.searchVehiId+' .so_box').css('height','auto');
			$('#'+this.searchVehiId+' input').val('');
			
			this.oldSelectTeamId = selectTeamId;
			var vehis = this.teamVehiList.get(selectTeamId.toString());
			if(vehis == null) {
				vehis = [];
			}
			this.vehiTree.setVehicleList(vehis, this.isLoadChn);
			if(this.countGroup) {
				this.countGroupTeamOnline(this.vehiTree, this.vehiTree.getTreeGroupId(selectTeamId));
			}
			this.dynamicLoadVehicle(this.vehiTree);
		}
	}
}

//加载公司搜索条件
vehicleTeamTree.prototype.initSearchTeamCond = function() {
	if(this.isMoreThan) {
		$('#'+this.searchTeamId+' input').attr('placeholder', parent.lang.monitor_searchCompanyTeam);
	}else {
		$('#'+this.searchTeamId+' input').attr('placeholder', parent.lang.monitor_searchCompanyTeamVehi);
	}
	$('#'+this.searchTeamId).hover(
	 	function(){
			$(this).find(".so_box").show();
			},
		function(){
			$(this).find(".so_box").hide();
	});
	var vehiTeamTree = this;
	$('#'+this.searchTeamId+' input').on('keyup', function() {
		setTimeout(function() {
			$('#'+vehiTeamTree.searchTeamId+' .so_box ul').empty();
			$('#'+vehiTeamTree.searchTeamId+' .so_box').css('border','0 none');
			$('#'+vehiTeamTree.searchTeamId+' .so_box').css('height','auto');
			var searchName = $('#'+vehiTeamTree.searchTeamId+' input').val();
			if (searchName != "") {
				vehiTeamTree.searchVehicle(searchName, vehiTeamTree.searchTeamId, 1);
			} 
		}, 200);
	});
}

//加载车辆搜索条件
vehicleTeamTree.prototype.initSearchVehiCond = function() {
	$('#'+this.searchVehiId+' input').attr('placeholder', parent.lang.monitor_searchVehicle);
	$('#'+this.searchVehiId).hover(
	 	function(){
			$(this).find(".so_box").show();
			},
		function(){
			$(this).find(".so_box").hide();
	});
	var vehiTeamTree = this;
	$('#'+this.searchVehiId+' input').on('keyup', function() {
		setTimeout(function() {
			$('#'+vehiTeamTree.searchVehiId+' .so_box ul').empty();
			$('#'+vehiTeamTree.searchVehiId+' .so_box').css('border','0 none');
			$('#'+vehiTeamTree.searchVehiId+' .so_box').css('height','auto');
			var searchName = $('#'+vehiTeamTree.searchVehiId+' input').val();
			if (searchName != "") {
				vehiTeamTree.searchVehicle(searchName, vehiTeamTree.searchVehiId, 2);
			} 
		}, 200);
	});
}

//搜索
vehicleTeamTree.prototype.searchVehicle = function(searchName, searchId, type) {
	if(searchName != null && searchName != '') {
		var isStop = false;
		var index = 0;
		var content = '';
		if(type == 1) { //公司选项
			for (var i = 0; i < this.teamList.length; i++) {
				if(!isStop) {
					if(this.teamList[i].name.indexOfNotCase(searchName) >= 0) {
						if(this.teamList[i].name.realLength() > 18) {
							content += '<li title="'+ this.teamList[i].name +'" data-id= "'+this.teamTree.getTreeGroupId(this.teamList[i].id)+'">';
						}else {
							content += '<li data-id= "'+this.teamTree.getTreeGroupId(this.teamList[i].id)+'">';
						}
						if(this.teamList[i].level == 2) {
							content += '<span class="tree-team tree-span"></span>';
						}else {
							content += '<span class="tree-company tree-span"></span>';
						}
						if(this.teamList[i].name.realLength() > 18) {
							content += '<span>'+ this.teamList[i].name.getRealSubStr(0,18)+'...' +'</span>';
						}else {
							content += '<span>'+ this.teamList[i].name +'</span>';
						}
						content += '</li>';
						index++;
						if(index > 100) {
							isStop = true;
						}
					}
				}
			}
		}
		
		var vehis = [];
		if(this.isMoreThan) {
			if(type == 2) {
				vehis = this.teamVehiList.get(this.oldSelectTeamId.toString());
			}
		}else {
			vehis = this.vehiList;
		}
		if(vehis == null) {
			vehis = [];
		}
		for (var i = 0; i < vehis.length; i++) {
			if(!isStop) {
				if(vehis[i].idno.indexOfNotCase(searchName) >= 0) {
					if(vehis[i].idno.realLength() > 18) {
						content += '<li title="'+vehis[i].idno+'" data-id= "'+vehis[i].idno+'">';
					}else {
						content += '<li data-id= "'+vehis[i].idno+'">';	
					}
					var image = "vehicle_offline.gif";
					if(vehis[i].isOnline()) {
						image = "vehicle_online.gif";
					}
					content += '<span class="tree-vehicle tree-span" style="background-image: url(../../js/dxtree/imgs/'+image+');"></span>';
					if(vehis[i].idno.realLength() > 18) {
						content += '<span>'+ vehis[i].idno.getRealSubStr(0,18)+'...</span>';
					}else {
						content += '<span>'+ vehis[i].idno +'</span>';
					}
					content += '</li>';
					index++;
					if(index > 100) {
						isStop = true;
					}
				}
			}
		}
		if(index > 0) {
			$('#'+searchId+' .so_box ul').append(content);
			$('#'+searchId+' .so_box').css('border','1px solid #d6d6d6');
			var vehiTeamTree = this;
			$('#'+searchId+' .so_box li').each(function() {
				$(this).on('click',function() {
					vehiTeamTree.selectTeamVehiSearch($(this).attr('data-id'));
				});	
			});
		}
		if(index > 7) {
			$('#'+searchId+' .so_box').height(200);
		}
	}
}

//选择搜索项
vehicleTeamTree.prototype.selectTeamVehiSearch = function(itemId) {
	if(itemId != null && itemId != '') {
		//如果选中的是公司
		if(this.teamTree.isGroupItem(itemId)) {
			this.teamTree.selectItem(itemId);
			this.teamTree.focusItem(itemId);
			if(this.isMoreThan) {
				this.doClickTeamTree(itemId);
			}else {
				this.teamTree.setCheck(itemId, true);
			}
		}else {//如果选中车辆
			if(this.isMoreThan) {
				this.vehiTree.selectItem(itemId);
				this.vehiTree.focusItem(itemId);
				this.vehiTree.setCheck(itemId, true);
			}else {
				this.teamTree.selectItem(itemId);
				this.teamTree.focusItem(itemId);
				this.teamTree.setCheck(itemId, true);
			}
		}
	}
}

//获取勾选的车辆（多选）
vehicleTeamTree.prototype.selectCheckedVehicle = function() {
	var vehiIdnos = null;
	if(this.isMoreThan) {
		vehiIdnos = this.vehiTree.getCheckedVehi();
	}else {
		vehiIdnos = this.teamTree.getCheckedVehi();
	}
	if(vehiIdnos != '' && vehiIdnos.length == 1 && this.teamTree.isGroupItem(vehiIdnos.toString())) {
		vehiIdnos = '';
	}
	return vehiIdnos;
}

//获取选择的车辆（单选）
vehicleTeamTree.prototype.selectVehicle = function() {
	var idno = null;
	if(this.isMoreThan) {
		idno = this.vehiTree.getSelectedItemId();
	}else {
		idno = this.teamTree.getSelectedItemId();
	}
	return idno;
}

//是否选中分组节点
vehicleTeamTree.prototype.isGroupItem = function(itemId) {
	if (itemId.length >= 2 && itemId.charAt(0) == "*" && itemId.charAt(1) == "_") {
		return true;
	} else {
		return false;
	}
};

//是否选中通道节点
vehicleTeamTree.prototype.isChannelItem = function(itemId) {
	if (itemId.length >= 2 && itemId.charAt(0) == "#" && itemId.charAt(1) == "_") {
		return true;
	} else {
		return false;
	}
};

//是否选中车辆节点
vehicleTeamTree.prototype.isVehicleItem = function(itemId) {
	if (!this.isGroupItem(itemId) && !this.isChannelItem(itemId)) {
		return true;
	} else {
		return false;
	}
};

//获取通道节点的车辆Id
vehicleTeamTree.prototype.getChannelVehiIdno = function(treeChnId) {
	if(this.isMoreThan) {
		return this.vehiTree.getParentId(treeChnId);
	}else {
		return this.teamTree.getParentId(treeChnId);
	}
};

//取通道索引
vehicleTeamTree.prototype.getChannelIndex = function(chnItem) {
	var chn = chnItem.split("_");
	return parseInt(chn[1], 10);
};

//设置节点及所有子节点的选中状态
vehicleTeamTree.prototype.setAllSubChecked = function() {
	if(this.isMoreThan) {
		this.setSubChecked(this.rootId);
	}else {
		this.setSubChecked(this.rootId);
	}
};

//设置节点及所有子节点的选中状态
vehicleTeamTree.prototype.setSubChecked = function(itemId) {
	if(this.isMoreThan) {
		this.vehiTree.setSubChecked(itemId);
//		this.teamTree.setSubChecked(itemId);
	}else {
		this.teamTree.setSubChecked(this.teamTree.getTreeGroupId(itemId));
	}
};

//选中的公司节点和车辆节点
vehicleTeamTree.prototype.selectTeamTree = function(selectTeamId, selectVehiId) {
	var selectGroupId = this.teamTree.getTreeGroupId(selectTeamId);
	if(this.isMoreThan) {//超过限制
		this.teamTree.selectItem(selectGroupId);
		this.teamTree.focusItem(selectGroupId);
//		this.teamTree.setCheck(selectGroupId, true);
		this.doClickTeamTree(selectGroupId);
		if(selectVehiId != null && selectVehiId != '') {
			this.vehiTree.selectItem(selectVehiId);
			this.vehiTree.focusItem(selectVehiId);
			this.vehiTree.setCheck(selectVehiId, true);
		}
	}else {
		if(selectVehiId != null && selectVehiId != '') {
			this.teamTree.selectItem(selectVehiId);
			this.teamTree.focusItem(selectVehiId);
			this.teamTree.setCheck(selectVehiId, true);
		}else {
			this.teamTree.selectItem(selectGroupId);
			this.teamTree.focusItem(selectGroupId);
			this.teamTree.setCheck(selectGroupId, true);
		}
	}
}