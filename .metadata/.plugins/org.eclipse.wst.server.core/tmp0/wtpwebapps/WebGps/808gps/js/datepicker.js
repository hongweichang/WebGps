/* CSS Document */
jQuery(function($){
	$.datepicker.regional['zh-cn'] = {
		closeText: '关闭',
		prevText: '上月',
		nextText: '下月',
		currentText: '今天',
		monthNames: ['一月','二月','三月','四月','五月','六月',
		             '七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一','二','三','四','五','六',
		                  '七','八','九','十','十一','十二'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['周日','周一','周二','周三','周四','周五','周六'],
		weekHeader: '周',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		yearSuffix: '年'};
	$.datepicker.regional['zh-tw'] = {
			closeText: '關閉',
			prevText: '上月',
			nextText: '下月',
			currentText: '今天',
			monthNames: ['一月','二月','三月','四月','五月','六月',
			             '七月','八月','九月','十月','十一月','十二月'],
			monthNamesShort: ['一','二','三','四','五','六',
			                  '七','八','九','十','十一','十二'],
			dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
			dayNamesShort: ['週日','週一','週二','週三','週四','週五','週六'],
			dayNamesMin: ['週日','週一','週二','週三','週四','週五','週六'],
			weekHeader: '週',
			dateFormat: 'yy-mm-dd',
			firstDay: 1,
			isRTL: false,
			showMonthAfterYear: true,
			yearSuffix: '年'};
//	$.datepicker.setDefaults($.datepicker.regional['zh']);
});
