/**
 * 录像时间显示类
 */
function timelineInfo() {
	this.rootId = null;  //最外层div的对象
	this.orglength = 0;  //原始长度
	this.maxlength = 0;  //时间线的长度
}

//设置顶层id
timelineInfo.prototype.setRootId = function(rootId) {
	this.rootId = document.getElementById(rootId);
}

//初始化录像时间显示
timelineInfo.prototype.initialize = function() {
	//初始化录像时间线
	this.initTimeline();
	//添加鼠标进入函数
	this.addMouseEvent();
}

//初始化录像时间线
timelineInfo.prototype.initTimeline = function() {
	$(this.rootId).css('position','relative');
	$(this.rootId).css('padding','0px 5px');
	
	var tl_all = document.createElement("div");
	tl_all.className = "flexigrid";
	var tl_cont = document.createElement("div");
	tl_cont.className = "tl-content";
	$(tl_cont).append('<div class="tl-content-table"></div>');
	
	$(tl_all).append(tl_cont);
	
	var tl_time = document.createElement("div");
	tl_time.className = "tl-timeline";
	var table = document.createElement("div");
	table.className = "tl-timeline-table";
	var tr1 = document.createElement("div");
	tr1.className = "tl-timeline-tr1";
	$(tr1).addClass('tl-timeline-tr');
	var tr2 = document.createElement("div");
	tr2.className = "tl-timeline-tr2";
	$(tr2).addClass('tl-timeline-tr');
	
	var times = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00',
	             '14:00','16:00','18:00','20:00','22:00','24:00']
	
	for (var i = 0; i < 24; i++) {
		$(tr1).append('<div class="tl-timeline-td"></div>');
	}
	for (var i = 0; i < 12; i++) {
		if(i == 0) {
			$(tr2).append('<div class="tl-timeline-td"><span style="margin-left: 0px;">'+times[i]+'</span></div>');
		}else if(i == 11) {
			$(tr2).append('<div class="tl-timeline-td"><span>'+times[i]+'</span><span style="float: right;">'+times[i+1]+'</span></div>');
		}else {
			$(tr2).append('<div class="tl-timeline-td"><span>'+times[i]+'</span></div>');
		}
	}
	
	$(table).append(tr1);
	$(table).append(tr2);
	$(tl_time).append(table);
	
	$(tl_all).append(tl_time);
	
	var tl_line = document.createElement("div");
	tl_line.className = "tl-line";
	
	$(tl_all).append(tl_line);
//	$(tl_all).css('border','1px solid #ddd');
	
	var tl_tip = document.createElement("div");
	tl_tip.className = "tl_tip";
	$(tl_tip).append('<span class="tl-tip-chn" style="margin-right:5px;"></span><span class="tl-tip-time"></span>');
	
	$(tl_all).append(tl_tip);
	
	$(this.rootId).append(tl_all);
	
	//获取时间线的长度
	this.orglength = $(tl_all).width();
	
	var width = parseIntDecimal(this.orglength/24);
	$('.tl-timeline-td',tr1).css('width', width - 1);
	$('.tl-timeline-td',tr2).css('width', width * 2);
	
	this.maxlength = width * 24;
	
	$(tl_all).css('width', this.maxlength+2);
	$(tl_time).css('width', this.maxlength+2);
	
	$(tl_all).css('padding-left', parseIntDecimal((this.orglength - this.maxlength)/2) + 'px');
	$(tl_all).css('padding-right', parseIntDecimal((this.orglength - this.maxlength)/2) + 'px');
	$(tl_time).css('padding-left', parseIntDecimal((this.orglength - this.maxlength)/2) + 'px');
	$(tl_time).css('padding-right', parseIntDecimal((this.orglength - this.maxlength)/2) + 'px');
	
}

//添加鼠标进入函数
timelineInfo.prototype.addMouseEvent = function() {
	var timeline_ = this;
	$('.flexigrid',this.rootId).mousemove(function(e) {
		var xx = e.pageX;
		var yy= e.pageY;
		
		var difValue = parseIntDecimal((timeline_.orglength - timeline_.maxlength)/2);
		
		var left = xx - timeline_.getLeft(this) - difValue;
		var top = yy - timeline_.getTop(this);
		if(left <= 0) {
			left = 0;
		}
		if(left >= timeline_.maxlength) {
			left = timeline_.maxlength;
		}
		
		$(this).find('.tl-line').height($(this).height());
		$(this).find('.tl-line').css('left', left + difValue);
		
		var tip_left = left;
		if(tip_left >= timeline_.maxlength - $('.tl_tip').width()) {
			tip_left = timeline_.maxlength - $('.tl_tip').width();
		}
		top = top - 20;
		if(top <= 0) {
			top = 0;	
		}
		if(top >= $(this).height() - 22) {
			top = $(this).height() - 22;
		}
		$(this).find('.tl_tip').css('left', tip_left + difValue);
		$(this).find('.tl_tip').css('top', top);
		
		var second = parseIntDecimal(timeline_.getSecond(left));
		var time = timeline_.second2ShortHourEx(second);
		
		$(this).find('.tl_tip .tl-tip-time').html(time);
		$(this).find('.tl_tip .tl-tip-time').attr('data-time', second);
	});
	
	//进入通道
	$('.tl-content .tl-content-tr',this.rootId).mousemove(function(e) {
		$('.tl-tip-chn','.tl_tip').text($(this).attr('data-chn'));
	});
	
	//进入时间线
	$('.tl-timeline',this.rootId).mousemove(function(e) {
		$('.tl-tip-chn','.tl_tip').text('');
	})
}

//获取通道名
timelineInfo.prototype.getChnName = function(chns, chn) {
	if(chns != null && chn != null) {
		for (var i = 0; i < chns.length; i++) {
			if(chn == chns[i].index) {
				return chns[i].name;
			}
		}
	}
	return "";
}

//添加通道属性
timelineInfo.prototype.addVideoChnTr = function(chns){
	for (var i = 0; i < chns.length; i++) {
		var tr = document.createElement("div");
		tr.className = "tl-content-tr";
		$(tr).addClass("tl-content-tr"+i);
		var chnName = this.getChnName(chns, i);
		$(tr).attr('data-chn', chnName);
		$(tr).append('<div class="tl-content-tr-chn">'+ chnName +'</div>');
		$('.tl-content-table').append(tr);
	}
}

//通道属性添加点击事件
timelineInfo.prototype.addVideoChnTdClickEvent = function(chnTd, relChn, chn, callback){
	var timeline_ = this;
	$(chnTd).on('click',function() {
		var id = $(this).attr('data-id');
		var begTime = $(timeline_.rootId).find('.tl_tip .tl-tip-time').attr('data-time');
		if((typeof callback) == 'function') {
			callback(id, relChn, chn, begTime);
		}
	});
}

//添加通道属性
timelineInfo.prototype.addVideoChnTd = function(data, callback){
	var tr = $('.tl-content-tr'+data.relChn);
	var td = document.createElement("div");
	td.className = "tl-content-td";
	$(td).attr('data-id', data.id);
//	$(td).css('background-color', data.color);
	var difValue = parseIntDecimal((this.orglength - this.maxlength)/2);
	var allSec = 24 * 60 * 60;
	var left = data.relBeg / allSec * this.maxlength;
	var right = data.relEnd / allSec * this.maxlength;
	
	var width = right - left;
	if(width < 1) {
		width = 1;
	}
	$(td).css('left', left);
	$(td).css('width', width);
	
	if(data.type == 0) {
		$(td).css('background-color', "rgba(51, 153, 255, 0.5)");
	}
	
	//通道属性添加点击事件
	if(data.chnMask > 0 || data.chn == 98) {
		this.addVideoChnTdClickEvent(td, data.relChn, data.relChn,callback);
	}else {
		this.addVideoChnTdClickEvent(td, data.relChn, 0, callback);
	}
	
	//已经添加了该通道
	if(tr.length > 0) {
		$(tr).append(td);
	}else {
		tr = document.createElement("div");
		tr.className = "tl-content-tr";
		$(tr).addClass("tl-content-tr"+data.chn);
		$(tr).attr('data-chn', data.chnName);
		$(tr).append('<div class="tl-content-tr-chn">'+ data.chnName +'</div>');
		$(tr).append(td);
		$('.tl-content-table').append(tr);
	}
}

/**
 * 添加通道属性
 * @param files 文件信息列表
 * @param chns  所有通道信息
 * @param chn 通道 -1 表示所有普通道
 */
timelineInfo.prototype.addVideoChn = function(files, chns, chn, callback){
	if((typeof files) != "undefined" && files.length > 0) {
		if(chns != null && chns.length > 0) {
			this.addVideoChnTr(chns);
		}
		for (var i = 0; i < files.length; i++) {
			var data = files[i];
			if(data.chnMask > 0) {
				var maskChns = data.maskChns.split(',');
				for (var j = 0; j < maskChns.length; j++) {
					if(chn == -1 || chn == maskChns[j]) {
						data.relChn = maskChns[j];
						this.addVideoChnTd(data, callback);
					}
				}
			}else {
				if(data.chn == 98) {
					for (var j = 0; j < chns.length; j++) {
						if(chn == -1 || chn == j) {
							data.relChn = j;
							this.addVideoChnTd(data, callback);
						}
					}
				}else {
					if(chn == -1 || chn == data.chn) {
						data.relChn = data.chn;
						this.addVideoChnTd(data, callback);
					}
				}
			}
			
		}
		this.dynamicChnTrHeight();
		//进入通道
		$('.tl-content .tl-content-tr',this.rootId).mousemove(function(e) {
			$('.tl-tip-chn','.tl_tip').text($(this).attr('data-chn'));
		});
	}
}

//清空通道属性
timelineInfo.prototype.clearVideoChn = function(){
	$('.tl-content-table').empty();
}

//隐藏时间线
timelineInfo.prototype.hideVideoTimeline = function(hide){
	if(hide) {
		$('.tl-timeline').hide();
	}else {
		$('.tl-timeline').show();
	}
}

//动态调整通道高度
timelineInfo.prototype.dynamicChnTrHeight = function(){
	var height = $('.flexigrid',this.rootId).height() - $('.tl-timeline',this.rootId).height();
	var size = $('.tl-content-table .tl-content-tr').length;
	$('.tl-content-table .tl-content-tr').css('height', height/size);
	$('.tl-content-table .tl-content-tr').css('line-height', height/size);
	
	var top = parseIntDecimal((height/size - 24)/2);
	if(top < 0) {
		top = 0;	
	}
	$('.tl-content-table .tl-content-tr-chn').css('padding-top', top);
	
	$('.tl-content-table .tl-content-td').css('height', height/size);
	$('.tl-content-table .tl-content-td').css('line-height', height/size);
}

//获取距离body的上边距
timelineInfo.prototype.getTop = function(e){
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
timelineInfo.prototype.getLeft = function(e){
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

//获得秒数
timelineInfo.prototype.getSecond = function(left) {
	var allSec = 24 * 60 * 60;
	var width = parseIntDecimal(this.maxlength/24);
	
	var lim = left / this.maxlength;
	var second = allSec * lim;
	
	if(second >= allSec) {
		second = allSec;
	}
	return second;
}

//转换秒 如  0 = 0:0
timelineInfo.prototype.second2ShortHourEx = function(second) {
	var hour = parseIntDecimal(second / 3600);
	var hourStr = hour;
	if (hour < 10) {
		hourStr = "0" + hour;
	}
	var minute = parseIntDecimal((second % 3600) / 60);
	var minStr = minute;
	if (minute < 10) {
		minStr = "0" + minute;
	}
	var second = parseIntDecimal(second %  60);
	var secStr = second;
	if (second < 10) {
		secStr = "0" + second;
	}
	return hourStr + ":" + minStr + ":" + secStr;
}