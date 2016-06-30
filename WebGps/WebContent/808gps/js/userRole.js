/**
 * 用户权限处理类
 */
function userRole(){
	this.isAdmin_ = false;  //是否管理员
	this.isMaster_ = false;  //是否是公司主账户
	this.isFirstCompany_ = false; //是否一级公司用户
	this.isSecondCompany_ = false; //是否二级公司用户
	this.isThreeCompany_ = false; //是否三级公司用户
	this.isAllowManage_ = false; //是否允许所有人管理车辆设备
	this.hasAddArea_ = false; //是否有添加行政区域
	this.hasLine_ = false; 
	this.hasRoadRule_ = false; //是否有添加道路规则
	this.isManageLine_ = false; //是否有管理线路和线路报表的权限
	this.privileges = [];   //权限列表
}

//赋值权限
userRole.prototype.setPrivileges = function(privilege) {
	if(typeof privilege != 'undefined' && privilege != null) {
		this.privileges = privilege.split(',');
	}
}

//赋值管理员
userRole.prototype.setIsAdmin = function(isAdmin) {
	if(typeof isAdmin != 'undefined' && isAdmin != null && isAdmin == 0) {
		this.isAdmin_ = true;
	}
}

//赋值管理员
userRole.prototype.setIsMaster = function(isMaster) {
	if(typeof isMaster != 'undefined' && isMaster != null && isMaster == 0) {
		this.isMaster_ = true;
	}
}

//赋值一级公司用户
userRole.prototype.setIsFirstCompany = function(isFirstCompany) {
	if(typeof isFirstCompany != 'undefined' && isFirstCompany != null && isFirstCompany == 0) {
		this.isFirstCompany_ = true;
	}
}

//赋值二级公司用户
userRole.prototype.setIsSecondCompany = function(isSecondCompany) {
	if(typeof isSecondCompany != 'undefined' && isSecondCompany != null && isSecondCompany == 0) {
		this.isSecondCompany_ = true;
	}
}

//赋值三级公司用户
userRole.prototype.setIsThreeCompany = function(isThreeCompany) {
	if(typeof isThreeCompany != 'undefined' && isThreeCompany != null && isThreeCompany == 0) {
		this.isThreeCompany_ = true;
	}
}

//赋值是否有添加行政区域
userRole.prototype.setHasAddArea = function(hasAddArea) {
	if(typeof hasAddArea != 'undefined' && hasAddArea != null && hasAddArea == 0) {
		this.hasAddArea_ = true;
	}
}

userRole.prototype.setHasLine = function(hasLine) {
	if(typeof hasLine != 'undefined' && hasLine != null && hasLine == 0) {
		this.hasLine_ = true;
	}
}

//赋值是否有添加道路规则
userRole.prototype.setHasRoadRule = function(hasRoadRule) {
	if(typeof hasRoadRule != 'undefined' && hasRoadRule != null && hasRoadRule == 0) {
		this.hasRoadRule_ = true;
	}
}

//赋值是否允许所有人管理车辆设备
userRole.prototype.setIsAllowManage = function(isAllowManage) {
	if(typeof isAllowManage != 'undefined' && isAllowManage != null && isAllowManage == 1) {
		this.isAllowManage_ = true;
	}
}

//赋值是否有管理线路和线路报表的权限
userRole.prototype.setIsManageLine = function(isManageLine) {
	if(typeof isManageLine != 'undefined' && isManageLine != null && isManageLine == 1) {
		this.isManageLine_ = true;
	}
}

//是否管理员
userRole.prototype.isAdmin = function() {
	return this.isAdmin_;
}

//是否公司主账户
userRole.prototype.isMaster = function() {
	return this.isMaster_;
}

//是否一级公司用户
userRole.prototype.isFirstCompany = function() {
	return this.isFirstCompany_;
}

//是否二级公司用户
userRole.prototype.isSecondCompany = function() {
	return this.isSecondCompany_;
}

//是否三级公司用户
userRole.prototype.isThreeCompany = function() {
	return this.isThreeCompany_;
}

//是否有添加行政区域
userRole.prototype.hasAddArea = function() {
	return this.hasAddArea_;
}

userRole.prototype.hasLine = function() {
	return this.hasLine_;
}

//是否有添加道路规则
userRole.prototype.hasRoadRule = function() {
	return this.hasRoadRule_;
}

//是否允许所有人管理车辆设备
userRole.prototype.isAllowManage = function() {
	return this.isAllowManage_;
}

//是否有管理线路和线路报表的权限
userRole.prototype.isManageLine = function() {
	return this.isManageLine_;
}

//是否有权限
userRole.prototype.isPermit = function(role) {
	var s = String.fromCharCode(2);
	var reg = new RegExp(s+role+s);
	return (reg.test(s+this.privileges.join(s)+s));
}