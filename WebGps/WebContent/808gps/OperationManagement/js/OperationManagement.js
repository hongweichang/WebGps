var operatePageManage = null; //页面管理
$(document).ready(function(){
	$('body').flexShowLoading(true);
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined" || !parent.isLoadVehiGroupList) {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
	//新建页面管理
	operatePageManage = new pageManagement($('#mainPanel-yunying',parent.document).find('#rightPanel').get(0));
	
	$.myajax.jsonGet('StandardLoginAction_getOperationPage.action', function(json,action,success){
		if(success) {
			var mod = [];
			$.each(json.pages,function(i, page){
				var pclass = "clearfix";
				var title_ = getPageDisplay(page.privi);
				if(i == 0) {
					pclass = "current clearfix";
					//新增页面
					operatePageManage.addPage(page.name, title_, 'OperationManagement/'+page.name+'.html');
//					$('#mainPanel-yunying',parent.document).find('#rightPanel iframe').attr('src','OperationManagement/'+page.name+'.html');
				}
				mod.push({
					display: title_,
					title: title_,
					name: page.name,
					pclass: pclass,
					bgicon : true
				});
			});
			
			$('.nav').flexPanel({
				TabsModel : mod
			});
			
			$('.nav li').on('click', function() {
				$(this).addClass('current').siblings().removeClass("current");
				var data_tab = $(this).attr('data-tab');
				var pageTitle = $('.text', this).text();
				//新增页面
				operatePageManage.addPage(data_tab, pageTitle, 'OperationManagement/'+data_tab+'.html');
//				$('#mainPanel-yunying',parent.document).find('#rightPanel iframe').attr('src','OperationManagement/'+$(this).attr('data-tab')+'.html');
			});	
		};
	}, null);
	//加载完成
	$('body').flexShowLoading(false);
}

/**
 * 获取页面名称
 */
function getPageDisplay(key) {
	var name = '';
	switch (key) {
	case 1:
		name = parent.lang.company_information;
		break;
	case 2:
		name = parent.lang.role_management;
		break;
	case 3:
		name = parent.lang.user_information;
		break;
	case 4:
		name = parent.lang.SIM_card_information;
		break;
	case 5:
		name = parent.lang.device_management;
		break;
	case 6:
		name = parent.lang.vehicle_information;
		break;
	case 7:
		name = parent.lang.driver_information;
		break;
	case 8:
		name = parent.lang.vehiTeam_management;
		break;
	case 9:
		name = parent.lang.vehiSafe_management;
		break;
	case 10:
		name = parent.lang.expiration_reminder;
		break;
	case 11:
		name = parent.lang.document_management;
		break;
	case 12:
		name = parent.lang.line_management;
		break;
	}
	return name;
}