$(document).ready(function(){
	$('body').flexShowLoading(true);
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined") {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
//	$.myajax.showLoading(true, parent.lang.loading, this);
	//向服务器发送ajax请求
	$.myajax.jsonGet("StandardServerAction_serverConfig.action", function(json,action,success){
//		$.myajax.showLoading(false);
		if (success) {
			var mod = [];
			mod.push({
				display: parent.lang.all,
				title: parent.lang.all,
				name: 'AllServer',
				pclass: 'current clearfix',
				bgicon : true
			});
			mod.push({
				display: parent.lang.server_login,
				title: parent.lang.server_login,
				name: 'LoginServer',
				pclass: 'clearfix',
				bgicon : true
			});
			mod.push({
				display: parent.lang.server_gateway,
				title: parent.lang.server_gateway,
				name: 'GatewayServer',
				pclass: 'clearfix',
				bgicon : true
			});
			mod.push({
				display: parent.lang.server_user,
				title: parent.lang.server_user,
				name: 'UserServer',
				pclass: 'clearfix',
				bgicon : true
			});
			mod.push({
				display: parent.lang.server_media,
				title: parent.lang.server_media,
				name: 'MediaServer',
				pclass: 'clearfix',
				bgicon : true
			});
			
			if (json.enableStorage) {
				mod.push({
					display: parent.lang.server_storage,
					title: parent.lang.server_storage,
					name: 'StorageServer',
					pclass: 'clearfix',
					bgicon : true
				});
			}
			if (json.enableAutoDown) {
				mod.push({
					display: parent.lang.server_downStation,
					title: parent.lang.server_downStation,
					name: 'DownStation',
					pclass: 'clearfix',
					bgicon : true
				});
				mod.push({
					display: parent.lang.server_down,
					title: parent.lang.server_down,
					name: 'DownServer',
					pclass: 'clearfix',
					bgicon : true
				});
			}
			
			$('.nav').flexPanel({
				TabsModel : mod
			});
			
			$('.nav li').on('click', function() {
				$(this).addClass('current').siblings().removeClass("current");
				if($(this).attr('data-tab') == 'AllServer' || $(this).attr('data-tab') =='LoginServer') {
					$('#mainPanel-server',parent.document).find('#rightPanel iframe').attr('src','ServerManagement/'+$(this).attr('data-tab')+'.html');
				}else {
					$('#mainPanel-server',parent.document).find('#rightPanel iframe').attr('src','ServerManagement/Server.html?type='+$(this).attr('data-tab'));
				}
			});
		}
	}, null);
	//加载完成
	$('body').flexShowLoading(false);
}