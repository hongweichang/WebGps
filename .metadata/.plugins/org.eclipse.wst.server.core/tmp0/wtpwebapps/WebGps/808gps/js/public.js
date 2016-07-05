//字符串是否s结束
String.prototype.endWith=function(s){
	 if(s==null||s==""||this.length==0||s.length>this.length)
		 return false;
	 if(this.substring(this.length-s.length)==s)
		 return true;
	 else
		 return false;
	 return true;
 };
 //字符串是否s开始
String.prototype.startWith=function(s){
	if(s==null||s==""||this.length==0||s.length>this.length)
		return false;
	if(this.substr(0,s.length)==s)
		return true;
	else
		return false;
	return true;
};
///<summary>获得字符串实际长度，中文2，英文1</summary>
///<param name="str">要获得长度的字符串</param>
String.prototype.realLength = function() {
	var realLength = 0, len = this.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = this.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
}
//截取字符串
String.prototype.getRealSubStr = function(start, lenth) {
	var charCode = -1, retStr = '';  
	var str = this.substr(start, lenth);
	var realLength = retStr.realLength();
	
	var i = 0;
	while(realLength <= lenth && i <= lenth) {
		retStr += str.substr(i, 1);
		realLength = retStr.realLength();
		i++;
	}
    return retStr;
}

/**
 * 全部替换
 * g 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）
 * m 执行多行匹配
 * @param regex  //被替换的
 * @param replacement //替换的
 * @returns String
 */
String.prototype.replaceAll = function(regex, replacement){
	//this.replace(/regex/g, replacement)
	return this.replace(new RegExp(regex, "gm"), replacement);
}

/**
 * 比较字符串是否相等，不区分大小写
 * @param str
 * @returns {Boolean}
 */
String.prototype.compareNotCase = function(str) {
	return this.toLowerCase() == str.toLowerCase();
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function(str) {
	return this.toLowerCase().indexOf(str.toLowerCase());
}

var getLength = function(str) {    
	///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    var realLength = 0, len = str.length, charCode = -1;    
    for (var i = 0; i < len; i++) {        
    	charCode = str.charCodeAt(i);        
    	if (charCode >= 0 && charCode <= 128) 
    		realLength += 1;        
    	else realLength += 2;    
    }    
    return realLength;
 };

//数组中是否存在e
Array.prototype.S=String.fromCharCode(2);  
Array.prototype.in_array=function(e)  {  
	var r=new RegExp(this.S+e+this.S);
	return (r.test(this.S+this.join(this.S)+this.S));  
};  

function toggleMyClass(mid, obj, className) {
	$(mid).each(function(){
		if(this == obj) {
			$(this).addClass(className);
		}else {
			$(this).removeClass(className);
		}
	});
};

/**
 * 音频文件获取编码后的字符串
 * js和java的ascii 1-127的字符循环编码匹配不同
 *	ascii      java        js
 *               +        %20
 *	!           %21        !
 *	'           %27        '
 *	(           %28        (
 *	)           %29        )
 *	~           %7E        ~
 *	js 编码后对特殊字符做个处理
 */
function audioFileEncodeURI(value) {
	value = encodeURI(value);
	value = value.replace(/%20/gi, "+").replace(/(!)|(')|(\()|(\))|(\~)/gi, function(item) {
		return "%" + item.charCodeAt(0).toString(16).toLocaleUpperCase();
	});
	return value;
}

//获取数组中所有id组成的新数组 type 类型 'id' 或者 'name'
function getNewArrayByArray(array,type) {
	var newArray = [];
	if(type == null || array == null) {
		return newArray;
	}
	for(var i = 0; i < array.length; i++) {
		if(type == 'id') {
			if(array[i].id) {
				newArray.push(array[i].id);
			}
		}else if(type == 'name') {
			newArray.push(array[i].name);
		}
	}
	return newArray;
};

//获取数组中id与id相同的值
function getArrayName(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].name;
		}
	}
	return '';
};

//
function getArrayLevel(array,id) {
	if(id == null) {
		return '';
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i].level;
		}
	}
	return '';
};

//根据id返回相应对象
function getArrayInfo(array,id) {
	if(id == null) {
		return null;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return array[i];
		}
	}
	return null;
}

//根据id返回相应对象的索引
function getArrayIndex(array, id) {
	if(id == null) {
		return 0;
	}
	for(var i = 0; i < array.length; i++) {
		if(array[i].id == id) {
			return i;
		}
	}
	return 0;
}

function arrayToStr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].id + '&' + arr[i].name;
	}
	return str;
}

function vehicleList2Arr(arr) {
	var str = '';
	for(var i = 0; i < arr.length; i++) {
		if(i != 0) str += '|';
		str += arr[i].nm + '&' + arr[i].nm;
	}
	return str;
}

//获取距离body的上边距
function getTop(e){
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetTop;
		obj = obj.offsetParent;
	}
	while(obj != null && e != document.body) {
		offset -= e.scrollTop;
		e = e.parentElement;
	}
	return offset;
} 
//获取距离body的左边距
function getLeft(e){ 
	var offset = 0;
	var obj = e;
	while(obj != null && obj != document.body) {
		offset += obj.offsetLeft;
		obj = obj.offsetParent;
	}
	while(e != null && e != document.body) {
		offset -= e.scrollLeft;
		e = e.parentElement;
	}
	return offset;
}

//限制输入数字
function restrictionsDigital(mid) {
	$(mid).on('input propertychange',function() {
		var isNum = /^[0-9]*$/;
		var value = $.trim($(this).val());
		if(!isNum.test(value)) {
			$(this).val(value.substring(0,value.length-1));
		}
	});
}

/**
 * 限制输入数字
 */
function enterDigital(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /\D/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)) {
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入数字和'.-'
 */
function enterDigitalAndPoint(mid) {
	$(mid).on('input propertychange keypress',function() {
		if(/[^\d.-]/g.test(this.value)) {
			this.value = this.value.replace(/[^\d.-]/g, '');  //清除“数字”和“.”“-”以外的字符
		}
		if(/^\./g.test(this.value)) {
			this.value = this.value.replace(/^\./g, '');  //验证第一个字符是数字而不是.
		}
		if(/^\-\./g.test(this.value)) {
			this.value = this.value.replace(/^\-\./g, '-'); //不能存在-.
		}
//		var isCkx2 = /\.{2,}/g; //不能有连续2个.
		if(/\.+\d*\-*\.+/g.test(this.value)) {//不能有超过2个的.
			//只保留第一个. 清除多余的.
			this.value = this.value.replace('.','$#$').replace(/\./g,'').replace("$#$",'.');
		}
		if(/\-+\d*\.*\-+/g.test(this.value)) {//不能有超过2个的-
			//只保留第一个- 清除多余的-
			this.value = this.value.replace('-','$#$').replace(/\-/g,'').replace('$#$','-'); 
		}else {
			if(/\d+\.*\-/g.test(this.value)) {//不能以数字-开头
				this.value = this.value.substring(0,this.value.length-1);
			}
		}
	});
}

/**
 * 限制输入特殊字符
 */
function cleanSpelChar(mid){
	$(mid).on('input propertychange keypress',function() {
		/*var pattern = new RegExp("[`~%!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“\"'。，、？]"); 
		var value = $.trim($(this).val());
		if(value != null && value != '') {
			var rs = ""; 
			for (var i = 0; i < value.length; i++) { 
				rs = rs+value.substr(i, 1).replace(pattern, ''); 
			} 
			$(this).val(rs);
		}*/
		var reg= /[@#,|?<>"':*\\\/\$%\^&\*]+/g;
		var value = $.trim($(this).val());
		if(reg.test(value)){
		//if(!reg.test(str))  {
			$(this).val(value.replace(reg,''));
		}
	});
}

/**
 * 只能输入汉字和字母
 */
function enterChar(mid) {
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[\d]/g;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符和汉字
 */
function cleanChar(mid){
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\w\.\/]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

/**
 * 限制输入特殊字符(除去@)和汉字
 */
function cleanCharAndNum(mid){
	$(mid).on('input propertychange keypress',function() {
		var isNum = /[^\w\.\/@]/ig;
		var value = $.trim($(this).val());
		if(isNum.test(value)){
			$(this).val(value.replace(isNum,''));
		}
	});
}

var searchTimer = null;
var companyTree;
var oldCompanyId = null;
/**
 * 加载公司树结构
 */
function addCompanyTree(companys,mid) {
	$('.td-company').flexPanel({
		InputModel : {display: parent.lang.btnSelectCompany,value:'',name : 'company', pid : 'company', pclass : 'buttom',bgicon : 'true',hidden:true, hide : false} 
	});

	companyTree = new dhtmlXTreeObject("company_tree", "100%", "100%", 0);
	companyTree.enableCheckBoxes(false);
	companyTree.enableThreeStateCheckboxes(false);
	companyTree.setImagePath("../../../js/dxtree/imgs/");
	companyTree.fillCompany(companys,mid);
	companyTree.setOnDblClickHandler(companyDblClickEvent);
	$('#company_tree').css('overflow','auto');
	var isOut = true;
	$('.td-company #combox-company').on('input propertychange click',function(e){
		
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if(e.type == 'click') {
			isOut = false;
			$('#company_tree').show();
		}
		if (searchTimer == null) {
			searchTimer = setTimeout(function() {
				var name = $.trim($('.td-company #combox-company').val());
				if (name !== "") {
					companyTree.searchCompany(name);
				}
				searchTimer = null;
			}, 200);
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	
	$('.td-company .bg-icon-company').on('click',function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
		$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
		$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
		if($('#company_tree').css('display') == 'none') {
			$('#company_tree').show();
			isOut = false;
			if (searchTimer == null) {
				searchTimer = setTimeout(function() {
					var name = $.trim($('.td-company #combox-company').val());
					if (name !== "") {
						companyTree.searchCompany(name);
					}
					searchTimer = null;
				}, 200);
			}
		}else {
			checkCompanyTreeParam();
		}
	}).on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	var errtips = parent.lang.errCompanyNotExists;
	$('.td-company #combox-company').on('keydown',function(e){
		if(e.keyCode == 13) {
			$('#company_tree').css('top',getTop($('.td-company .btn-group').get(0)) + $('.td-company .btn-group').height() + 'px');
			$('#company_tree').css('left',getLeft($('.td-company .btn-group').get(0)) + 'px');
			$('#company_tree').css('width',$('.td-company .btn-group .item').width()+'px');
			if($('#company_tree').css('display') == 'none') {
				$('#company_tree').show();
				isOut = true;
				if (searchTimer == null) {
					searchTimer = setTimeout(function() {
						var name = $.trim($('.td-company #combox-company').val());
						if (name !== "") {
							var search = companyTree.searchCompany(name);
							$('.td-company .span-tip').text('*');
							if(search == null) {
								$('.td-company #hidden-company').val('');
								$('.td-company .span-tip').text(errtips);
								oldCompanyId = '';
								isOut = true;
							}
						}else {
							$('.td-company #hidden-company').val('');
							$('.td-company .span-tip').text(errtips);
							oldCompanyId = '';
							isOut = true;
						}
						searchTimer = null;
					}, 200);
				}
			}else {
				checkCompanyTreeParam();
			}
		}
	});

	
	$('#company_tree').on('mouseover',function(){
		isOut = false;
	}).on('mouseout',function(){
		isOut = true;
	});
	$('body').on('click',function(){
		if(isOut && $('#company_tree').css('display') != 'none'){
			checkCompanyTreeParam();
		}
	});
	var checkCompanyTreeParam = function(){
		if($('#combox-company').get(0) && $('#combox-company').get(0).disabled) {
			return;
		}
		var name = $.trim($('.td-company #combox-company').val());
		var selId = companyTree.getSelectedItemId();
		if(selId != '*_0' && selId != '*_'+sid) {
			var id =selId.split('_')[1];
			var cname = getArrayName(companys,id);
			if(name == '' || name == cname) {
				companyDblClickEvent();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}else {
			if(name == null || name == '') {
				$('.td-company #hidden-company').val('');
				$('.td-company .span-tip').text(errtips);
				oldCompanyId = '';
				$('#company_tree').hide();
				isOut = true;
			}else {
				var plag = false;
				for(var i = 0; i < companys.length; i++) {
					if(name == companys[i].name) {
						companyDblClickEvent();
						isOut = true;
						plag = true;
						return;
					}
				}
				if(!plag) {
					$('.td-company #hidden-company').val('');
					$('.td-company .span-tip').text(errtips);
					oldCompanyId = '';
					$('#company_tree').hide();
					isOut = true;
				}
			}
		}
	}
}

/**
 * 检查数据
 * @returns {Boolean}
 */
function checkParam() {
	var flag = true;
	var i = 0;
	$('#required-area input,#required-area textArea').each(function(){
		var name = $(this).attr('data-name');
		if(($(this).val() == null || $(this).val() == '') && name != 'role' 
			&& name != 'devIDNO'){
			$('.td-'+name).find('.span-tip').text(parent.lang.not_be_empty);
			if(i == 0) {
				$('#required-area .panel-body').addClass('show');
				$(this).focus();
			}
			i++;
		}else {
			$('.td-'+name).find('.span-tip').text('*');
		}
	});
	if(i != 0) {
		flag = false;
	}
	return flag;
}

function getParentCompany(companys,parentId) {
	for(var i = 0; i < companys.length; i++) {
		if(companys[i].id == parentId) {
			return companys[i];
		}
	}
}

//获取父公司
function getPartCompanys(companys,parentCompanys,id) {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].id == id){
			parentCompanys.push(companys[i]);
		}
	}
}

//获取子公司
function getChildCompanys(companys,childCompanys,id) {
	for(var i = 0;i < companys.length; i++) {
		if(companys[i].parentId == id){
			childCompanys.push(companys[i]);
		}
	}
}

/**
 * 添加页面锁屏
 * @param flag
 */
function disableForm(flag){
	if(flag) {
		$('body').append('<div id="lockmask" style="position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; overflow: hidden; -ms-filter:\'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)\'; opacity: 0.5;filter:alpha(opacity=50);background: none repeat scroll 0% 0% rgb(220, 226, 241); z-index: 1994;"></div>');
	}else {
		$('#lockmask').remove();
	}
}

/**
 * 设置界面宽度
 */
function loadReportTableWidth(callBackFun) {
	var width = $(window).width();
	var height = $(window).height();
	//不能少于1024
	if(width < 1024) {
		width = 1024;
	}
	
	if(getTop($('.queryGraph-render').get(0)) == 0 || getTop($("#container").get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	if(getTop($('.queryGraph-render').get(0)) != 0) {
		height = height - getTop($('.flexigrid .bDiv').get(0)) - $('.flexigrid .pDiv').height() - 10;
	}
	height = height < 0 ? 0 : height;
	$('.flexigrid .bDiv').height(height);
	if (typeof callBackFun == "function") {
		callBackFun();
	}
}

/**
 * 地图界面全屏显示
 */
function fullMapScreen() {
	$('body',parent.document).find('#main-topPanel').toggleClass('show');
	$('body',parent.document).resize();
};

/**
 * 添加提示组件
 * @param id
 * @param tltle
 */
function setTooltip(id, tltle) {
	$(id).attr("title", tltle);
	$(id).tooltip();
}

/**
 * 判字符串断是否包含空格(字符前中后)
 * @param str
 * @returns
 */
function isCheckEmpty(str) {
	var reg =/\s/;
	return reg.test(str);
}

/**
 * 是否禁止系统右键  true 禁止
 */
function disableSysRight(id,disable,func) {
	if(disable) {
		if(typeof func != 'undefined' && func != null) {
			$(id).on('contextmenu',func);
		}else {
			$(id).on('contextmenu',function(){return false;});
		}
	}else {
		$(id).unbind('contextmenu');
	}
}

/**
 * 获取服务器ip
 * 与浏览器ip匹配
 */
function getComServerIp(lstSvrIp) {
	if(lstSvrIp != null && lstSvrIp.length > 0) {
		var host = window.location.host.split(':');
		if (host.length >= 1) {
			var addr = host[0];
			if(addr == 'localhost') {
				return "127.0.0.1";
			}
			for (var i = 0; i < lstSvrIp.length; ++ i) {
				if (addr == lstSvrIp[i]) {
					return lstSvrIp[i];
				}
			}
		}
		return lstSvrIp[0];
	}
	return "127.0.0.1";
}

//显示错误信息
function showDialogErrorMessage(result, cmsserver) {
	if(cmsserver != null && cmsserver == 1) {
		switch(result) {
		case 1:		//系统出现异常
			$.dialog.tips(parent.lang.errException, 2);
			break;
		case 2:		//用户无权限
			$.dialog.tips(parent.lang.errNoPrivilige, 2);
			break;
		case 3:		//参数错误
			$.dialog.tips(parent.lang.errRequireParam, 2);
			break;
		case 4:		//操作数据库出错
			$.dialog.tips(parent.lang.errDbConnErr, 2);
			break;
		case 5:		//信息不存在
			$.dialog.tips(parent.lang.errNoExist, 2);
			break;
		case 6:		//未知错误
			$.dialog.tips(parent.lang.errUnkown, 2);
			break;
		case 7:		//名称已经被使用
			$.dialog.tips(parent.lang.errNameExist, 2);
			break;
		case 21:		//设备信息不存在
			$.dialog.tips(parent.lang.errDeviceNoExist, 2);
			break;
		case 22:		//没有收到设备的回馈信息
			$.dialog.tips(parent.lang.errorDeviceNoResponse, 2);
			break;
		case 23:	//设备不在线
			$.dialog.tips(parent.lang.video_not_online, 2);
			break;
		case 24:	//正在为其它客户端执行对讲操作
			return "";
		case 25:	//设备媒体转发关联信息不存在
			return "";
		case 26:	//设备连接中断
			$.dialog.tips(parent.lang.errorDeviceDisconnect, 2);
			break;
		case 27:	//未定义存储路径
			return "";
		case 45:	//设备不支持此功能
			$.dialog.tips(parent.lang.device_nosupport, 2);
			break;
		case 61:	//文件格式错误
			$.dialog.tips(parent.lang.errSImageType, 2);
			break;
		case 62:	//服务器上不存在此文件
			$.dialog.tips(parent.lang.errorFileNotExists, 2);
			break;
		case 63:	//文件已全部下载完成
			$.dialog.tips(parent.lang.errorFileDownloadAll, 2);
			break;
		case 64:	//文件正在下载
			$.dialog.tips(parent.lang.errorFileDownloading, 2);
			break;
		case 65:	//没有搜索到录像文件
			$.dialog.tips(parent.lang.errorVideoFileNotSearch, 2);
			break;
		case 66:	//文件正在被使用
			$.dialog.tips(parent.lang.errorFileisUse, 2);
			break;
		case 101:	//服务器连接失败
			$.dialog.tips(parent.lang.errorServerConnectFail, 2);
			break;
		case 81:	//用户不存在
			$.dialog.tips(parent.lang.errLogin_UserNoExist, 2);
			break;
		case 82:	//用户密码错误
			$.dialog.tips(parent.lang.errLogin_PasswordError, 2);
			break;
		case 83:	//用户名错误
			$.dialog.tips(parent.lang.errLogin_UserError, 2);
			break;
		case 102:	//服务器空间不足
			$.dialog.tips(parent.lang.errorServerSpaceNotEnough, 2);
			break;
		case 106:	//服务器信息不存在，无法为客户提供服务
			$.dialog.tips(parent.lang.errServerNoExist, 2);
			break;
		case 109:	//服务器不在线
			$.dialog.tips(parent.lang.errorServerOffline, 2);
			break;
		case 110:	//服务器连接中断
			$.dialog.tips(parent.lang.errorServerDisconnect, 2);
			break;
		case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
			$.dialog.tips(parent.lang.usersRequestFails, 2);
			break;
		case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
			$.dialog.tips(parent.lang.errDownloadTaskExists, 2);
			break;
		case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
			$.dialog.tips(parent.lang.video_not_online, 2);
			break;
		default:	//未知错误
			return '';
		}
	}else {
		if((typeof showErrorMessage) == 'function') {
			showErrorMessage(result);
		}
		if(result == 2) {
			top.window.location = "login.html";
		}
	}	
}

//百度谷歌经纬度互换
function convertBaiduGoogle(lat, lng, toMap) {
	var x_pi = (3.14159265358979324*3000.0)/180.0;
	lat = parseFloat(lat);
	lng = parseFloat(lng);
	var gps = {};
	if(toMap == 1) {////百度经纬度转为谷歌经纬度
		lng = lng - 0.0065, lat = lat - 0.006; 
		var z = Math.sqrt(lng * lng + lat * lat) - 0.00002 * Math.sin(lat * x_pi); 
		var theta = Math.atan2(lat, lng) - 0.000003 * Math.cos(lng * x_pi);
		gps.lng = z * Math.cos(theta);
		gps.lat = z * Math.sin(theta);
	}else {//谷歌经纬度转为百度经纬度
		var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_pi);  
	    var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_pi);
	    gps.lng = z * Math.cos(theta) + 0.0065;
	    gps.lat = z * Math.sin(theta) + 0.006;
	}
    return gps;
}

/* 
 * 判断图片类型
 *  
 * @param fileObj  type="file"的javascript对象 
 * @return true-符合要求,false-不符合 
 */ 
function checkImgType(fileObj){
    if (fileObj.value) {
        if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|JPEG|PNG|BMP)$/.test(fileObj.value)) {  
            return false;
        }
    }  
    return true;  
}

/* 
 * 判断图片大小
 *  
 * @param fileObj type="file"的javascript对象
 * @param size 图片大小
 * @return true-符合要求,false-不符合 
 */ 
function checkImgSize(fileObj, size){  
    if (fileObj.value) {  
        if (fileObj.files && fileObj.files[0]) {
        	//获取文件大小
            var fileSize = fileObj.files[0].size || fileObj.files[0].fileSize;
            if(fileSize > parseInt(size, 10)*1024*1024){
            	return false;
            }
    	} else{ // 兼容IE
//        	var img = new Image(); //动态创建img
//    		img.src = fileObj.value;
//    		img.style.display = "none";
//    		img.onload = function(){
//    			img.fileSize= this.fileSize;
//    			alert(img.fileSize);//ie获取文件大小
//    		}
//    		if(img.readyState=="complete"){//已经load完毕，直接打印文件大小
//    			alert(img.filesize);//ie获取文件大小
//    		}else{
//    			img.onreadystatechange=function(){
//    				if(img.readyState=='complete'){//当图片load完毕
//    					alert(img.fileSize);//ie获取文件大小
//    				}
//    			}
//    		}
    	}
    }  
    return true;
}

//创建一个名字为name的计时器，调用console.timeEnd(name)停止计时器并输出所耗时间（毫秒）
function loadConsoleTime(flag, name) {
	if(flag) {
		console.time(name);
	}else {
		console.timeEnd(name);
	}
}