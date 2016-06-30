
function getBrowseVersion() {
	var userAgent = navigator.userAgent.toLowerCase();
    var browser = userAgent.match(/(firefox|chrome|safari|opera|msie)/);
    var browserId = "msie";
    var browserVersion = "";
    var isIE11 = (userAgent.toLowerCase().indexOf("trident") > -1 && userAgent.indexOf("rv") > -1);
    if (isIE11) {
    	browserId = "msie";
    	browserVersion = "11.0";
    } else {
    	if (browser.length >= 2) {
    		browserId = browser[1];
    	} else {
    		browserId = "msie";
    	}
    	browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:'+browserId+')[\/: ]([\\d.]+)')) || [0,'0'])[1];
    }
    return browserId + browserVersion;
}

//判断是否为ie5
function isBrowseIE5() {
    return (getBrowseVersion() == "msie5.5") ? true : false;
}

//判断是否为ie6
function isBrowseIE6() {
    return (getBrowseVersion() == "msie6.0") ? true : false;
}

//是否为IE7
function isBrowseIE7() {
    return (getBrowseVersion() == "msie7.0") ? true : false;
}

//是否为IE8
function isBrowseIE8() {
    return (getBrowseVersion() == "msie8.0") ? true : false;
}

//是否为IE
function isBrowseIE() {
    return (getBrowseVersion().indexOf("msie") != -1) ? true : false;
}

//是否谷歌浏览器
function isBrowseGoogle() {
	return (navigator.userAgent.toLowerCase().match(/chrome/) != null) ? true : false;
}

//是否谷歌浏览器
function isBrowseChrome() {
	return (navigator.userAgent.toLowerCase().match(/chrome\/([\d.]+)/) != null) ? true : false;
}

//是否为Firefox
function isBrowseFirefox() {
    return (navigator.userAgent.toLowerCase().match(/firefox/) != null) ? true : false;
}

//是否为Safari
function isBrowseSafari() {
    return (navigator.userAgent.toLowerCase().match(/version\/([\d.]+).*safari/) != null) ? true : false;
}

//是否支持html5
function supportHtml5()   {   
    if (typeof(Worker) !== "undefined") {   
        return true;  
    } else {   
        return false; 
    }  
}  

//获取URL参数信息
function getUrlParameter(name){
	if(location.search==''){
		return '';
	}
	
	var o={};
	var search=location.search.replace(/\?/,'');//只替换第一个问号,如果参数中带有问号,当作普通文本
	var s=search.split('&');
	for(var i=0;i<s.length;i++){
		o[s[i].split('=')[0]]=s[i].split('=')[1];
	}
	return o[name]==undefined?'':o[name];
}

//获取Cookie的值数据
function getCookieVal (offset){
	var endstr = document.cookie.indexOf (";", offset);
	if (endstr == -1)
	endstr = document.cookie.length;
	return unescape(document.cookie.substring(offset, endstr));
} 

//获取Cookie的参数值信息
function GetCookie (name){
	var arg = name + "=";
	var alen = arg.length;
	var clen = document.cookie.length;
	var i = 0;
	while (i < clen)
	{
		var j = i + alen;
		if (document.cookie.substring(i, j) == arg)
			return getCookieVal (j);
			
		i = document.cookie.indexOf(" ", i) + 1;
		if (i == 0)
			break;
	}
	return null;
}

//设置浏览器的Cookie参数
function SetCookie (name, value)
{
	var argv = SetCookie.arguments;
	var argc = SetCookie.arguments.length;
	var expires=new Date();
	expires.setTime(expires.getTime()+(365*24*60*60*1000));
	
	var path = (3 < argc) ? argv[3] : null;
	var domain = (4 < argc) ? argv[4] : null;
	var secure = (5 < argc) ? argv[5] : false;
	document.cookie = name + "=" + escape (value) +
		((expires == null) ? "" : ("; expires=" + expires.toGMTString())) +
		((path == null) ? "" : ("; path=" + path)) +
		((domain == null) ? "" : ("; domain=" + domain)) +
		((secure == true) ? "; secure" : "");
}

//设置浏览器Cookie参数失效
function SetCookieExpire (name) {
	var date=new Date();
	date.setTime(date.getTime() - 10000);
	document.cookie = name + "=;expires="+date.toGMTString()+"; path=/";
}

//限制特殊字符
function specialChar(e){
	var keynum = e.keyCode || e.which;
	if(keynum==222 || keynum==188|| keynum==32
		|| keynum==109 || keynum==107|| keynum==189 
		|| keynum==186 || keynum==187|| keynum==190
		|| keynum==192 || keynum==191|| keynum==220 
		|| keynum==17|| keynum==219|| keynum==221)	{	
		return false;
	}
	
	if(e.shiftKey)	{
		if((keynum>=48&& keynum<=57) || keynum==32
			||keynum==187 || keynum==109|| keynum==107  
			|| keynum==186  || keynum==222 ||keynum==189
			||keynum==190|| keynum==219|| keynum==221)	{
			return false;
		}
	}
	
	return true;
}

//限制只输入数字
function onKeyDownDigit(myEvent) {
	var k;
	if (window.event)
	    k = myEvent.keyCode;     //IE,chrome
	else
	    k = myEvent.which;     //firefox
	
	if ((k == 46) || (k == 8) || (k == 9) || (k == 189) || (k == 109) 
			|| (k == 190) || (k == 110) || (k >= 48 && k <= 57) 
			|| (k >= 96 && k <= 105) || (k >= 37 && k <= 40)){
		
	}else if (k == 13) {
//		将输入键转成tab键	
//		if (window.event)
//			myEvent.keyCode = 9;
//		else
//			myEvent.which = 9;
	} else {
		if (document.all)
			myEvent.returnValue = false; //ie
		else
			myEvent.preventDefault(); //ff
	}
}

//显示ajax加载动画
function showAjaxLoading(id, flag, showtext) {
	if(flag) {
		if ( typeof showtext != "undefined" && showtext) {
			$(id).html("<img src='../images/loading.gif'/>" + parent.lang.loading);
		} else {
			$(id).html("<img src='../images/loading.gif'/>");			
		}
	}else {
		$(id).text("");
	}
}

//显示ajax加载动画
function showAjaxSaving(id, flag, showtext) {
	if(flag) {
		if ( typeof showtext != "undefined" && showtext) {
			$(id).html("<img src='../images/loading.gif'/>" + parent.lang.saving);
		} else {
			$(id).html("<img src='../images/loading.gif'/>");			
		}
	}else {
		$(id).text("");
	}
}

//配置焦点和失去焦点的显示提示信息
function setInputFocusBuleTip(id, tip) {
	var temp = $(id).val();
	if (temp === "") {
		$(id).val(tip);
	}
	$(id).focus(function(){
			var user = $(id).val();
			if(user === tip) { 
				$(id).val("");
			}
		});
	
	$(id).blur( function() { 
			var user = $(id).val();
			if(user === "") { 
				$(id).val(tip);
			}
		});
}

//判断ip地址是否有效
function checkIPAddress(id, errId, tip) {
	var ip = $.trim($(id).val());
	var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;//正则表达式   
	if(re.test(ip)) {   
	if( RegExp.$1<256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256 ) 
		$(errId).text("");
		return true;
	} else {
		var doname = /^([\w-]+\.)+((com)|(net)|(org)|(gov\.cn)|(info)|(cc)|(com\.cn)|(net\.cn)|(org\.cn)|(name)|(biz)|(tv)|(cn)|(mobi)|(name)|(sh)|(ac)|   (io)|(tw)|(com\.tw)|(hk)|(com\.hk)|(ws)|(travel)|(us)|(tm)|(la)|(me\.uk)|(org\.uk)|(ltd\.uk)|(plc\.uk)|(in)|(eu)|(it)|(jp))$/;
		var flag_domain = doname.test(ip);
		if(flag_domain){
			$(errId).text("");
			return true;
		} else {
			$(errId).text(tip);
			return false;
		}
	}
}

function checkPortValid(id, errId, tip) {
	var port = $.trim($(id).val());
	if (port === "" || port < 0 || port > 65535) {
		$(errId).text(tip);
		return false;
	} else {
		$(errId).text("");
		return true;
	}
}

//判断数字和字母
function checkDigitAlpha(id,errId,tipRequire,tipRegx,min) {
	var str = $.trim($(id).val());
	if (str === "") {
		$(errId).text(tipRequire);
		return false;
	}
	
	var re = /^[A-Za-z0-9]*$/;
	if(re.test(str) == false){
		$(errId).text(tipRegx);
   		return false;
	} else {
		if (typeof min != "undefined") {
			if (str.length < min) {
				$(errId).text(tipRegx);
				return false;
			}
		}
		
		$(errId).text("");
	   	return true;
	}
}

//判断数字和字母
function checkInput(id, errId, minlength, maxlength, tipRequire, tipRegx) {
	var str = $.trim($(id).val());
	if (str === "") {
		$(errId).text(tipRequire);
		return false;
	}
	
	var length = str.replace(/[^\x00-\xff]/g,"**").length;
	if(length < minlength || length > maxlength){
		$(errId).text(tipRegx);
   		return false;
	} else {
		$(errId).text("");
   		return true;
	}
}

//判断两个输入框信息是否一致
function checkInputNotEqual(id1, id2, errId, tipErr) {
	var str1 = $.trim($(id1).val());
	var str2 = $.trim($(id2).val());
	if (str1 == str2) {
		$(errId).text(tipErr);
		return false;
	} else {
		return true;
	}
}

//判断输入信息不超过指定的范围
function checkInputRange(id, errId, min, max, tipErr) {
	var str = $.trim($(id).val());
	if (str == "" ) {
		$(errId).text(tipErr);
		return false;
	}
	
	var value = parseIntDecimal(str);
	if (value < min || value > max) {
		$(errId).text(tipErr);
		return false;
	} else {
		$(errId).text("");
		return true;
	}
}

//判断邮件地址
function checkEmailValid(id, errId, errtip){
	var mail = $.trim($(id).val());
	if (mail != "") {
		var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
		if (!sReg.test(mail)) {
			$(errId).text(errtip);
			return false;
		}
	} 
	
	$(errId).text("");
	return true;   
}

//判断网址
function checkUrlValid(id, errId, errtip){
	var url = $.trim($(id).val());
	if (url != "") {
		var sReg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
		if (!sReg.test(url)) {
			$(errId).text(errtip);
			return false;
		}
	} 
	
	$(errId).text("");
	return true;   
}

//检查密码，允许密码为空白字符
function checkPasswordInput(id, errId, emptyTip) {
	var pwd = $(id).val();
	if (pwd != "") {
		$(errId).text("");
		return true;
	} else {
		$(errId).text(emptyTip);
		return false;
	}
}

function checkConfirmPassword(pwdId, confirmId, errId, errTip) {
	var pwd1 = $(pwdId).val();
	var pwd2 = $(confirmId).val();
	if (pwd1 != "") {
		if (pwd1 != pwd2) {
			$(errId).text(errTip);
			return false;
		} else {
			$(errId).text("");
			return true;
		}
	} else {
		$(errId).text("");
		return false;
	}
}

//存在特殊字符返回true，否则返回false
function checkSpecialCharacters(str) {
	//var myReg = "[@/'\"#$%&^*]+,<>";
//	var myReg = "#$@%^&\\/:*?\"<>|,";
//	var reg = new RegExp(myReg);
	//var reg = /^[^@\/\'\\\"#$%&\^\*]+$,/;
	//var reg = /^[A-Za-z0-9]*$/;
	var reg= /[@#,|?<>":*\\\/\$%\^&\*]+/g;
	if(reg.test(str)){
	//if(!reg.test(str))  {
		return true;
	} else {
		return false;
	}
}

//禁用或者启用输入框
function diableInput(id, disable, gray) {
	if (disable) {
		if (gray) {
			$(id).css({'color':'gray'});
		}
		$(id).attr("readonly","readonly");
		//$(id).attr({"disabled":"disabled"});
	} else {
		if (gray) {
			$(id).css({'color':'#000'});
		}
		$(id).removeAttr("readonly");
		//$(id).removeAttr("disabled");
	}
}

function disableButton(id, disable) {
	if (disable) {
		$(id).attr({"disabled":"disabled"});
	} else {
		$(id).removeAttr("disabled");
	}
}

//动态调整IFrame的高度
function dynIframeHeight(obj){
  var win = obj;
  var height = 30;
  if (document.getElementById && win) {
    if (window.opera) {
      //Opera
      if (win.contentWindow.document && win.contentWindow.document.body.scrollHeight) {
          win.height = win.contentWindow.document.body.scrollHeight + height;
      }
    }
    else {
      if (win.contentDocument && win.contentDocument.body.offsetHeight) {
        //IE8����FireFox��Chrome
        win.height = win.contentDocument.body.offsetHeight + height;
      }
      else
        if (win.Document && win.Document.body.scrollHeight) {
            //IE7
           	win.height = win.Document.body.scrollHeight + height;
        }
    }
  }
}

function pageWidth(){ 
	if($.browser.msie){ 
		return document.compatMode == "CSS1Compat"? document.documentElement.clientWidth : 
		document.body.clientWidth; 
	}else{ 
		return self.innerWidth; 
	} 
}

function showErrorMessage(result) {
	switch(result) {
	case 1:		//系统出现异常
		alert(top.lang.errException);
		break;
	case 2:		//会话已过期
		alert(top.lang.errSessionUnvalid);
		break;
	case 3:		//请求出现超时
		alert(top.lang.errTimeout);	
		break;
	case 4:		//请求出现异常
		alert(top.lang.errExceptionRequire);
		break;
	case 5:		//请求出现异常
		alert(top.lang.errExceptionNetwork);
		break;
	case 6:		//时间格式不正确
		alert(top.lang.errQueryTimeFormat);
		break;
	case 7:		//开始时间不得大于结束时间
		alert(top.lang.errQueryTimeRange);
		break;
	case 8:		//RET_REQUIRE_PARAM = 8;		//请求参数有误
		alert(top.lang.errRequireParam);
		break;
	case 9:		//RET_SERVER_NO_EXIST = 9;	//服务器信息不存在
		alert(top.lang.errServerNoExist);
		break;
	case 10:	//RET_SERVER_TYPE_ERR = 10;	//服务器类型信息不正确
		alert(top.lang.errServerTypeErr);
		break;
	case 11:	//RET_IDNO_EXIST = 11;	//编号已经被使用
		alert(top.lang.errIDNOExist);
		break;
	case 12:	//RET_DEVICE_NO_EXIST = 12;		//设备信息不存在
		alert(top.lang.errDeviceNoExist);
		break;
	case 13:	//RET_DEVICE_LIMIT_ERR = 13;
		alert(top.lang.errDeviceLimitErr);
		break;
	case 14:	//RET_DEVICE_BATCH_IDNO_ERR = 14;	//设备编号后3位必须为数字，并且递增后还保持有效
		alert(top.lang.errDeviceBatchIdnoErr);
		break;
	case 15:	//RET_ACCOUNT_EXIST = 15; 账号已经被使用
		alert(top.lang.errAccountExist);
		break;
	case 16:	//RET_CLIENT_NO_EXIST = 16; 客户信息不存在
		alert(top.lang.errClientNoExist);
		break;
	case 17:	//RET_CLIENT_HAS_DEVICE = 17;	//客户还有设备信息！无法删除！
		alert(top.lang.errClientHasDevice);
		break;
	case 18:	//RET_CLIENT_HAS_USER = 18;	//客户还有子用户信息！无法删除！
		alert(top.lang.errClientHasUser);
		break;
	case 19:	//RET_OLD_PWD_ERROR = 19;	//旧密码有误！
		alert(top.lang.errOldPwd);
		break;
	case 20:	//RET_USER_NO_EXIST = 20;	//用户信息不存在
		alert(top.lang.errUserNoExist);
		break;
	case 21:	//RET_ROLE_NO_EXIST = 21;	//角色信息已经存在
		alert(top.lang.errRoleNoExist);
		break;
	case 22:	//RET_ROLE_NAME_EXIST = 22;	//角色名称已经被使用
		alert(top.lang.errRoleNameExist);
		break;
	case 23:	//RET_ROLE_HAS_USER = 23;	//还有用户使用此角色信息！无法删除！
		alert(top.lang.errRoleHasUsed);
		break;	
	case 24:	//RET_NO_PRIVILIGE = 24;	//用户无权限
		alert(top.lang.errNoPrivilige);
		break;
	case 25:	//RET_VEHICLE_NO_EXIST = 25;	//车辆信息不存在
		alert(top.lang.errVehicelNoExist);
		break;
	case 26:	//RET_GROUP_NO_EXIST = 26;	//车辆分组不存在
		alert(top.lang.errGroupNoExist);
		break;
	case 27:	//RET_GROUP_HAS_USED = 27;	//车辆分组信息还在被占用（还存储子分组或者下级车辆）
		alert(top.lang.errGroupHasUsed);
		break;
	case 28:	//RET_DB_CONN_ERR = 28;	//数据库连接出现异常
		alert(top.lang.errDbConnErr);
		break;
	case 29:	//RET_NAME_EXIST = 29;	//名称已经被使用
		alert(top.lang.errNameExist);
		break;
	case 30:	//RET_NO_EXIST = 30;		//信息不存在
		alert(top.lang.errNoExist);
		break;
	case 31:	//RET_DOWN_STATION_SSID_EXIST = 31;		//下载站点SSID已经被使用
		alert(top.lang.errDownStationSsidExist);
		break;
	case 32:	//RET_DOWN_STATION_USED = 32;	//下载站点还被使用（拥有下载服务器信息）
		alert(top.lang.errDownStationUsed);
		break;
	case 33:	//RET_DOWN_STATION_NO_EXIST = 33;	//下载站点信息不存在
		alert(top.lang.errDownStationNoExist);
		break;
	case 34:	//RET_GROUP_NAME_USED = 34;	//同一分组下不允许存在相同名称的分组信息
		alert(top.lang.errGroupNameUsed);
		break;
	case 35:	//RET_DEVICE_HAS_REGISTER = 35;	//设备信息已经登记到系统中
		alert(top.lang.errDeviceHasRegister);
		break;
	case 36:	//RET_SERVER_NO_SUPPORT = 36;	//服务器不支持此功能
		alert(top.lang.errServerNoSupport);
		break;
	case 39:	//RET_DEVICE_IDNO_USED = 39;	//设备编号已经被使用
		alert(top.lang.errDeviceIdnoExists);
		break;
	case 41:	//RET_IMAGE_SIZE_ERR = 41;	//文件大小超过1M
		alert(top.lang.errImageSize);
		break;
	case 42:	//RET_IMAGE_TYPE_ERR = 42;	//文件格式错误
		alert(top.lang.errSImageType);
		break;
	case 45:	//RET_COMPANY_HAS_COMPANY = 45;	//公司还有子公司信息！无法删除！
		alert(top.lang.errCompanyHasCompany);
		break;
	case 46:	//RET_USER_DISABLED = 46; //用户已停用
		alert(top.lang.errUserDeactivated);
		break;
	case 47:	//RET_INSTALLED = 47; //设备已安装
		alert(top.lang.errDeviceInstalled);
		break;
	case 48:	//RET_JOBNUM_EXIST = 48; //工号已存在
		alert(top.lang.errJobNumberExists);
		break;
	case 49:	//RET_SIMCARD_EXIST = 49; //SIM卡号已存在
		alert(top.lang.errSIMCardExists);
		break;
	case 50:	//RET_VEHITEAM_NOT_MOVE = 50; //车队不能移动到父公司
		alert(top.lang.errVehiTeamNotMove);
		break;
	case 51:	//RET_RULE_EXIST = 51; //规则已存在
		alert(top.lang.errRuleExists);
		break;
	case 52:	//RET_TYPE_EXIST = 52; //类型已存在
		alert(top.lang.errTypeExists);
		break;
	case 53:	//RET_BRAND_EXIST = 52; //类型已存在
		alert(top.lang.errBrandExists);
		break;
	case 54:	//RET_DEVICE_USED = 54; //设备已被使用
		alert(top.lang.errDeviceUsed);
		break;
	case 55:	//RET_MARK_NAME_USED = 55; //标记名称已被使用
		alert(top.lang.errMarkNameUsed);
		break;
	case 56:	//RET_MARK_USED = 56; //标记已被使用
		alert(top.lang.errMarkUsed);
		break;
	case 57:	//RET_USER_RESPONSE_ERR = 57; //用户请求异常
		alert(top.lang.usersRequestFails);
		break;
	case 58:	//RET_DOWNLOADTASK_EXIST = 58; //下载任务已存在
		alert(top.lang.errDownloadTaskExists);
		break;
	case 59:	//RET_DEVICE_OFFLINE = 59;  //设备不在线
		alert(top.lang.video_not_online);
		break;
	case 60:	//RET_MEDIA_ADDRESS_ERR = 60;  //流媒体地址请求失败
		alert(top.lang.media_address_err);
		break;
	case 61:	//RET_SAFE_EXIST = 61;  //车辆已存在保险信息
		alert(top.lang.safe_excit_err);
		break;
	case 62:	//RET_LINE_NOT_EXIST = 62;  //线路信息不存在
		alert(top.lang.errLineInfoNotExists);
		break;
	case 63:	//RET_LINE_NAME_ERR = 63;  //导入线路错误
		alert(top.lang.errImportLineInfo);
		break;
	case 64:	//RET_LINE_HAS_VEHICLE = 64;  //线路下还有车辆，不能删除
		alert(top.lang.errLineHasVehicle);
		break;
	default:	//未知错误
		alert(top.lang.errUnkown);
		break;
	}	
}

/**
 * 设置是否全选或者不选	
 * @return {TypeName} 
 */
function onSelectedAll(id, allId) {
	if ($("#" + allId).attr("checked")) {
		 $("[name='" + id + "']").attr("checked",'true');//全选
		 $(".bDiv").find("table tr").addClass("trSelected");
	} else {
		$("[name='" + id + "']").removeAttr("checked");//取消全选
		$(".bDiv").find("table tr").removeClass("trSelected");
	}
}

//选中单个结点
function onSelectedItem(id, allId) {
	var checkAll = true;
	$("[name='" + id + "']").each(function(){
		if($(this).val() != "" && !$(this).attr("checked"))	{
			checkAll = false;
		}
	});
	
	if (checkAll) {
		 $("#" + allId).attr("checked", true);
	} else {
		$("#" + allId).removeAttr("checked");
	}
}

//取得选中的结点信息，返回数据
function getSelectItem(id) {
	var select = [];
	$("[name='" + id + "']").each(function(){
		if ($(this).val() != "" && $(this).attr("checked")) {
			select.push($(this).val());
		}
	});
	return select;
}

function getPageSize() {
	var scrW, scrH;
	if(window.innerHeight && window.scrollMaxY) {
		// Mozilla
		scrW = window.innerWidth + window.scrollMaxX;
		scrH = window.innerHeight + window.scrollMaxY;
	} else if(document.body.scrollHeight > document.body.offsetHeight){
		// all but IE Mac
		scrW = document.body.scrollWidth;
		scrH = document.body.scrollHeight;
	} else if(document.body) { // IE Mac
		scrW = document.body.offsetWidth;
		scrH = document.body.offsetHeight;
	}

	var winW, winH;
	if(window.innerHeight) { // all except IE
		winW = window.innerWidth;
		winH = window.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		// IE 6 Strict Mode
		winW = document.documentElement.clientWidth; 
		winH = document.documentElement.clientHeight;
	} else if (document.body) { // other
		winW = document.body.clientWidth;
		winH = document.body.clientHeight;
	}	
	
	// for small pages with total size less then the viewport
	var pageW = (scrW<winW) ? winW : scrW;
	var pageH = (scrH<winH) ? winH : scrH;

	return {PageW:pageW, PageH:pageH, WinW:winW, WinH:winH};
}

function getPageScroll() {
	var x, y;
	if(window.pageYOffset) {
		// all except IE
		y = window.pageYOffset;
		x = window.pageXOffset;
	} else if(document.documentElement && document.documentElement.scrollTop) {
		// IE 6 Strict
		y = document.documentElement.scrollTop;
		x = document.documentElement.scrollLeft;
	} else if(document.body) {
		// all other IE
		y = document.body.scrollTop;
		x = document.body.scrollLeft; 
	}
	return {X:x, Y:y};
}

function append2Table(tableId, k, row) {
	var temp;
	if ( (k % 2) == 1) {
		temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata\">" + row.html() + "</tr>";
	} else {
		temp = "<tr id=\"tableTop_" + k + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
	}
	$(tableId).append(temp);
}

function append2TableEx(tableId, k, row, id) {
	var temp;
	if ( (k % 2) == 1) {
		temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata\">" + row.html() + "</tr>";
	} else {
		temp = "<tr id=\"tableTop_" + id + "\" class=\"tabdata bluebg\">" + row.html() + "</tr>";
	}
	$(tableId).append(temp);
}

function getAlarmTypeString(armType) {
	var ret = "";
	switch(parseInt(armType)) {
	case 2:		
		ret = parent.lang.alarm_type_ungency_button;
		break;
	case 3:		
		ret = parent.lang.alarm_type_shake;
		break;
	case 4:		
		ret = parent.lang.alarm_type_video_lost;
		break;
	case 6:		
		ret = parent.lang.alarm_type_door_open_lawless;
		break;
	case 9:		
		ret = parent.lang.alarm_type_temperator;
		break;
	case 10:		
		ret = parent.lang.alarm_type_disk_error;
		break;
	case 11:		
		ret = parent.lang.alarm_type_overspeed;
		break;
	case 14:		
		ret = parent.lang.alarm_type_park_too_long;
		break;
	case 15:		
		ret = parent.lang.alarm_type_motion;
		break;
	case 18:		
		ret = parent.lang.alarm_type_gps_signal_loss;
		break;
	case 19:		
		ret = parent.lang.alarm_type_io1;
		break;
	case 20:		
		ret = parent.lang.alarm_type_io2;
		break;
	case 21:		
		ret = parent.lang.alarm_type_io3;
		break;
	case 22:		
		ret = parent.lang.alarm_type_io4;
		break;
	case 23:		
		ret = parent.lang.alarm_type_io5;
		break;
	case 24:		
		ret = parent.lang.alarm_type_io6;
		break;
	case 25:		
		ret = parent.lang.alarm_type_io7;
		break;
	case 26:		
		ret = parent.lang.alarm_type_io8;
		break;
	case 27:		
		ret = parent.lang.alarm_type_fence_in;
		break;
	case 28:		
		ret = parent.lang.alarm_type_fence_out;
		break;
	case 29:		
		ret = parent.lang.alarm_type_fence_in_overspeed;
		break;
	case 30:		
		ret = parent.lang.alarm_type_fence_out_overspeed;
		break;
	case 31:		
		ret = parent.lang.alarm_type_fence_in_lowspeed;
		break;
	case 32:		
		ret = parent.lang.alarm_type_fence_out_lowspeed;
		break;
	case 33:		
		ret = parent.lang.alarm_type_fence_in_stop;
		break;
	case 34:		
		ret = parent.lang.alarm_type_fence_out_stop;
		break;
	case 113:		
		ret = parent.lang.alarm_type_custom;
		break;
	case 67:
		ret = parent.lang.alarm_type_offline;
		break;
	default:	//未知错误
		ret = parent.lang.alarm_type_unkown;
		break;
	}	
	return ret;
}

function GetElementsByName(tag, name) { 
	var elem = document.getElementsByTagName(tag); 
	var arr = []; 
	var index = 0; 
	var l = elem.length; 
	for(var i = 0; i < l; i++) { 
		var att = elem[i].getAttribute("name"); 
		if(att == name) { 
		arr[index++] = elem[i]; 
		} 
	} 
	return arr; 
} 

//js获取项目根路径，如： http://localhost:8083/xx
function getRootPath(){
//获取当前网址，如： http://localhost:8083/xx/xx/xx.jsp
	var curWwwPath=window.document.location.href;
	//获取主机地址之后的目录，如： xx/xx/xx.jsp
	var pathName=window.document.location.pathname;
	var pos=curWwwPath.indexOf(pathName);
	//获取主机地址，如： http://localhost:8083
	var localhostPaht=curWwwPath.substring(0,pos);
	//获取带"/"的项目名，如：/xx
	var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	return localhostPaht;
}

//设置null=''
function changeNull(param){
	return param == null ? '': param;
}

/**
 * 判断字符串str是否包含在本字符串中
 * @param str
 * @returns {Boolean}
 */
String.prototype.indexOfNotCase = function(str) {
	return this.toLowerCase().indexOf(str.toLowerCase());
}