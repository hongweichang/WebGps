/*
 * Flexigrid for jQuery -  v1.1
 *
 * Copyright (c) 2008 Paulo P. Marinas (code.google.com/p/flexigrid/)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 */
(function ($) {
	/*
	 * jQuery 1.9 support. browser object has been removed in 1.9 
	 */
	var browser = $.browser
	
	if (!browser) {
		function uaMatch( ua ) {
			ua = ua.toLowerCase();

			var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
				/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
				/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
				/(msie) ([\w.]+)/.exec( ua ) ||
				ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
				[];

			return {
				browser: match[ 1 ] || "",
				version: match[ 2 ] || "0"
			};
		};

		var matched = uaMatch( navigator.userAgent );
		browser = {};

		if ( matched.browser ) {
			browser[ matched.browser ] = true;
			browser.version = matched.version;
		}

		// Chrome is Webkit, but Webkit is also Safari.
		if ( browser.chrome ) {
			browser.webkit = true;
		} else if ( browser.webkit ) {
			browser.safari = true;
		}
	}
	
    /*!
     * START code from jQuery UI
     *
     * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
     * Dual licensed under the MIT or GPL Version 2 licenses.
     * http://jquery.org/license
     *
     * http://docs.jquery.com/UI
     */
     
    if(typeof $.support.selectstart != 'function') {
        $.support.selectstart = "onselectstart" in document.createElement("div");
    }
    
    if(typeof $.fn.disableSelection != 'function') {
        $.fn.disableSelection = function() {
            return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
                ".ui-disableSelection", function( event ) {
                event.preventDefault();
            });
        };
    }
    
    /* END code from jQuery UI */
    
	$.addFlexPanel = function (t, p) {
		p = $.extend({ //apply default properties
			height: 200, //default height//flexigrid插件的高度，单位为px  
			width: 'auto', //auto width//宽度值，auto表示根据每列的宽度自动计算，在IE6下建议设置具体值否则会有问题  
			minwidth: 30, //min width of columns//列的最小宽度
			minheight: 80, //min height of columns//列的最小高度
            getPanelClass: function(g) { //get the grid class, always returns g
                return g;
            }
		}, p);
		$(t).show() //show if hidden
			.removeAttr('width'); //remove width properties
		//create grid class
		var g = {
			hset: {},
			IEVersion: navigator.appVersion.indexOf("MSIE")!=-1?parseFloat(navigator.appVersion.split("MSIE")[1]):!1,
			isIE: "ActiveXObject" in window,
			addSerachBarModel: function (item) {//搜索框
				var mod_1 = document.createElement('div');
				$(mod_1).addClass('real-search-bar search-bar search-none');
				if(item.pfloat) {
					$(mod_1).css('float',item.pfloat);
				}
				var mod_2 = document.createElement('div');
				$(mod_2).addClass('search-input-ctn');
				var value = '';
				if(item.display) {
					value = item.display;
				}
				var name = '';
				if(item.name) {
					name = item.name;
				}
				$(mod_1).append('<label class="search-placeholder">'+value+'</label>');
				var cont = '';
				cont += '<input name="'+name+'" data-placeholder="'+value+'" placeholder="'+value+'" class="search-input search-text ">';
				//if(isBrowseIE6 || isBrowseIE7 || isBrowseIE8 || isBrowseIE9) {
				//	
				//}
				if (!g.isIE) {
					cont += '<i class="icon icon-close ss-close"></i>';
				}
				$(mod_2).append(cont);
				$(mod_1).append(mod_2);
				$(mod_1).append('<span class="y-btn y-btn-gray y-btn-submit"><i class="icon icon-search"></i></span>');
				$('.search-input',mod_2).placeholder();
				$('.search-input',mod_1).on('focus',function(){
					$(mod_1).addClass('search-focus');
				}).on('blur',function(){
					$(mod_1).removeClass('search-focus');
				}).on('keydown',function(){
					if($(this).val() != '') {
						$(mod_1).addClass('search-have-content');
						$('.icon-close',mod_1).show();
					}else {
						$(mod_1).removeClass('search-have-content');
						$('.icon-close',mod_1).hide();
					}
				}).on('keypress',function(){
					if($(this).val() != '') {
						$(mod_1).addClass('search-have-content');
						$('.icon-close',mod_1).show();
					}else {
						$(mod_1).removeClass('search-have-content');
						$('.icon-close',mod_1).hide();
					}
				}).on('keyup',function(){
					if($(this).val() != '') {
						$(mod_1).addClass('search-have-content');
						$('.icon-close',mod_1).show();
					}else {
						$(mod_1).removeClass('search-have-content');
						$('.icon-close',mod_1).hide();
					}
				});
				$('.icon-close',mod_1).on('click',function(){
					$('.search-input',mod_1).val('');
					$(this).hide();
				});
				return mod_1;
			},
			addComBoboxModel: function (params) {//选择框
				var combobox = null;
				if(params.button) {
					combobox = g.addButtonsModel(params.button);
				}else if(params.input) {
					combobox = g.addInputModel(params.input);
				}
				var multiple = params.combox.multiple;//多选
				var items = g.strToArray(params.combox.option, '|', '&');
				var mod_1 = document.createElement('div');
				var mod_2 = document.createElement('div');
				var mod_3 = document.createElement('div');
				var mod_4 = document.createElement('div');
				var mod_ul = document.createElement('ul');
				mod_1.className = 'ui-menu ui-menu-with-icon';
				mod_1.style.display = 'none';
				if(params.combox.name) {
					$(mod_1).attr('id','select-'+params.combox.name);
					$(mod_1).addClass('select-'+params.combox.name);
				}
				mod_2.className = 'ui-menu-list-box';
				mod_2.style.height = '100%';
				mod_2.style.width = '100%';
				mod_3.className = 'scroll-content-outer scroll-content-with-hd ps-container';
				mod_ul.className = 'scroll-list';
				if(items == null || items == '') {
					var mod_li = document.createElement('li');
					mod_li.className = 'ui-menu-item';
					$(mod_li).attr('data-index','');
					$(mod_li).append('<i class="icon pre-icon cur-timeline-icon"></i>');
					$(mod_li).append('<span class="text" title=""></span>');
					$(mod_li).append('<i class="icon bg-icon"></i>');
					$(mod_li).css('display','none');
					$(mod_ul).append(mod_li);
				}else {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						var mod_li = document.createElement('li');
						mod_li.className = 'ui-menu-item';
						if(item.key) {
							$(mod_li).attr('data-index',item.key);
						}
						if(params.combox.preicon) {
							if(i == 0) {
								$(mod_li).append('<i class="icon pre-icon cur-timeline-icon"></i>');
							}else {
								$(mod_li).append('<i class="icon pre-icon"></i>');
							}
						}
						$(mod_li).append('<span class="text" title="'+item.value+'">'+item.value+'</span>');
						if(params.combox.bgicon) {
							$(mod_li).append('<i class="icon bg-icon"></i>');
						}
						if(params.combox.preicon) {
							$('.text', mod_li).css('margin-left','20px');
						}
						$(mod_ul).append(mod_li);
					}
				}
				$(mod_4).append(mod_ul);
				$(mod_3).append(mod_4);
				$(mod_3).append('<div class="ps-scrollbar-x" style="left: 0px; bottom: 3px; width: 0px;"></div>');
				$(mod_3).append('<div class="ps-scrollbar-y" style="right: 3px; height: 0px;"></div>');
				//多选
				if(items && items.length > 0 && multiple) {
					var title = '';
					if(params.combox.multipleTitle) {
						title = params.combox.multipleTitle;
					}
					$(mod_3).append('<div class="multiple-select" style="color: #fff;margin-top:5px;"><div style="background-color: #3a8cf2;cursor: pointer;text-align: center;margin: 0px auto;">'+ title +'</div></div>');
				}
				$(mod_2).append(mod_3);
				$(mod_1).append(mod_2);
			//	$(mod_1).append('<div class="ui-com-arrow ui-com-arrow-top"></div>');
				
			//	$(t).css('position','relative');
				$(mod_1).css('position','absolute');
			//	$(combobox).css('position','relative');
				$('body').append(mod_1);
				//获取元素的纵坐标 
				var getTop = function (e){ 
			//		var offset = e.offsetTop - e.scrollTop; 
			//		if(e.offsetParent != null) {
			//			offset += getTop(e.offsetParent); 
			//		}
					var offset = 0;
					var obj = e;
					while(obj != null && obj != document.body) {
						offset += obj.offsetTop;
						obj = obj.offsetParent;
					}
					while(e != null && e != document.body) {
						offset -= e.scrollTop;
						e = e.parentElement;
					}
					return offset;
				}; 
				//获取元素的横坐标 
				var getLeft = function(e){ 
				//	var offset = e.offsetLeft - e.scrollLeft;
				//	if(e.offsetParent != null) {
				//		offset += getLeft(e.offsetParent); 
				//	}
					var offset = 0;
					var obj = e;
					while(obj != null &&  obj != document.body) {
						offset += obj.offsetLeft;
						obj = obj.offsetParent;
					}
					while(e != null && e != document.body) {
						offset -= e.scrollLeft;
						e = e.parentElement;
					}
					return offset;
				};
				if(items.length > 6) {
					var hgt = 0;
					$('.ui-menu-item',mod_ul).each(function(i){
						if(i == 0) {
							hgt = $(this).height() * 6;
						}
					});
					$(mod_ul,mod_1).css('height',hgt+'px');
				}
				var isOut = true;
				$('.y-btn .label',combobox).on('input propertychange click',function(e){
					if(this.disabled) {
						return;
					}
					$(mod_1).css('top',getTop($(combobox).get(0)) + $(combobox).height() + 'px');
					$(mod_1).css('left',getLeft($(combobox).get(0)) + 'px');
					if($(mod_1).width() < $('.item',combobox).width()) {
						$(mod_1).css('width',$('.item',combobox).width()+'px');
						if(multiple) {
							$('.multiple-select',mod_3).css('width',$('.item',combobox).width()+'px');
							$('.multiple-select div',mod_3).css('width',$('.item',combobox).width()/2+'px');
						}
					}
				//	$(mod_3).css('width',$('.item',combobox).width()*2+'px');
					$('.ui-com-arrow',mod_1).css('left',$('.item',combobox).width()/2+'px');
					if(e.type == 'click') {
						isOut = false;
						$(mod_1).show();
					}
					$(mod_1).parent().find('.ui-menu').each(function(){
						if(mod_1 != $(this).get(0)) {
							$(this).hide();
						}
					});
					//多选
					if(!multiple) {
						var value = '';
						if(params.button) {
							value = $.trim($(this).html());
						}else {
							value = $.trim($(this).val());
						}
						var flag = true;
						$('.ui-menu-item',mod_1).each(function(){
							$(this).attr('data-id',$(combobox).parent().parent().parent().attr('id'));
							if(flag) {
								var mval = $.trim($('.text',this).html());
								if(params.button) {
									if(mval == value) {
										$(mod_ul).scrollTop(getTop(this)-getTop($(mod_ul).get(0)));
										flag = false;
										$(this).addClass('current');
									}else {
										$(this).removeClass('current');
									}
								}else {
									if(mval.indexOfNotCase(value) >= 0) {
										$(mod_ul).scrollTop(getTop(this)-getTop($(mod_ul).get(0)));
										flag = false;
										$(this).addClass('current');
									}else {
										$(this).removeClass('current');
									}
								}
							}else {
								$(this).removeClass('current');
							}
						});
					}
				}).on('mouseover',function(){
					isOut = false;
				}).on('mouseout',function(){
					isOut = true;
				});
				$(mod_1).on('mouseout',function(){
					isOut = true;
				}).on('mouseover',function(){
					isOut = false; 
				});
				$('.bg-icon',combobox).on('click',function(){
					if($('.y-btn .label',combobox).get(0).disabled) {
						return;
					}
					if($(mod_1).css('display') == 'none') {
						$(mod_1).css('top',getTop($(combobox).get(0)) + $(combobox).height() + 'px');
						$(mod_1).css('left',getLeft($(combobox).get(0)) + 'px');
						if($(mod_1).width() < $('.item',combobox).width()) {
							$(mod_1).css('width',$('.item',combobox).width()+'px');
							if(multiple) {
								$('.multiple-select',mod_3).css('width',$('.item',combobox).width()+'px');
								$('.multiple-select div',mod_3).css('width',$('.item',combobox).width()/2+'px');
							}
						}
					//	$(mod_3).css('width',$('.item',combobox).width()*2+'px');
						$('.ui-com-arrow',mod_1).css('left',$('.item',combobox).width()/2+'px');
						$(mod_1).show();
						isOut = false;
						$(mod_1).parent().find('.ui-menu').each(function(){
							if(mod_1 != $(this).get(0)) {
								$(this).hide();
							}
						});
						
						//多选
						if(!multiple) {
							var value = '';
							if(params.button) {
								value = $.trim($(this).parent().find('.label').html());
							}else {
								value = $.trim($(this).parent().find('.label').val());
							}
							var flag = true;
							$('.ui-menu-item',mod_1).each(function(){
								$(this).attr('data-id',$(combobox).parent().parent().parent().attr('id'));
								if(flag) {
									var mval = $.trim($('.text',this).html());
									if(params.button) {
										if(mval == value) {
											$(mod_ul).scrollTop(getTop(this)-getTop($(mod_ul).get(0)));
											flag = false;
											$(this).addClass('current');
										}else {
											$(this).removeClass('current');
										}
									}else {
										if(mval.indexOfNotCase(value) >= 0) {
											$(mod_ul).scrollTop(getTop(this)-getTop($(mod_ul).get(0)));
											flag = false;
											$(this).addClass('current');
										}else {
											$(this).removeClass('current');
										}
									}
								}else {
									$(this).removeClass('current');
								}
							});
						}else {
							getMultipleValue();
						}
					}else {
						checkComboxParam();
					}
				}).on('mouseover',function(){
					isOut = false;
				}).on('mouseout',function(){
					isOut = true;
				});
				
				if(multiple) {
					$('.ui-menu-item',mod_1).on('click',function(){
						$('.icon', this).toggleClass('checked');
						$(this).toggleClass('current');
//						if($('.icon', this).hasClass('checked')) {
//							$(this).addClass("current").siblings().removeClass("current");
//						}
					});
					$('.multiple-select div',mod_3).on('click',function(){
						getMultipleValue();
						$(mod_1).hide();
						isOut = true;
					});
				}else {
					$('.ui-menu-item',mod_1).on('click',function(){
						var key = $(this).attr('data-index');
						var value = $.trim($('.text',this).html());
						if(params.button) {
						//	$('.y-btn .label',combobox).css('width',$('.y-btn .label',combobox).width());
							$('.y-btn .label',combobox).html(value);
							$('.y-btn .label',combobox).attr('title',value);
							$('.y-btn .hidden-search-input',combobox).val(key);
						}else if(params.input) {
							$('.y-btn .label',combobox).val(value);
							$('.y-btn .hidden-search-input',combobox).val(key);
						}
						$(mod_1).hide(); 
						var obj = this;
						$(this).addClass('current');
						$('.ui-menu-item',mod_1).each(function(){
							if(this != obj) {
								$(this).removeClass('current');
							}
						});
						$(combobox).next('span').text('*');
						isOut = true;
					});
				}
				if(params.input) {
					$('.y-btn .label',combobox).on('keydown',function(e){
						if(e.keyCode == 13) {
							if($(mod_1).css('display') == 'none') {
								$(mod_1).css('top',getTop($(combobox).get(0)) + $(combobox).height() + 'px');
								$(mod_1).css('left',getLeft($(combobox).get(0)) + 'px');
								if($(mod_1).width() < $('.item',combobox).width()) {
									$(mod_1).css('width',$('.item',combobox).width()+'px');
									if(multiple) {
										$('.multiple-select',mod_3).css('width',$('.item',combobox).width()+'px');
										$('.multiple-select div',mod_3).css('width',$('.item',combobox).width()/2+'px');
									}
								}
								$('.ui-com-arrow',mod_1).css('left',$('.item',combobox).width()/2+'px');
								$(mod_1).show();
								isOut = false;
								//多选
								if(!multiple) {
									var value = $.trim($(this).val());
									var flag = true;
									$('.ui-menu-item',mod_1).each(function(){
										$(this).attr('data-id',$(combobox).parent().parent().parent().attr('id'));
										if(flag) {
											var mval = $.trim($('.text',this).html());
											if(mval.indexOfNotCase(value) >= 0) {
												$(mod_ul).scrollTop(getTop(this)-getTop($(mod_ul).get(0)));
												flag = false;
												$(this).addClass('current');
											}else {
												$(this).removeClass('current');
											}
										}else {
											$(this).removeClass('current');
										}
									});
									if(value == '') {
										$(this).parent().find('.hidden-search-input').val('');
										isOut = true;
									}
								}else {
									getMultipleValue();
									isOut = true;
								}
							}else {
								checkComboxParam();
							}
						}
					});
				}
				$('body').on('click',function(){
					if(isOut && $(mod_1).css('display') != 'none'){
						checkComboxParam();
					}
				});
				var getMultipleValue = function() {
					var ids = [];
					var names = [];
					$('.ui-menu-item',mod_1).each(function(){
						if($('.icon',this).hasClass('checked')) {
							ids.push($(this).attr('data-index'));
							names.push($('.text',this).text());
						}
					});
					if(params.button) {
						$('.y-btn .label',combobox).html(names.toString());
						$('.y-btn .label',combobox).attr('title',names.toString());
						$('.y-btn .hidden-search-input',combobox).val(ids.toString());
					}else if(params.input) {
						$('.y-btn .label',combobox).val(names.toString());
						$('.y-btn .hidden-search-input',combobox).val(ids.toString());
					}
				}
				var checkComboxParam = function() {
					if($('.y-btn .label',combobox).get(0).disabled) {
						$(mod_1).hide();
						return;
					}
					//多选
					if(!multiple) {
						var cval = '';
						if(params.button) {
							cval = $.trim($('.y-btn .label',combobox).html());
						}else {
							cval = $.trim($('.y-btn .label',combobox).val());
						}
						var flag = false;
						$('.ui-menu-item',mod_1).each(function(){
							$(this).attr('data-id',$(combobox).parent().parent().parent().attr('id'));
							var mval = $.trim($('.text',this).html());
							if(mval == cval) {
								var key = $(this).attr('data-index');
								var value = $.trim($('.text',this).html());
								if(params.button) {
									$('.y-btn .label',combobox).html(value);
									$('.y-btn .label',combobox).attr('title',value);
									$('.y-btn .hidden-search-input',combobox).val(key);
								}else if(params.input) {
									$('.y-btn .label',combobox).val(value);
									$('.y-btn .hidden-search-input',combobox).val(key);
								}
								flag = true;
							}
						});
						if(!flag){
							$('.y-btn .hidden-search-input',combobox).val('');
							if(params.input) {
								if(cval != '') {
									$(combobox).next('span').text(parent.lang.errValueNotExists);
								//	alert('列表中没有输入框中的值，请重新选择');
								}
								$(mod_1).hide();
								isOut = true;
							}else {
								$(mod_1).hide();
								isOut = false;
							}
						}else {
							$(combobox).next('span').text('*');
							$(mod_1).hide();
							isOut = false;
						}
					}else {
						getMultipleValue();
						$(mod_1).hide();
						isOut = true;
					}
				}
				return combobox;
			},strToArray : function (params, condition1, condition2) {
				if(params == null || params == '' || condition1 == null) {
					return [];
				}
				var mod = [];
				var strs = params.split(condition1);
				var strs_length = strs.length;
				for (var i = 0; i < strs_length; i++) {
					if(strs[i] != null ){
						if(condition2 != null && strs[i].indexOf(condition2) > -1) {
							var sts = strs[i].split(condition2);
							if(sts && sts.length > 1) {
								mod.push({
									key: sts[0],
									value: sts[1]
								});
							}
						}else {
							mod.push({
								value: strs[i]
							});
						}
					}
				}
				return mod;
			},
			addInputModel : function(params) {
				var input = document.createElement('div');
				input.className = 'btn-group';
				var item = document.createElement('div');
				item.className = 'item';
				var btn = document.createElement('div');
				btn.className = 'y-btn';
				if(params.bgcolor) {
					$(btn).addClass('y-btn-'+params.bgcolor);
				}
				if(params.pclass) {
					$(btn).addClass(params.pclass);
				}
				if ($(params).attr('hide')) {
					$(btn).removeClass('show');
				}else {
					$(btn).addClass('show');
				}
				var content = '';
				if(params.preicon) {
					content += '<i class="icon pre-icon"></i>';
				}
				var readonly = '';
				if (params.readonly) {
					readonly = 'readonly';
				}
				var disabled = '';
				if (params.disabled) {
					disabled = 'disabled';
				}
				if(params.display) {
					content += '<input class="label search-input" autocomplete="off" data-placeholder="'+params.display+'" placeholder="'+params.display+'" value="" '+readonly+' '+ disabled +'/>';
				}else {
					content += '<input class="label search-input" autocomplete="off" '+readonly+' '+ disabled +'/>';
				}
				if(params.hidden) {
					content += '<input class="hidden-search-input" type="hidden"/>';
				}
				if (params.bgicon) {
					content += '<i class="icon bg-icon"></i>';
				}
				$(btn).append(content);
				if($('.search-input',btn).attr('data-placeholder') != null && $('.search-input',btn).attr('data-placeholder') != '') {
					$('.search-input',btn).placeholder();
				}
				//if(params.width) {
				//	$('.search-input',btn).css('width',params.width);
				//}
				if(params.value) {
					$('.search-input',btn).val(params.value);
				}
				if(params.name) {
					$(btn).attr('data-cn', params.name);
					$('.label',btn).attr('id','combox-'+params.name);
					$('.label',btn).addClass(params.name);
					if(params.hidden) {
						$('.label',btn).attr('name',params.name+'Value');
						$('.hidden-search-input',btn).attr('name',params.name);
						$('.label',btn).attr('data-name',params.name);
						$('.hidden-search-input',btn).attr('data-name',params.name);
						$('.hidden-search-input',btn).addClass('hidden-'+params.name);
						$('.hidden-search-input',btn).attr('id','hidden-'+params.name);
					}else {
						$('.label',btn).attr('name',params.name);
						$('.label',btn).attr('data-name',params.name);
					}
					if(params.preicon) {
						$('.pre-icon',btn).addClass('pre-icon-'+params.name);
					}
					if (params.bgicon) {
						$('.bg-icon',btn).addClass('bg-icon-'+params.name);
					}
				}
				$(item).append(btn);
				$(input).append(item);

				return input;
			},
			addButtonsModel : function(params) {//按钮
				var btn_group = document.createElement('div');
				btn_group.className = 'btn-group';
				for (var i = 0; i < params.length; i++) {
					var groups = params[i];
					var item = document.createElement('div');
					item.className = 'item';
					for (var j = 0; j < groups.length; j++){
						var items = groups[j];
						var btn = document.createElement('span');
						btn.className = 'y-btn';
						if(items.bgcolor) {
							$(btn).addClass('y-btn-'+items.bgcolor);
						}
						if(items.pclass) {
							$(btn).addClass(items.pclass);
						}
						if ($(items).attr('hide')) {
							$(btn).removeClass('show');
						}else {
							$(btn).addClass('show');
						}
						var content = '';
						if(items.preicon) {
							content += '<i class="icon pre-icon"></i>';
						}
						if(items.display) {
							content += '<span class="label" title="'+items.display+'">'+ items.display +'</span>';
						}else {
							content += '<span class="label"></span>';
						}
						if(items.hidden) {
							content += '<input class="hidden-search-input" type="hidden"/>';
						}
						if (items.bgicon) {
							content += '<i class="icon bg-icon"></i>';
						}
						$(btn).append(content);
						if(items.name) {
							$(btn).attr('data-cn', items.name);
							$('.label',btn).attr('id','label-'+items.name);
							$('.label',btn).addClass(items.name);
							if(items.hidden) {
								$('.hidden-search-input',btn).attr('name',items.name);
								$('.hidden-search-input',btn).addClass('hidden-'+items.name);
								$('.hidden-search-input',btn).attr('id','hidden-'+items.name);
							}
							if(items.preicon) {
								$('.pre-icon',btn).addClass('pre-icon-'+items.name);
							}
							if (items.bgicon) {
								$('.bg-icon',btn).addClass('bg-icon-'+items.name);
							}
						}
						$(item).append(btn);
					}
					$(btn_group).append(item);
				}
				return btn_group;
			},
			addTabsModel : function(params) {//导航栏
				var ul = document.createElement('ul');
				for (var i = 0; i < params.length; i++) {
					var cm = params[i];
					var li = document.createElement('li');
					var a = document.createElement('a');
					if(cm.title) {
						a.title = cm.title;
					}
					if(cm.url) {
						a.href = cm.url;
					}
					var content = '';
					if(cm.preicon) {
						content += '<i class="icon"></i>';
					}
					if(cm.display) {
						content += '<span class="text">'+ cm.display +'</span>';
					}else {
						content += '<span class="text"></span>';
					}
					if (cm.bgicon) {
						content += '<i class="bg"></i>';
					}
					$(a).append(content);
					$(li).append(a);
					if (cm.name) {
						$(li).attr('data-tab',cm.name);
						$(li).attr('id','tab-'+cm.name);
						$(li).addClass(cm.name);
						if(cm.preicon) {
							$('.icon',li).addClass('icon-'+cm.name);
						}
					}
					if (cm.pclass) {
						$(li).addClass(cm.pclass);
					}
					$(ul).append(li);
				}
				return ul;
			},
			addTabsGroupModel : function(params) {//二级导航
				var group_div = document.createElement('div');
				group_div.className = 'group-div';
				for (var i = 0; i < params.length; i++) {
					var title = params[i].title;
					var tabs = params[i].tabs;
					if(!$(title).attr('hide')) {
						var group_p = document.createElement('p');
						group_p.className = 'group-p';
						if(title.display) {
							$(group_p).append(title.display);
						}
						if (title.name) {
							$(group_p).attr('data-tab',title.name);
							$(group_p).attr('id','tab-'+title.name);
							$(group_p).addClass(title.name);
						}
						if (title.pclass) {
							$(group_p).addClass(title.pclass);
						}
						var gDiv = document.createElement('div');
						gDiv.className = 'gdiv';
						if($(title).attr('hide')) {
							$(group_p).hide();
							$(gDiv).hide();
						}
						var ul = document.createElement('ul');
						for(var j = 0; j < tabs.length; j++) {
							var cm = tabs[j];
							var li = document.createElement('li');
					//		if(j == 0) {
					//			$(li).addClass('current-tab');
					//		}
							var content = '';
							if(cm.display) {
								content = '<a title="'+cm.display+'">';
							}else {
								content = '<a>';
							} 
							if(cm.preicon) {
								content += '<i class="icon icon-tab"></i>';
							}
							if(cm.display) {
								content += '<span class="text">'+ cm.display +'</span>';
							}else {
								content += '<span class="text"></span>';
							}
							if (cm.bgicon) {
								content += '<span class="bg bg-tab"></span>';
							}
							content += '</a>';
							$(li).append(content);
							if (cm.name) {
								$(li).attr('data-tab',cm.name);
								$(li).attr('id','tab-'+cm.name);
								$(li).addClass(cm.name);
								if(title.preicon) {
									$('.icon-tab',li).addClass('icon-'+cm.name);
								}
								$(li).css('height','22px');
								$(li).css('line-height','22px');
								$(li).css('border-bottom','1px solid #55b3e6');
								$(li).css('border-top','1px solid transparent');
							}
							if (cm.pclass) {
								$(li).addClass(cm.pclass);
							}
							$(ul).append(li);
						}
						$(gDiv).append(ul);
						$(gDiv).css('height','0px');
						$(gDiv).css('overflow', 'hidden');
						$(ul).css('height',240+'px');
						if(tabs.length > 10) {
							$(gDiv).attr('maxHeight',240);
						}else {
							$(gDiv).attr('maxHeight',24*tabs.length);
						}
						
						$(group_div).append(group_p);
						$(group_div).append(gDiv);
						var _timer = null;
						var currObj = null;
						$(group_p).on('click',function(){
							clearTimeout(_timer);
							var obj = this;
							var time = 1;
							currObj = null;
							_timer = null;
							$('.group-div .group-p').each(function() {
								if(this == obj) {
									currObj = this;
									$(this).addClass('show-title');
								//	$(this).next('.gdiv').toggleClass('show-gdiv');
									if($(this).next('.gdiv').height() > 0) {
										move(this,false,time);
									}else {
										move(this,true,time);
									}
								//	if($(this).next('.gdiv').css('display') == 'none') {
								}else {
									$(this).removeClass('show-title');
								//	$(this).next('.gdiv').removeClass('show-gdiv');
									if($(this).next('.gdiv').height() > 0) {
										move(this,false,time);
									}
								}
							});	
							$('.group-div .group-p').each(function() {
								if(currObj != null){
									if(currObj != null && this == currObj) {
										$(this).addClass('show-title');
										if($(this).next('.gdiv').height() > 0) {
											move(this,false,time);
										}else {
											move(this,true,time);
										}
									}else {
										$(this).removeClass('show-title');
										if($(this).next('.gdiv').height() > 0) {
											move(this,false,time);
										}
									}
								}
							});
						});
						
						var move = function(obj,isflag,time) {
						//	clearTimeout(_timer);
							var bFinish = true;
							var height = $(obj).next('.gdiv').height();
							var _height = 2;
							if(!isflag) {
								_height = - _height;
							}
							var minHieght = height+_height <= 0 ? 0 : height+_height;
							$(obj).next('.gdiv').css('height',minHieght+'px');
							if(isflag) {
								if(minHieght >= $(obj).next('.gdiv').attr('maxHeight')) {
									bFinish = false;
								}
							}else {
								if(minHieght <= 0) {
									bFinish = false;
								}
							}
							if(bFinish && currObj != null) {
								_timer = setTimeout(function(){ move(obj,isflag); }, time);
							}
						}
					}
				}
				return group_div;
			},
			addTableGroupModel : function(params) {
				var group_ul = document.createElement('ul');
				group_ul.className = 'slide-panel'; 
				for(var i = 0; i < params.length; i++) {
					var title = params[i].title;
					var colgroup = params[i].colgroup;
					var tabs = params[i].tabs;
					var group_li = document.createElement('li');
					if(title.pid) {
						$(group_li).attr('id',title.pid);
					}
					var adiv = document.createElement('div');
					adiv.className = 'panel-head';
					var cont = '';
					if(title.pclass) {
						$(adiv).addClass(title.pclass);
					}
					if($(title).attr('hide')) {
						$(group_li).hide();
					}
					if($(title).attr('tabshide')) {
						cont += '<span class="head-control"></span>';
					}else {
						cont += '<span class="head-control current"></span>';
					}
					if(title.display) {
						cont += '<H3 class="h3">'+title.display+'</H3>';
					}else {
						cont += '<H3 class="h3"></H3>';
					}
					$(adiv).append(cont);
					
					$(group_li).append(adiv);
					var pdiv = document.createElement('div');
					pdiv.className = 'panel-body';
					if(!$(title).attr('tabshide')) {
						$(pdiv).addClass('show');
					}
					if($(title).attr('headhide')) {
						$(adiv).addClass('hide');
					}
					var table = document.createElement('table');
					table.className = 'integ_tab';
					var col_cont = '<colgroup>';
					var cols = [];
					if(colgroup.width) {
						cols = colgroup.width;
					}
					var trs = document.createElement('tr');
					$(trs).css('height','0');
					for(var j = 0; j < cols.length; j++) {
						col_cont += '<col width="'+cols[j]+'">';
						switch(j%2) {
							case 0:
								th = document.createElement('th');
								$(th).css('padding','0');
								$(th).css('width',cols[j]);
								$(trs).append(th);
								break;
							case 1:
								td = document.createElement('td');
								$(td).css('padding','0');
								$(td).css('width',cols[j]);
								$(trs).append(td);
								break;
						}
					}
					col_cont += '</colgroup>';
					$(table).append(col_cont);
					var tbody = document.createElement('tbody');
					tbody.className = 'integ_tbody';
					$(tbody).append(trs);
					var cm = tabs;
					var display = null;
					if(cm.display) {
						display = cm.display;
					}
					var names = null;
					if(cm.name) {
						names = cm.name;
					}
					var tys = null;
					if(cm.type) {
						tys = cm.type;
					}
					var lengths = null;
					if(cm.length) {
						lengths = cm.length;
					}
					var tips = null;
					if(cm.tips) {
						tips = cm.tips;
					}
					var maxCount = 0;
					if(cm.name) {
						maxCount = cm.name.length;
					}
					var min = cols.length/2;
					var page = maxCount%min==0?maxCount/min:Math.floor(maxCount/min+1);
					for(var j = 0;j < page; j++) {
						var tr = document.createElement('tr');
						for(var k = min * j; k < (j+1)*min && k < maxCount; k++) {
							var th = document.createElement('th');
							var td = document.createElement('td');
							var span = document.createElement('span');
							span.className = 'span-tip red';
							var pl = null;
							$(span).text(title.tip);
							if(tys && tys.length > k && tys[k]!=null && tys[k]!=''){
								if(tys[k] == 'password') {
									pl = document.createElement('input');
									$(pl).attr('type','password');
								}else {
									pl = document.createElement(tys[k]);
								}
								pl.className = 'form-input';
								if(names && names.length > k && names[k]!=null && names[k]!='') {
									$(pl).attr('name',names[k]);
									$(pl).attr('data-name',names[k]);
									$(pl).attr('id',tys[k]+'-'+names[k]);
									$(pl).addClass(tys[k]+'-'+names[k]);
									$(span).addClass(names[k]+'Tip');
								}
								if(names && names.length > k+1 && names[k+1]!=null && names[k+1]=='') {
								//	$(td).attr('colspan',3);
								//	$(pl).css('width','40%');
								}
								if((tys[k]=='input' || tys[k] == 'textArea') && lengths && lengths.length>k && lengths[k]!=null && lengths[k]!='') {
									$(pl).attr('maxLength',lengths[k]);
								}
								if(tys[k] == 'textArea') {
									$(pl).attr('cols',30);
									$(pl).attr('rows',3);
								}
							}
							if(names && names.length > k+1 && names[k+1]!=null && names[k+1]=='') {
								$(td).attr('colspan',3);
							}
							if(names && names.length > k && names[k]!=null && names[k]!='') {
							//	$(th).addClass('th-'+names[k]);
								$(td).addClass('td-'+names[k]);
							}
							if(display && display.length > k && display[k]!=null &&  display[k]!='') {
								$(th).append(display[k]);
								$(tr).append(th);
								if(pl != null) {
									$(td).append(pl);
								}
								if(title.tip) {
									$(td).append(span);
								}else {
									if(tips && tips.length > k && tips[k]!=null &&  tips[k]!='') {
										$(span).text(tips[k]);
										$(td).append(span);
									}
								}
								$(tr).append(td);
							}
						}
						$(tbody).append(tr);
					}
					$(table).append(tbody);
					$(pdiv).append(table);
					$(group_li).append(pdiv);
					$(group_ul).append(group_li);
					$(adiv).on('click',function(){
						$(this).find('.head-control').toggleClass('current');
						$(this).next('.panel-body').toggleClass('show');
					});
				}
				return group_ul; 
			},
			addCheckBoxGroupModel : function(params) {
				var group_ul = document.createElement('ul');
				group_ul.className = 'slide-panel'; 
				for(var i = 0; i < params.length; i++) {
					var title = params[i].title;
					var colgroup = params[i].colgroup;
					var tabs = params[i].tabs;
					if(!$(title).attr('hide')) {
						var group_li = document.createElement('li');
						if(title.pid) {
							$(group_li).attr('id',title.pid);
						}
						var adiv = document.createElement('div');
						adiv.className = 'panel-head';
						var cont = '';
						if(title.pclass) {
							$(adiv).addClass(title.pclass);
						}
						if($(title).attr('hide')) {
							$(group_li).hide();
						}
						if($(title).attr('tabshide')) {
							cont += '<span class="head-control"></span>';
						}else {
							cont += '<span class="head-control current"></span>';
						}
						if(title.display) {
							cont += '<H3 class="h3">'+title.display+'</H3>';
						}else {
							cont += '<H3 class="h3"></H3>';
						}
						$(adiv).append(cont);
						$(group_li).append(adiv);
						var pdiv = document.createElement('div');
						pdiv.className = 'panel-body';
						if(!$(title).attr('tabshide')) {
							$(pdiv).addClass('show');
						}
						var table = document.createElement('table');
						table.className = 'integ_tab';
						var col_cont = '<colgroup>';
						var cols = [];
						if(colgroup.width) {
							cols = colgroup.width;
						}
						var trs = document.createElement('tr');
						$(trs).css('height','0');
						for(var j = 0; j < cols.length; j++) {
							col_cont += '<col width="'+cols[j]+'">';
							td = document.createElement('td');
							$(td).css('padding','0');
							$(td).css('width',cols[j]);
							$(trs).append(td);
						}
						col_cont += '</colgroup>';
						$(table).append(col_cont);
						var tbody = document.createElement('tbody');
						//$(tbody).append(trs);
						var cm = tabs;
						var display = null;
						if(cm.display) {
							display = cm.display;
						}
						var names = null;
						var maxCount = 0;
						if(cm.name) {
							names = cm.name;
							maxCount = names.length;
						}
						var page = maxCount%cols.length==0?maxCount/cols.length:Math.floor(maxCount/cols.length+1);
						for(var j = 0;j < page; j++) {
							var tr = document.createElement('tr');
							for(var k = cols.length * j ; k < (j+1)*cols.length && k < maxCount; k++) {
								var lab = document.createElement('label');
								var pl = document.createElement('input');
								$(pl).css('float','left');
								$(pl).attr('type','checkbox');
								if(names && names.length > k && names[k]!=null && names[k]!='') {
									$(pl).attr('name',names[k]);
									$(pl).attr('value',names[k]);
									var values = names[k].split('_');
									if(values.length > 1) {
										$(pl).attr('value',values[1]);
									}
									$(pl).attr('id','checkbox-'+names[k]);
									$(pl).addClass('checkbox-'+names[k]);
									$(lab).attr('for','checkbox-'+names[k]);
								}
								if(display && display.length > k && display[k]!=null) {
									$(lab).text(display[k]);
								}
								var td = document.createElement('td');
								if(names && names.length > k && names[k]!=null && names[k]!='') {
									$(td).addClass('td-'+names[k]);
								}
								if(display && display.length > k && display[k]!=null) {
									if(pl != null) {
										$(td).append(pl);
										$(td).append(lab);							
									}
									$(tr).append(td);
								}
							}
							$(tbody).append(tr);
						}
						$(table).append(tbody);
						$(pdiv).append(table);
						$(group_li).append(pdiv);
						$(group_ul).append(group_li);
						$('.head-control',adiv).on('click',function(){
							$(this).toggleClass('current');
							$(this).parent().next('.panel-body').toggleClass('show');
						});
					}
				}
				return group_ul;
			},
			addTabsGroupModelTre : function(params) {//二级导航
				var group_div = document.createElement('div');
				var ul = document.createElement('ul');
				group_div.className = 'menu';
				for (var i = 0; i < params.length; i++) {
					var title = params[i].title;
					var tabs = params[i].tabs;
					if(!$(title).attr('hide')) {
						var li = document.createElement('li');
						if (title.name) {
							$(li).attr('data-tab',title.name);
							$(li).attr('id','tab-'+title.name);
							$(li).addClass(title.name);
						}
						if (title.pclass) {
							$(li).addClass(title.pclass);
						}
						var part = document.createElement('div');
						part.className = 'part';
						var part_menu = document.createElement('div');
						part_menu.className = 'part-menu';
						if (title.pclass) {
							$(part_menu).addClass(title.pclass);
						}
						if(title.display) {
							$(part_menu).append('<i></i><span>'+title.display+'</span>');
						}else {
							$(part_menu).append('<i></i><span></span>');
						}
						$(part).append(part_menu);
						var gDiv = document.createElement('div');
						gDiv.className = 'gdiv';
						for(var j = 0; j < tabs.length; j++) {
							var cm = tabs[j];
							var p = document.createElement('p');
							var content = '';
							if(cm.display) {
								content = '<a title="'+cm.display+'">';
							}else {
								content = '<a>';
							} 
							if(cm.preicon) {
								content += '<i class="icon icon-tab"></i>';
							}
							if(cm.display) {
								content += '<span class="text">'+ cm.display +'</span>';
							}else {
								content += '<span class="text"></span>';
							}
							if (cm.bgicon) {
								content += '<i class="bg bg-tab"></i>';
							}
							content += '</a>';
							$(p).append(content);
							if (cm.name) {
								$(p).attr('data-tab',cm.name);
								$(p).attr('id','tab-'+cm.name);
								$(p).addClass(cm.name);
								if(title.preicon) {
									$('.icon-tab',p).addClass('icon-'+cm.name);
								}
							}
							if (cm.rtype) {
								$(p).attr('data-rtype',cm.rtype);
							}
							if (cm.pclass) {
								$(p).addClass(cm.pclass);
							}
							$(gDiv).append(p);
						}
						$(part).append(gDiv);
						$(li).append(part);
						$(ul).append(li);
					}
				}
				$(group_div).append(ul);
				return group_div;
			},//页面遮盖
			addLockMask : function() {
				var isBody = (t == $('body').get(0));
				var width = $(t).width();
				var	height = $(t).height();
				if(width == 0) {
					width = $(window).width();
				}
				if(height == 0) {
					height = $(window).height();
				}
				var top = getTop(t);
				var left = getLeft(t);
				
				if(height < 42) {
					top += (height - 42) / 2;
				}else {
					top += (height - 42) * 0.3;
				}
				left += (width - 106) / 2;
				var content = '<div class="lockmask">';
				if(isBody) {
					content += '<div class="lockmask-top" style="width: 100%; height: 100%;"></div>';
					if(width == 0) {
						content += '<div class="lockmask-content" style="left: 40%; top: 30%">';
					}else {
						content += '<div class="lockmask-content" style="left: '+left+'px; top: '+top+'px;">';
					}
				}else {
					content += '<div class="lockmask-top" style="width: '+width+'px; height: '+height+'px;"></div>';
					content += '<div class="lockmask-content" style="left: '+left+'px; top: '+top+'px;">';
				}
				content += '<div class="lockmask-loading"></div>';
				content += '</div>';
				content += '</div>';
				return content;
			}
		};
		
		g = p.getPanelClass(g); //get the grid class
		
		if (p.TabsModel) { //create model if any
			$(t).prepend(g.addTabsModel(p.TabsModel));
		} // end if p.PanelModel
		
		if (p.TabsGroupModel) { //create model if any
			$(t).prepend(g.addTabsGroupModel(p.TabsGroupModel));
		} 

		if(p.ButtonsModel) {
			$(t).prepend(g.addButtonsModel(p.ButtonsModel));
		}
		
		if(p.ComBoboxModel) {
			$(t).prepend(g.addComBoboxModel(p.ComBoboxModel));
		}

		if(p.SerachBarModel) {
			$(t).prepend(g.addSerachBarModel(p.SerachBarModel));
		}

		if(p.TableGroupModel) {
			$(t).prepend(g.addTableGroupModel(p.TableGroupModel));
		}
		
		if(p.CheckBoxGroupModel) {
			$(t).prepend(g.addCheckBoxGroupModel(p.CheckBoxGroupModel));	
		}
		
		if(p.InputModel) {
			$(t).prepend(g.addInputModel(p.InputModel));
		}
		if(p.TabsGroupModelTre) {
			$(t).prepend(g.addTabsGroupModelTre(p.TabsGroupModelTre));
		}
		//页面遮盖
		if(p.LockMask) {
			if(!($('.lockmask', t) && $('.lockmask', t).get(0))) {
				$(t).prepend(g.addLockMask());
			}
		}
		//init divs
		/**
		g.gDiv = document.createElement('div');  
		g.gDiv.className = 'flexPanel';
 
		if (p.width!='auto') { 
		    if (p.width.toString().indexOf('%')>0) 
		         g.gDiv.style.width = p.width; 
			else 
				g.gDiv.style.width = p.width + (isNaN(p.width) ? '' : 'px'); 
		} 
		
		//add conditional classes
		if (browser.msie) {
			$(g.gDiv).addClass('ie');
		}
		if (p.novstripe) {
			$(g.gDiv).addClass('novstripe');
		}
		$(t).before(g.gDiv);
		$(g.gDiv).append(t);
		
		//browser adjustments
		if (browser.msie && browser.version < 7.0) {
			$('.hDiv,.bDiv,.mDiv,.pDiv,.vGrip,.tDiv, .sDiv', g.gDiv).css({
				width: '100%'
			});
			$(g.gDiv).addClass('ie6');
			if (p.width != 'auto') {
				$(g.gDiv).addClass('ie6fullwidthbug');
			}
		}
		**/
		t.p = p;
		t.g = g;
		return t;
	};

	var docloaded = false;
	$(document).ready(function () {
		docloaded = true;
	});
	$.fn.flexPanel = function (p) {
		return this.each(function (i) {
			if (!docloaded) {
				$(this).hide();
				var t = this;
				$(document).ready(function () {
					$.addFlexPanel(t, p);
				});
			} else {
				$.addFlexPanel(this, p);
			}
		});
	}; //end flexigrid

	$.fn.flexPanelOptions = function (p) { //function to update general options
		return this.each(function () {
			if (this.g) $.extend(this.p, p);
		});
	}; //end flexOptions
	$.fn.flexShowLoading = function (flag) { //flexAddLockMask  flexRemoveLockMask
		return this.each(function (i) {
			if(flag) {
				var p = {LockMask: true};
				if (!docloaded) {
					$(this).hide();
					var t = this;
					$(document).ready(function () {
						$.addFlexPanel(t, p);
					});
				} else {
					$.addFlexPanel(this, p);
				}
			}else {
				if($('.lockmask', this) && $('.lockmask', this)[0]) {
					$($('.lockmask', this)[0]).remove();
				}
			}
		});
	}; //end flexShowLoading
})(jQuery);

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

	var isInputSupported = 'placeholder' in document.createElement('input');
	var isTextareaSupported = 'placeholder' in document.createElement('textarea');
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (err) {}
	}

}(this, document, jQuery));