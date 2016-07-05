$(document).ready(function(){
	$('body').flexShowLoading(true);
	setTimeout(loadReadyPage, 50);
});

function loadReadyPage() {
	if (typeof parent.lang == "undefined" || !parent.isLoadMapMarkerList) {
		setTimeout(loadReadyPage, 50);
	} else {
		loadPage();
	}
}

function loadPage() {
	var mod = [];
	mod.push({
		display: parent.lang.rule_ruleMaintain,
		title: parent.lang.rule_ruleMaintain,
		name: 'RuleMaintain',
		pclass: 'current clearfix',
		bgicon : true
	});
	mod.push({
		display: parent.lang.rule_assignMaintain_vehicle,
		title: parent.lang.rule_assignMaintain_vehicle,
		name: 'AssignMaintain',
		pclass: 'clearfix',
		bgicon : true
	});
	$('.nav').flexPanel({
		TabsModel : mod
	});

	$('.nav li').on('click', function() {
		$(this).addClass('current').siblings().removeClass("current");
		$('#mainPanel-guize',parent.document).find('#rightPanel iframe').attr('src','RulesManagement/'+$(this).attr('data-tab')+'.html');
	});
	//加载完成
	$('body').flexShowLoading(false);
}