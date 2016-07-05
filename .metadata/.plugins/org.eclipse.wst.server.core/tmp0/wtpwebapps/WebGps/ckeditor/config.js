/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
//	config.language = 'zh-cn';
	config.uiColor='#317ebd';//颜色  
    config.width='550px';//宽度  
    config.height='250px';//高度  
//    config.toolbar = 'Full';
    config.font_names = 'Arial;Times New Roman;Verdana';
    config.toolbar = [
   		//加粗     斜体，     下划线      穿过线      下标字        上标字
		['Bold','Italic','Underline','Strike','Subscript','Superscript'],
		//数字列表          实体列表            减小缩进    增大缩进
		['NumberedList','BulletedList','-','Outdent','Indent'],
		//左对齐             居中对齐          右对齐          两端对齐
		['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
		//超链接 取消超链接 锚点
		['Link','Unlink','Anchor'],
		//图片    flash    表格       水平线            表情       特殊字符        分页符
		['Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'],
		'/',
		//样式       格式      字体    字体大小
		['Styles','Format','Font','FontSize'],
		//文本颜色     背景颜色
		['TextColor','BGColor'],
		//全屏           显示区块
		['Maximize', 'ShowBlocks','-']
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
//	config.removeButtons = 'Underline,Subscript,Superscript';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.filebrowserImageUploadUrl= "../SysAdAndNewsAction_fileUpload.action";
	config.removePlugins = 'elementspath';
};
