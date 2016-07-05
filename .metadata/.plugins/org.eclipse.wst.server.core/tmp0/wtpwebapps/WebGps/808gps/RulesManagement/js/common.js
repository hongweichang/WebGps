//添加按钮所要的数组
function getButtonArray(type) {
	var buttons = [];
	var but = [];
	if(type == 'add' || type == 'edit') {
		but.push({
			display: parent.lang.save, 
			name : '', 
			pclass : 'submit',
			bgcolor : 'gray',
			hide : false
		});
		buttons.push(but);
		/*but = [];
		but.push({
			display: parent.lang.reset,
			name : '', 
			pclass : 'reset',
			bgcolor : 'gray', 
			hide : false
		});
		buttons.push(but);*/
	}
	but = [];
	but.push({
		display: parent.lang.close, 
		name : '', 
		pclass : 'close',
		bgcolor : 'gray', 
		hide : false
	});
	buttons.push(but);
	return buttons;
}

//添加 radio选项
function addRadio(name) {
	var content = '';
	content += '<input id="'+name+'-yes" name="'+name+'" type="radio" value="1"/>';
	content += '<label id="label-'+name+'-yes" for="'+name+'-yes"></label>';
	content += '<input id="'+name+'-no" name="'+name+'" type="radio" value="0" style="margin-left: 10px;"/>';
	content += '<label id="label-'+name+'-no" for="'+name+'-no"></label>';
	return content;
}

//添加通道
function addChnModule(name, count) {
	var content = '';
	if(name == 'cameraAll' || name == 'videoAll') {
		content += '<div class="module '+name+'">';
		content += '	<label for="checkbox-'+name+'"></label>';
		content += '	<input type="checkbox" name="'+name+'" value="1" id="checkbox-'+name+'" class="checkbox-'+name+'" style="float:right;"/>';
		content += '</div>';
	}else {
		for(var i = 1; i <= count; i++) {
			content += '<div class="module '+name+'">';
			content += '	<input type="checkbox" name="'+name+i+'" value="1" id="checkbox-'+name+i+'" class="checkbox-'+name+i+'"/>';
			content += '	<label for="checkbox-'+name+i+'"></label>';
			content += '</div>';
		}
	}
	return content;
}

//加载页面控件
function loadRuleParam() {
	$('.td-beginTime').append('<span style="float:left;margin:2px 8px;">'+parent.lang.rule_to+'</span><input id="input-endTime" class="form-input input-endTime" name="endTime" data-name="endTime" maxlength="10"/>');
	$("#input-beginTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$("#input-endTime").click(function() { WdatePicker({lang:parent.langWdatePickerCurLoacl(),dateFmt:'HH:mm:ss'}) });
	$('#input-beginTime').addClass('Wdate');
	$('#input-beginTime').attr('readonly','readonly');
	$('#input-endTime').addClass('Wdate');
	$('#input-endTime').attr('readonly','readonly');
	$('.td-camera').prepend(addRadio('camera'));
	$('.td-cameraWebcam').append(addChnModule('camera',8));
	$('.td-videoWebcam').append(addChnModule('video',8));
	$('.td-cameraWebcam').parent().find('th').append(addChnModule('cameraAll',1));
	$('.td-videoWebcam').parent().find('th').append(addChnModule('videoAll',1));
	
	$('.td-ruleName').append('<span class="span-tip red ruleNameTip" style="margin-left:10px;">*</span>');
	$('.td-areaName').append('<span class="span-tip red areaNameTip">*</span>');
	$('.td-maxSpeed').append('<span class="span-tip red maxSpeedTip">*</span><span class="maxSpeedUnit">'+parent.lang.rule_speedTip+'</span>');
	$('.td-minSpeed').append('<span class="span-tip red minSpeedTip">*</span><span class="minSpeedUnit">'+parent.lang.rule_speedTip+'</span>');
	$('.td-video').append('<span class="span-tip videoUnit">'+parent.lang.rule_videoTimeTip+'</span>');
	$('.td-phone').append('<span class="span-tip red phoneContentTip">'+parent.lang.rule_messageContentTip+'</span>');
	$('.td-mail').append('<span class="span-tip red mailContentTip">'+parent.lang.rule_mailContentTip+'</span>');
	$('.phoneTip').text(parent.lang.rule_phoneFillTip);
	$('.mailTip').text(parent.lang.rule_mailFillTip);
	$('#label-camera-yes').text(parent.lang.yes);
	$('#label-camera-no').text(parent.lang.no);
	$('#label-alarm-yes').text(parent.lang.yes);
	$('#label-alarm-no').text(parent.lang.no);
	$('.cameraAll').find('label').text(parent.lang.selectAll);
	$('.videoAll').find('label').text(parent.lang.selectAll);
	$('.td-cameraWebcam .camera').find('label').each(function(i) {
		$(this).text(parseInt(i+1)+parent.lang.rule_number);
	});
	$('.td-videoWebcam .video').find('label').each(function(i) {
		$(this).text(parseInt(i+1)+parent.lang.rule_number);
	});
	
	//输入框限制
	enterDigital('#input-maxSpeed');
	enterDigital('#input-minSpeed');
//	enterDigital('#input-beginTime');
//	enterDigital('#input-endTime');
	enterDigital('#input-video');

	//全选和反选
	$('.cameraAll').on('click',function() {
		var value = $("input[name='cameraAll']:checked").val();
		if(value != null && value != '' && value == 1) {
			$('.td-cameraWebcam .camera').find('input').each(function(i) {
				$('#checkbox-camera'+parseInt(i+1)).get(0).checked = true;
			});
		}else {
			$('.td-cameraWebcam .camera').find('input').each(function(i) {
				$('#checkbox-camera'+parseInt(i+1)).get(0).checked = false;
			});
		}
	});
	$('.td-cameraWebcam .camera').find('input').each(function() {
		$(this).on('click',function() {
			if(this.checked) {
				var flag = true;
				$('.td-cameraWebcam .camera').find('input').each(function() {
					if(!this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('.checkbox-cameraAll').get(0).checked = true;
				}else {
					$('.checkbox-cameraAll').get(0).checked = false;
				}
			}else {
				$('.checkbox-cameraAll').get(0).checked = false;
			}
		});
	});

	//全选和反选
	$('.videoAll').on('click',function() {
		var value = $("input[name='videoAll']:checked").val();
		if(value != null && value != '' && value == 1) {
			$('.td-videoWebcam .video').find('input').each(function(i) {
				$('#checkbox-video'+parseInt(i+1)).get(0).checked = true;
			});
		}else {
			$('.td-videoWebcam .video').find('input').each(function(i) {
				$('#checkbox-video'+parseInt(i+1)).get(0).checked = false;
			});
		}
	});

	$('.td-videoWebcam .video').find('input').each(function() {
		$(this).on('click',function() {
			if(this.checked) {
				var flag = true;
				$('.td-videoWebcam .video').find('input').each(function() {
					if(!this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('.checkbox-videoAll').get(0).checked = true;
				}else {
					$('.checkbox-videoAll').get(0).checked = false;
				}
			}else {
				$('.checkbox-videoAll').get(0).checked = false;
			}
		});
	});


}

function checkVideoTime() {
	if($('#input-video').val() == null || $('#input-video').val() == '') {
		$('#input-video').val(0);
	}
}

//获取规则属性
function ajaxSaveRule(data) {
	data.beginTime = shortHour2Second($.trim($("#input-beginTime").val()));
	data.endTime = shortHour2Second($.trim($("#input-endTime").val()));
	if(data.beginTime > data.endTime) {
		$('#required-area .panel-body').addClass('show');
		$('#input-beginTime').focus();
		$.dialog.tips(parent.lang.rule_startTimeNotThanEnd, 2);
		return;
	}
	if(data.endTime == 0) {
		$('#required-area .panel-body').addClass('show');
		$('#input-endTime').focus();
		$.dialog.tips(parent.lang.rule_endTimeNotZero, 2);
		return;
	}
	//获取拍照
	var camera = $.trim($("input[name='camera']:checked").val());
	var cameraWebcam = '';
	$('.td-cameraWebcam .camera').find('input').each(function(i) {
		var name = $.trim($(this).attr('name'));
		var value = $.trim($("input[name='"+name+"']:checked").val());
		if(value != null && value != '') {
			cameraWebcam = cameraWebcam + value;
		}else {
			cameraWebcam = cameraWebcam + '0';
		}
	});
	if(camera == 1 && cameraWebcam == '00000000') {
		$('#required-camera .panel-body').addClass('show');
		$.dialog.tips(parent.lang.rule_cameraNotNull, 2);
		return;
	}
	//获取录像
	var video = parseIntDecimal($('#input-video').val());
	var videoWebcam = '';
	$('.td-videoWebcam .video').find('input').each(function(i) {
		var name = $.trim($(this).attr('name'));
		var value = $.trim($("input[name='"+name+"']:checked").val());
		if(value != null && value != '') {
			videoWebcam = videoWebcam + value;
		}else {
			videoWebcam = videoWebcam + '0';
		}
	});
	if(video > 1800) {
		$('#required-camera .panel-body').addClass('show');
		$('#input-video').focus();
		$.dialog.tips(parent.lang.rule_videoTimeNotThan, 2);
		return;
	}
	if(video != null && video != '' && video != 0 && videoWebcam == '00000000') {
		$('#required-camera .panel-body').addClass('show');
		$.dialog.tips(parent.lang.rule_videoNotNull, 2);
		return;
	}
	//获取手机
	var phone = $.trim($('#textArea-phone').val());
	if (phone != null && phone != '') {
		var phoneNo = phone.split(";");
		for (var i = 0; i < phoneNo.length; ++ i) {
			if ( isNaN(phoneNo[i]) ) {
				$('#required-phone .panel-body').addClass('show');
				$('#textArea-phone').focus();
				$.dialog.tips(parent.lang.rule_messageIsError, 2);
				return;
			}
		}
	}
	//获取邮件
	var mail =  $.trim($("#textArea-mail").val());
	if (mail != null && mail != "") {
		var emailNo = mail.split(";");
		for (var i = 0; i < emailNo.length; ++ i) {
			var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
			if (!sReg.test(emailNo[i])) {
				$('#required-phone .panel-body').addClass('show');
				$('#textArea-mail').focus();
				$.dialog.tips(parent.lang.rule_mailIsError, 2);
				return;
			}
		}
	}
	
	if(data.param != null && data.param != '' && !data.param.toString().endWith('|')) {
		data.param = data.param + ',';
	}
	data.param = data.param +camera + ','+cameraWebcam+','+video+','+videoWebcam+','+phone+','+mail;
	//报警语音
	data.text = $.trim($('#textArea-voice').val());
	
	var action = 'StandardVehicleRuleAction_mergeVehicleRule.action';
	disableForm(true);
	$.myajax.showLoading(true, parent.lang.saving);
	$.myajax.jsonPost(action, data, false, function(json, success) {
		disableForm(false);
		$.myajax.showLoading(false);
		if (success) {
			W.doSaveRuleSuc();
		}
	});
}