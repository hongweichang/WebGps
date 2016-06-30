
(function($) {
	/**
	 * 序列化表单
	 */
	$.fn.serializeObject = function() {
		var o = {};
		var a = this.serializeArray();
		$.each(a, function() {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [ o[this.name] ];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};
	
	$.myajax = {
		/**
		 * 初始化
		 */
		init : function() {
			jQuery.ajaxSetup({
				cache : false
			});
		},

		/**
		 * 提交数据 （example: $.cms.jsonPost('../user.do?method=addUser',"form1");）
		 * @param action 提交路径
		 * @param param 需要提交的数据
		 * @param form false = 基本类型数据；true = 表单类型数据 
		 * @param callback 回调函数（可选）
		 */
		jsonPost : function(action, param, formType, callback) {
			$.myajax.init();
			var data = '';
			if (formType) {
				data = JSON.stringify(jQuery('#' + param).serializeObject());
			} else {
				data = JSON.stringify(param);
			}
			jQuery.post(action, {json : data}, function(json, textStatus) {
				if(textStatus == 'timeout'){
					showErrorMessage(3);
					callback.call(this, json, false);
				} else if(textStatus == 'error') {
					showErrorMessage(1);
					callback.call(this, json, false);
				} else if (textStatus == "success") {
					if(json.result==0){	//会话无效
						callback.call(this, json, true);
					} else if (json.result == 2) {
						//直接跳转到登录界面
						top.window.location = "login.html";
					}else{
						showErrorMessage(json.result);
						callback.call(this, json, false);
					}
				} else {
					showErrorMessage(4);
					callback.call(this, json, false);
				}
			}, 'json');
		},

		/**
		 * 获取数据 （example: $.cms.jsonGet('../user.action?id='+_id,function(json){//方法体});）
		 * @param action 提交路径
		 * @param callback 回调函数
		 * @param 需要提交的数据
		 * @param form false = 基本类型数据；true = 表单类型数据 
		 */
		jsonGet : function(action, callback, param, formType) {
			$.myajax.init();
			var data = '';
			if (formType) {
				data = encodeURIComponent(JSON.stringify(jQuery('#' + param).serializeObject()));
			} else {
				data = encodeURIComponent(JSON.stringify(param));
			}
			$.ajax({
				url:action,
				type:"post",
				data:{json : data},
				cache:false,/*禁用浏览器缓存*/
				dataType:"json",
				success:function(json){
					if(json.result == 0){
						callback.call(this, json, action, true);
					}else if (json.result == 2) {
						//直接跳转到登录界面
						top.window.location = "login.html";
					} else {
						showErrorMessage(json.result);
						callback.call(this, json, action, false);
					}
				},error:function(XMLHttpRequest, textStatus, errorThrown){
					if (textStatus != "error") {
						//alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
					}
					callback.call(this, null, action, false);
				}
			});
		},
		
		/**
		 * 获取数据 （example: $.cms.jsonGet('../user.action?id='+_id,function(json){//方法体});）
		 * @param action 提交路径
		 * @param callback 回调函数
		 * @param 需要提交的数据
		 * @param form false = 基本类型数据；true = 表单类型数据 
		 */
		jsonGetEx : function(action, callback, pagin, parameter) {
			$.myajax.init();
			var page = encodeURIComponent(JSON.stringify(pagin));
			var parm = encodeURIComponent(JSON.stringify(parameter));
			$.ajax({
				url:action,
				type:"post",
				data:{pagin: page, json: parm},
				cache:false,/*禁用浏览器缓存*/
				dataType:"json",
				success:function(json){
					if(json.result == 0){
						callback.call(this, json, action, true);
					}else if (json.result == 2) {
						//直接跳转到登录界面
						top.window.location = "login.html";
					} else {
						showErrorMessage(json.result);
						callback.call(this, json, action, false);
					}
				},error:function(XMLHttpRequest, textStatus, errorThrown){
					if (textStatus != "error") {
						//alert(parent.lang.errSendRequired + " errorThrown:" + errorThrown + ",textStatus:" + textStatus);
					}
					callback.call(this, null, action, false);
				}
			});
		},
		
		/**
		 * 清空数据
		 */
		cleanTableContent : function(id) {
 			$(id + " tr").each(function(){
                if (/^(\w+)\_(\w+)/.test(this.id)) {
                	$(this).remove();
                }
            });
		},
		
		/**
		 * 显示加载度条
		 */
		showLoading : function(flag, msg, parentWnd) {
			if (flag) {
				//zindex  最顶层
				if (typeof msg === "undefined") {
					if (typeof parentWnd === "undefined") {
						$.dialog({id:'loading',title:false,content:parent.lang.loading});
					} else {
						$.dialog({id:'loading',title:false,content:parent.lang.loading,parent:parentWnd});
					}
				} else {
					if (typeof parent === "undefined") {
						$.dialog({id:'loading',title:false,content:msg});
					} else {
						$.dialog({id:'loading',title:false,content:msg,parent:parentWnd});
					}
				}			
				//$.dialog({id:'loading'}).zindex();
			} else {
				$.dialog({id:'loading'}).close();
			}
		},
		
		/**
		 * 显示顶层的loading
		 */
		showTopLoading : function(flag, msg) {
			if (flag) {
				$.dialog({id:'toploading',title:false,content:msg,lock:true});
			} else {
				$.dialog({id:'toploading'}).close();
			}
		},
		
		/**
		 * 显示分页组件
		 * @param id
		 */
		showPagination: function(id) {
			var pagination = new Array();
			pagination.push("			<a id=\"previousPage\" href=\"javascript::\">" + parent.lang.prevPage + "</a>");
			pagination.push("			&nbsp;&nbsp;");
			pagination.push("			<a id=\"nextPage\" href=\"javascript::\">" + parent.lang.nextPage + "</a>");
			pagination.push("			&nbsp;&nbsp;<label class=\"setdateinput\">" + parent.lang.total + " <span id=\"totalPages\">0</span> "+parent.lang.page+" &nbsp;&nbsp;<span id=\"totalRecords\">0</span> "+parent.lang.record+"");
			pagination.push("			&nbsp;&nbsp;"+parent.lang.current+" <input id=\"currentPage\" style=\"width:35px;\" name=\"currentPage\" value=\"0\" type=\"text\" onkeydown=\"return onKeyDownDigit(event);\" maxlength=\"5\" /> "+parent.lang.page+"");
			pagination.push("			&nbsp;<span id=\"hideCurrentPage\" style=\"display:none\"></span></label>");
			pagination.push("			<label class=\"setdateinput\"><button type=\"submit\" id=\"goPage\" name=\"goPage\">"+parent.lang.go+"</button></label>");
			$(id).html(pagination.join(''));
		},
		
		/**
		 * 分页初始化组件
		 * @param action 提交路径
		 * @param pagination 分页信息
		 * @param checkcallback 检测回调函数，如果返回false，则不会再发送ajax请求，函数参数isCheck，为true表示进行检查，为false，则需要配置查询的标志位为true，避免重复请求
		 * @param param 请求参数
		 * @param ajaxcallback ajax处理回调函数
		 */
		initPagination : function(action, pagination, checkcallback, ajaxcallback, param) {
			$(pagination.id).find('#totalPages').text(pagination.totalPages);
			$(pagination.id).find('#totalRecords').text(pagination.totalRecords);
			$(pagination.id).find('#currentPage').val(pagination.currentPage);	
			$(pagination.id).find('#hideCurrentPage').text(pagination.currentPage);	
			
			// 上一页
			$(pagination.id).find('#previousPage').unbind('click').bind("click", pagination, function() {
				if (!checkcallback.call(null, true)) {
					return ;
				}
				
				if (pagination.hasPreviousPage) {
					checkcallback.call(null, false);
					$.myajax.cleanTableContent(pagination.tableId);
					$.myajax.showLoading(true);
					pagination.currentPage = pagination.previousPage;
					if (typeof param != "undefined") {
						$.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
					} else {
						$.myajax.jsonGet(action, ajaxcallback, pagination);
					}
				} else {
					alert(parent.lang.hasReachedHome);
				}
			});
		
			// 下一页
			$(pagination.id).find('#nextPage').unbind('click').bind("click", pagination, function() {
				if (!checkcallback.call(null, true)) {
					return ;
				}
				
				if (pagination.hasNextPage) {
					checkcallback.call(null, false);
					$.myajax.cleanTableContent(pagination.tableId);
					$.myajax.showLoading(true);
					pagination.currentPage = pagination.nextPage;
					if (typeof param != "undefined") {
						$.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
					} else {
						$.myajax.jsonGet(action, ajaxcallback, pagination);
					}
				} else {
					alert(parent.lang.hasReachedEnd);
				}
			});
			
			// 更改当前页码事件
			/*
			$(pagination.id).find('#currentPage').unbind('change').bind("change", pagination, function() {	
				var tmpCurPage = $(pagination.id).find('#hideCurrentPage').text();
				var goPage = $(pagination.id).find('#currentPage').val();
				if (goPage == tmpCurPage) {
					return ;
				}
				
				if(!IsNumeric(goPage) || goPage == 0) {
					goPage = 1;
				}else if(goPage > pagination.totalPages) {
					goPage = pagination.totalPages;
				}
				$(pagination.id).find('#currentPage').val(goPage);
			});*/
			
			// 当前页码回车事件
			/*
			$(pagination.id).find('#currentPage').unbind('keyup').bind("keyup", pagination, function(event) {
				if (!checkcallback.call(null, true)) {
					return ;
				}
				var tmpCurPage = $(pagination.id).find('#hideCurrentPage').text();
				var goPage = $(pagination.id).find('#currentPage').val();
				if (goPage == tmpCurPage) {
					return ;
				}
				if (goPage <= 0){
					//alert(parent.lang.pageZoneUnvalid);
					goPage = 1;
				} else if (goPage > pagination.totalPages) {
					//alert(parent.lang.pageOverRange);
					goPage = 1;
				}
				
				if (!checkcallback.call(null, true)) {
					return ;
				}
				
				$.myajax.cleanTableContent(pagination.tableId);
				$.myajax.showLoading(true);
				pagination.currentPage = Number(goPage);
				if (typeof param != "undefined") {
					$.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
				} else {
					$.myajax.jsonGet(action, ajaxcallback, pagination);
				}
			});*/
			
			// 跳转页码事件
			$(pagination.id).find('#goPage').unbind('click').bind("click", pagination, function() {
				if (!checkcallback.call(this, true)) {
					return ;
				}
				
				var goPage = $(pagination.id).find('#currentPage').val();
				if (goPage <= 0){
					alert(parent.lang.pageZoneUnvalid);
					return ;
				}
				if (goPage > pagination.totalPages) {
					alert(parent.lang.pageOverRange);
					return ;
				}
				
				checkcallback.call(this, false);	
				$.myajax.cleanTableContent(pagination.tableId);
				$.myajax.showLoading(true);
				pagination.currentPage = Number(goPage);
				if (typeof param != "undefined") {
					$.myajax.jsonGetEx(action, ajaxcallback, pagination, param);
				} else {
					$.myajax.jsonGet(action, ajaxcallback, pagination);
				}
			});
		}
	};
})(jQuery);