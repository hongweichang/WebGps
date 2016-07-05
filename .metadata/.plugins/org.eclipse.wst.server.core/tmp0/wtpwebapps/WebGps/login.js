$(document).ready(function(){
	initWebsitteLang();
	//加载语言 
	loadLang();
	//登录右边展示
	$("#rollingBanner").width(bw);
	$("#rollingBanner").height(bh);
	$("#rb_btnBack").css("top",(bh - 48) * .5);
	$("#rb_btnNext").css("top",(bh - 48) * .5);
	
	$("#rb_item1").width(bw);
	$("#rb_item2").width(bw);
	$("#rb_items").width(bw*2);
	/*rbBtnfade(false);
	$("#rollingBanner").bind("mouseenter",function(e){rbBtnfade(true)});
	$("#rollingBanner").bind("mouseleave",function(e){rbBtnfade(false)});*/
	//$("#rb_dots").bind("click",function(e){window.location.href=rbURLArray[rbcurrent];});
	for(var i=0;i<bannerArray.length;i++){
		$("#rb_dots").append('<div id="rb_dot'+i+'" class="rb_dot" onclick="showPicture('+ i +')"></div>');
	}
	rbRollTo(0);
	var session = getUrlParameter("userSession");
	if (session != "") {
		setTimeout(directLogin, 100);
	} else {
		setTimeout(function () {$("#userAccount").focus();}, 1000);
		changeValidateCode();
	}
});

var isLogining = false;	//是否正在登录

var bw = 425;
var bh = 337;
var t;
var rbDelay = 4000;
var bannerArray = new Array('images/home/ad1.jpg', 'images/home/ad3.jpg', 'images/home/ad4.jpg', 'images/home/ad5.jpg');
var rbURLArray = new Array('#','#');
var rbBtnfadeSW = true;
var rbshow = false;
function rbBtnfade(show){
	if(rbBtnfadeSW){
		rbshow = show;
		rbBtnfadeSW = false;
		if(show){
			$("#rb_btnNext").fadeIn("fast",function(){rbBtnfadeSW = true;});
			$("#rb_btnBack").fadeIn("fast");
			$("#rb_dots").fadeIn("fast");
			clearTimeout(t);
		}else{
			$("#rb_btnNext").fadeOut("fast",function(){rbBtnfadeSW = true;});
			$("#rb_btnBack").fadeOut("fast");
			$("#rb_dots").fadeOut("fast");
			clearTimeout(t);
			t=setTimeout("rbtimedCount()",rbDelay);
		}
	}
}

var rbcurrent = bannerArray.length;
var rbRollingSW = true;
function rbRollTo(i,left){
	if(rbRollingSW){
		rbRollingSW = false;
		if(i<0){
			i=bannerArray.length -1;
		}else if(i>bannerArray.length -1){
			i=0;
		}
		if(i != rbcurrent){
			if(left){
				$("#rb_item2").css("background","url("+bannerArray[rbcurrent]+")");
				$("#rb_item1").css("background","url("+bannerArray[i]+")");
				
				$("#rb_items").css("left",-bw);
				$("#rb_items").animate({left:0},"fast",function(){
						rbRollingSW = true;
					});
			}else{
				$("#rb_item2").css("background","url("+bannerArray[i]+")");
				
				$("#rb_items").animate({left:-bw},"fast",function(){
						$("#rb_item1").css("background","url("+bannerArray[i]+")");
					
						$("#rb_items").css("left",0);
						
						rbRollingSW = true;
					});
			}
			rbcurrent = i;
			for(var ii=0;ii<bannerArray.length;ii++){
				if(ii == i){
					$("#rb_dot"+ii).css("background","url(images/home/current.png)");
				}else{
					$("#rb_dot"+ii).css("background","url(images/home/dot.png)");
				}
			}
			if(!rbshow){
				clearTimeout(t);
				t=setTimeout("rbtimedCount()",rbDelay);
			}
		}
	}
}

function showPicture(i){
	rbcurrent = i
	$("#rb_item1").css("background","url("+bannerArray[i]+")");
	for(var ii=0;ii<bannerArray.length;ii++){
		if(ii == i){
			$("#rb_dot"+ii).css("background","url(images/home/current.png)");
		}else{
			$("#rb_dot"+ii).css("background","url(images/home/dot.png)");
		}
	}
	if(!rbshow){
		clearTimeout(t);
		t=setTimeout("rbtimedCount()",rbDelay);
	}
}

function rbtimedCount(){
	if(!rbshow){
		rbRollTo(rbcurrent + 1);
		clearTimeout(t);
		t=setTimeout("rbtimedCount()", rbDelay);
	}
}

function loadLang(){
	$("#spanAccount").text(lang.website_login_account);
	$("#spanPassword").text(lang.website_login_password);
	$("#spanCode").text(lang.website_login_code);
	$("#spanChangeCode").text(lang.website_login_changeCode);
	$("#loginArea").text(lang.website_login_area);
	$("#spanLogin").text(lang.website_login_login);
	
	//$("#rand").attr("title", lang.login_FlashVerifycode);
	//设置名字输入为焦点
	//setInputFocusBuleTip("#userAccount", lang.login_InputUserName);
}

function changeValidateCode(obj) {   
    var currentTime= new Date().getTime();   
    $("#rand").attr("src", "rand.action?d=" + currentTime); 
    //obj.src = "rand.action?d=" + currentTime;   
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
	alert(event);
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

function doLogin(action, sysLogin, userAccount, password, verificationCode) {
	isLogining = true;
	var logintipdlg = $.dialog({id:'logintip',title:false,content:lang.login_logining});
	disableForm(true);
	$.ajax({
		url:action,
		data:{userAccount:decodeURI(userAccount),password:password,language:langCurLocal(),verificationCode:verificationCode},
		cache:false,/*禁用浏览器缓存*/
		dataType:"json",
		success:function(json){
			isLogining = false;
			disableForm(false);
			if(json){
				var flag = json.result;
				if(flag!=null){
					if(flag == 0){
						if (sysLogin) {
							SetCookie("SysAccount", json.Account);
							SetCookie("SysRole", json.Role);
							window.location = "system/index.html?lang="+langCurLocal();
						} else {
							SetCookie("Account", json.account);
							SetCookie("Name", json.name);
							SetCookie("IsAdmin", json.isAdmin);
							SetCookie("ShowLocation", json.showLocation);
							SetCookie("EditMileage", json.editMileage);
							if(json.pwdStatus){
								window.location = "index.html?lang="+langCurLocal();
							}else{
								$.dialog({id:'addtype', title:parent.lang.usermgr_user_editPwd,content:'url:password.html?id='+json.useid
									, min:false, max:false, lock:true});
							}
						}
					} else if (flag == 1) {
						alert(lang.errLogin_UserNoExist);
						$("#userAccount").focus();	
					} else if(flag == 2){
						alert(lang.errLogin_PasswordError);	
						$("#password").focus();	
					} else if(flag == 3){
						alert(lang.errLogin_Expired);
						$("#userAccount").focus();
					} else if(flag == 4){
						alert(lang.errLogin_Verify);
						$("#verificationCode").focus();
					} else if(flag == 5){
						alert(lang.errException);
					} else if(flag == 7){
						alert(lang.errLogin_Session);
						$("#userAccount").focus();
					} else {
						alert(lang.errUnkown);
					}
					if(flag != 0){
						changeValidateCode();
					}
				}else{
					alert(lang.errUnkown);
				}				
			}	
			logintipdlg.close();
		},error:function(XMLHttpRequest, textStatus, errorThrown){
			isLogining = false;
			alert(lang.errSendRequired);
			logintipdlg.close();
			disableForm(false);
		}
	});
}

function doPasswordSuc(){
	$.dialog({id:'addtype'}).close();
	$.dialog.tips(parent.lang.saveok, 1);
	window.location = "index.html?lang="+langCurLocal();
}
 
function login(){
	if (isLogining) {
		return ;
	}
	var userAccount = $("#userAccount").val();
	var password = $("#password").val();
	var action = "LoginAction_login.action";
	var sysLogin = false;
	if (userAccount == "admin") {
		action = "SysLoginAction_login.action";
		sysLogin = true;
	}
	
	var verificationCode = $("#verificationCode").val();
	if (formcheck(userAccount,password,verificationCode) == true){
		doLogin(action, sysLogin, userAccount, password, verificationCode);
	}
}

function directLogin() {
	var session = getUrlParameter("userSession");
	if (session != "") {
		var action = "LoginAction_sessionLogin.action?userSession=" + session;
		var ctype = getUrlParameter("ctype");
		if(ctype != null && ctype != '') {
			action += "&ctype="+ ctype;
		}
		doLogin(action, false, "", "", "");
	}
}

function disableForm(disable) {
	diableInput("#userAccount", disable, true);
	diableInput("#password", disable, true);
	diableInput("#verificationCode", disable, true);
	diableInput("#loginButton", disable, true);
}

function formcheck(userAccount,password,verificationCode){
	if(userAccount == null || userAccount == "" || userAccount == lang.login_InputUserName){
		alert(lang.login_UserNameEmpty);
		$("#userAccount").focus();
		return false;
	}
	if (verificationCode == null || verificationCode == "") {
		alert(lang.login_VerifycodeEmpty);
		$("#verificationCode").focus();
		return false;
	}
	if ( verificationCode.length < 4 ) {
		alert(lang.login_VerifycodeLength);
		$("#verificationCode").focus();
		return false;
	}
	return true;
}

