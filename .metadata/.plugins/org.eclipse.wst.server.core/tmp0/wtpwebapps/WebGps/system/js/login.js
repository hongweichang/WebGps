$(document).ready(function(){
	//初始化语言
	langInitByBrowser();
	//加载语言 
	loadLang();
	changeValidateCode();
	setTimeout(function () {$("#userAccount").focus();}, 1000);
});

function loadLang(){
	document.title = lang.sysTitle;
	$("#chinese").text(lang.chinese);
	$("#english").text(lang.english);
	$("#loginButton").text(lang.login);
	$("#gpsTitle").text(lang.sysTitle);
	$("#usrLogin").text(lang.login_usrLogin);
	$("#rand").attr("title", lang.login_FlashVerifycode);
	//设置名字输入为焦点
	setInputFocusBuleTip("#userAccount", lang.login_InputUserName);
}

function changeValidateCode() {   
    var currentTime= new Date().getTime();   
    $("#rand").attr("src", "rand.action?d=" + currentTime);    
}  

//切换语言
function switchLanguage(language) {
	var userName = $("#userAccount").val();
	if (userName == lang.login_InputUserName) {
		$("#userAccount").val("");
	}
	langChange(language);
	loadLang();
	SetCookie("language", language);
}

//键盘事件
$(document).keydown(function(event){
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
});
 
function login(){
	var userAccount = $("#userAccount").val();
	var password = $("#password").val();
	var verificationCode = $("#verificationCode").val();
	if (formcheck(userAccount,password,verificationCode) == true){
		var logintipdlg = $.dialog({id:'logintip',title:false,content:lang.login_logining});
		disableForm(true);
		$.ajax({
			url:"SysLoginAction_login.action",
			data:{userAccount:decodeURI(userAccount),password:password,language:langCurLocal(),verificationCode:verificationCode},
			cache:false,/*禁用浏览器缓存*/
			dataType:"json",
			success:function(json){
				disableForm(false);
				if(json){
					var flag = json.result;
					if(flag!=null){
						if(flag == 0){
							SetCookie("SysAccount", json.Account);
							SetCookie("SysRole", json.Role);
							window.location = "index.html?lang="+langCurLocal();
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
							changeValidateCode();
							alert(lang.errLogin_Verify);
							$("#verificationCode").focus();
						} else if(flag == 5){
							alert(lang.errException);
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
				alert(lang.errSendRequired);
				logintipdlg.close();
				disableForm(false);
			}
		});
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
