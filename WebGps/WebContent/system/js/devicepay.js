
function initPayment() {
	$("#payPeriod").append("<option value='6'>" + parent.lang.device_pay6month + "</option>");
	$("#payPeriod").append("<option value='12'>" + parent.lang.device_pay12month + "</option>");
	$("#payPeriod").append("<option value='18'>" + parent.lang.device_pay18month + "</option>");
	$("#payPeriod").append("<option value='24' selected>" + parent.lang.device_pay24month + "</option>");
	
	$("#payBegin").click(function() { WdatePicker({onpicked:onChangePayPeriod,lang:parent.langWdatePickerCurLoacl(),dateFmt:'yyyy-MM-dd'}) });
	$('#payPeriod').change(onChangePayPeriod);
	$("#checkPayment").click(onCheckPayment); 
	$("#payDelay").blur(checkPayDelay);
	$("#payMonth").blur(checkPayMonth);
	diableInput("#payStatus", true, true);
	diableInput("#payOverDay", true, true);
	
	initStoPeriod();
}

function getPayStatus(payBegin, payMonth, payDelay) {
	var payEnd = dateGetNextMulMonth(dateStrDate2Date(payBegin), parseIntDecimal(payMonth));
	payEnd = dateGetNextMulDay(payEnd, payDelay);
	var today = new Date();
	var y,m,d;
	d = today.getDate();
	m = today.getMonth();
	y = today.getFullYear();
	//alert(Date.parse(payEnd));
	//alert(Date.parse(new Date(y,m,d)));
	var now = Date.parse(new Date(y,m,d));
	var end = Date.parse(payEnd);
	if ( end <= now) {
		var day = (now - end) / 86400000; 
		return day;
	} else {
		return 0;
	}
}

function initPayLang(){
	$("#selectPayment").text(parent.lang.device_selectPayment);
	$("#labelPayBegin").text(parent.lang.device_labelPayBegin);
	$("#lablePayPeriod").text(parent.lang.device_labelPayPeriod);
	$("#labelPayEnd").text(parent.lang.device_labelPayEnd);
	$("#labelPayDelay").text(parent.lang.device_labelPayDelay);
	$("#labelPayMonth").text(parent.lang.device_labelPayMonth);
	$("#labelPayStatus").text(parent.lang.device_labelPayStatus);
	$("#labelPayOverDay").text(parent.lang.device_labelPayOverDay);
	$("#labelStoDay").text(parent.lang.device_labelStoDay);
}

function initStoPeriod() {
	$("#selStoDay").append("<option value='0' selected>0</option>");
	$("#selStoDay").append("<option value='3'>3</option>");
	$("#selStoDay").append("<option value='7'>7</option>");
	$("#selStoDay").append("<option value='30'>30</option>");
}

function onCheckPayment() {
	var enablePayment = true;
	if ($("#checkPayment").attr("checked")) {
		enablePayment = false;
		checkPayMonth();
		checkPayDelay();
	} else {
		$("#payDelayWrong").text("");
		$("#payMonthWrong").text("");
	}
	disablePayment(enablePayment);
	checkPayStatus();
}

function disablePayment(disable) {
	diableInput("#payBegin", disable, true);
	diableInput("#payPeriod", disable, true);
	diableInput("#payEnd", disable, true);
	diableInput("#payDelay", disable, true);
	diableInput("#payMonth", disable, true);
	diableInput("#selStoDay", disable, true);
}

function fillPayment(json) {
	if (json.payEnable == 1) {
		$("#checkPayment").attr("checked", true);
	}
	if (json.payBegin == null) {
		$("#payBegin").val(dateTime2DateString(json.dateProduct));
	} else {
		$("#payBegin").val(dateTime2DateString(json.payBegin));
	}
	if (json.payDelayDay == null) {
		$("#payDelay").val(0);
	} else {
		$("#payDelay").val(json.payDelayDay);
	}
	if (json.payMonth == null) {
		$("#payMonth").val(0);
	} else {
		$("#payMonth").val(json.payMonth);
	}
	
	setTimeout(function () { 
		if (json.payPeriod == null) {
			$("#payPeriod").val(24);
		} else {
			$("#payPeriod").val(json.payPeriod);
		}
		if (json.stoDay == null) {
			$("#selStoDay").val(0);
		} else {
			$("#selStoDay").val(json.stoDay);
		}
		onCheckPayment();
		onChangePayPeriod();
		}, 10);
}

function onChangePayPeriod() {
	var payPeriod = $("#payPeriod").val();
	var payBegin = $("#payBegin").val();
	var payEnd = dateGetNextMulMonth(dateStrDate2Date(payBegin), parseIntDecimal(payPeriod));
	$("#payEnd").val(dateFormat2DateString(payEnd));
	
	checkPayStatus();
}

function checkPayStatus() {
	var payBegin = $("#payBegin").val();
	if (payBegin == "") {
		$("#payStatus").text("");
	} else {
		var payMonth = $("#payMonth").val();
		var payEnd = dateGetNextMulMonth(dateStrDate2Date(payBegin), parseIntDecimal(payMonth));
		payEnd = dateGetNextMulDay(payEnd, $("#payDelay").val());
		
		var today = new Date();
		var y,m,d;
		d = today.getDate();
		m = today.getMonth();
		y = today.getFullYear();
		//alert(Date.parse(payEnd));
		//alert(Date.parse(new Date(y,m,d)));
		var now = Date.parse(new Date(y,m,d));
		var end = Date.parse(payEnd);
		if ( end <= now) {
			$("#payStatus").val(parent.lang.device_payStatusAbnormal);
			var day = (now - end) / 86400000; 
			$("#payOverDay").val(day);
		} else {
			$("#payStatus").val(parent.lang.device_payStatusNormal);
			$("#payOverDay").val(0);
		}
	}
}

function checkPayMonth() {
	checkPayStatus();
	return checkInputRange("#payMonth", "#payMonthWrong", 0, 24, parent.lang.device_errPayMonth);
}

function checkPayDelay() {
	checkPayStatus();
	return checkInputRange("#payDelay", "#payDelayWrong", 0, 14, parent.lang.device_errPayDelay);
}

function checkPayment() {
	var ret = true;
	if ($("#checkPayment").attr("checked")){
		if (!checkPayMonth()) {
			ret = false;
		}
		if (!checkPayDelay()) {
			ret = false;
		}
	} 
	return ret;
}

function savePayment(editDevice, data) {
	if ($("#checkPayment").attr("checked")){
		data.payEnable = 1;
	} else {
		data.payEnable = 0;
	}
	data.payBegin = $("#payBegin").val();
	data.payPeriod = $("#payPeriod").val();
	data.payDelayDay = $("#payDelay").val();
	if (editDevice) {
		var payMonth = parseIntDecimal($("#payMonth").val());
		if (payMonth < 0 || payMonth > 24) {
			payMonth = 0;
		} 
		data.payMonth = payMonth;
		var payDelayDay = parseIntDecimal($("#payDelay").val());
		if (payDelayDay < 0 || payDelayDay > 24) {
			payDelayDay = 0;
		} 
		data.payDelayDay = payDelayDay;
	} else {
		data.payMonth = 0;
	}
	data.stoDay = $("#selStoDay").val();
	return data;
}