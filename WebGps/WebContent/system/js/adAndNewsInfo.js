var api = frameElement.api, W = api.opener;
var adType;
$(document).ready(function(){
	$.dialog.setting.zIndex = W.$.dialog.setting.zIndex;
	//加载语言
	loadLang();
	//配置失去焦点的事件
	$("#title").blur(checkTitle);
	$("#picture").blur(checkPicture);
	$("#validity").blur(checkValidity);
	$("#contentTextArea").blur(checkContent);
	$("#validity").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	adType = getUrlParameter("adType");
	if(adType=="news"){
		$("#labPic").css("display","none");
		$("#labPicx").css("display","none");
	}
	if (isEditAdOrNews()) {
		//从服务器查询数据
		ajaxLoadInfo();
	} else{
		$("#validity").val(dateTime2DateString(dateGetNextMulDay(new Date(),7)));
	}
}); 

function getAdType() {
	adType = $.trim($("#adType").html());
	if(adType == parent.lang.adAndNews_ad){
		return "ad";
	}else{
		return "news";
	}
}

function loadLang(){
	$("#lableTitle").text(parent.lang.ad_title);
	$("#lablePic").text(parent.lang.addPicture);
	$("#lableValidity").text(parent.lang.ad_validity);
	$("#lableContent").text(parent.lang.ad_content);
	$("#selectedImg").val(parent.lang.selectedImg);
	$("#pictureSize").text(parent.lang.pictureSize);
	$("#save").text(parent.lang.save);
}

function isEditAdOrNews() {
	var id = getUrlParameter("id");
	if (id !== null && id !== "") {
		return true;
	} else {
		return false;
	}
}

function ajaxLoadInfo() {
	var id = getUrlParameter("id");
	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("SysAdAndNewsAction_get.action?id=" + id + "&adType="+adType+"&type=one", function(json,action,success){
		$.myajax.showLoading(false);
		if (success) {
			$.each(json, function (i, adOrNews) {
				$("#title").val(adOrNews.title);
				if(adType=="ad"){
					$("#beforSrc").val(adOrNews.src);
					$("#bigPicture").attr("src","../upload/image/"+adOrNews.src);
					$("#dtbigPicture").show();
					$("#ddbigPicture").show();
					setTimeout(function(){editor.setData(adOrNews.content);},150);
					
				}
//				$("#validity").val(dateTime2DateString(dateGetNextMulDay(new Date(adOrNews.endTime),7)));
				$("#validity").val(dateTime2DateString(adOrNews.endTime));
				$("#contentTextArea").val(adOrNews.content);
			});
		} else {	
			W.doEditExit();
		}
	}, null);
}


function checkTitle() {
	if(adType=="news"){
		return checkInput("#title", "#titleWrong", 1, 100, parent.lang.errStringRequire, parent.lang.errNewsTitleRegex);
	}else{
		return checkInput("#title", "#titleWrong", 1, 100, parent.lang.errStringRequire, parent.lang.errTitleRegex);
	}
}

function checkPicture() {
	var bool = true;
	if (isEditAdOrNews()) {
		if(document.getElementById("picture").value=="" && $("#beforSrc").val() == ""){
			bool = false;
		}
	}else{
		if(document.getElementById("picture").value==""){
			bool = false;
		}
	}
	if(bool==false){
		$("#pictureWrong").text(parent.lang.errPicture);
		return false;
	}else{
		$("#pictureWrong").text("");
		return true;
	}
}

function checkValidity() {
	return checkInputRange("#validity", "#validityWrong", 1, 100, parent.lang.adAndNews_errValidity);
}

function checkContent() {
	if(adType=="news"){
		return checkInput("#contentTextArea", "#contentTextAreaWrong", 1, 300, parent.lang.errStringRequire, parent.lang.errNewsContentRegex);
	}else{
		return checkInput("#contentTextArea", "#contentTextAreaWrong", 1, 1000, parent.lang.errStringRequire, parent.lang.errAdContentRegex);
	}
}

function checkParam() {
	var ret = true;
	if (!checkTitle()) {
		ret = false;
	}
	
	if(adType=="ad" && !checkPicture()){
		ret = false;
	}
	
//	if (!checkValidity()) {
//		ret = false;
//	}
	
	if (!checkContent()) {
		ret = false;
	}
	
	return ret;
}

function ajaxFormSubmit(action){
	$("#adForm").ajaxSubmit({
		url:action,
		type:"post",
		dataType:"JSON",
		cache:false,/*禁用浏览器缓存*/
		success: function(json){
			if(json.result == 0){
				disback(json, true);
			}else if (json.result == 2) {
				//直接跳转到登录界面
				top.window.location = "login.html";
			} else {
				showErrorMessage(json.result);
				disback(json, false);
			}
		},error:function(data){
			disback(null, false);
		}
	});
}

function ajaxSaveAdOrNews() {
	adType = getUrlParameter("adType");
	if(adType=="ad"){
		$("#contentTextArea").val(editor.getData());
	}
	
	if (!checkParam()) {
		return;
	}
	
	var data={};
	data.title = $.trim($("#title").val());
	data.endTime = $.trim($("#validity").val());
	if(adType=="ad"){
		data.content = $.trim(editor.getData());
	//	$("#contentTextArea").val(editor.getContent());
	}
	$.myajax.showLoading(true, parent.lang.saving);
	var action;
	if (isEditAdOrNews()) {
		if(adType == "ad"){
			data.src = $.trim($("#beforSrc").val());
		}
		action = 'SysAdAndNewsAction_save.action?id=' + getUrlParameter("id")+'&adType='+adType;
	} else {
		action = 'SysAdAndNewsAction_save.action?adType='+adType;
	}
	ajaxFormSubmit(action);
}


function disback(json, success) {
	var exit = false;
	if (success) {
		exit = true;
	}
	$.myajax.showLoading(false);
	//关闭并退出对话框
	if (exit) {
		if (isEditAdOrNews()) {
			W.doEditSuc(getUrlParameter("id"), json);
		} else {
			W.doAddSuc();
		}
	}
}

function onSelectPicture(){
	$("#picture").click();
}

//图片显示
function previewImage(file,img) {
	if (file.files && file.files[0] ) {
		var reader = new FileReader();
		reader.onload = function(evt) {
			img.src=evt.target.result;
		}
		reader.readAsDataURL(file.files[0]);
	} else{ // 兼容IE
		img.src = "";
		file.select();
		file.blur();
		var src = document.selection.createRange().text;
		img.src =src;
	}
	
	var names = file.value.split("\\");
	var i= names.length;
	var exts = names[i-1].split(".");
	var j = exts.length;
	var ext=exts[j-1].toLowerCase();
    if (ext!="jpg" && ext!="gif" && ext!="bmp" && ext!="png" && ext!="jpeg"){
           alert("只允许上传gif、jpg、bmp、png、JPEG等格式的图片！");
           return; 
     } 
    $("#pictureWrong").hide();
    $("#ddbigPicture").show();
    $("#dtbigPicture").show();
    $("#beforSrc").val("");
}