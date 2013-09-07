chrome.tabs.getCurrent(function(tab){
	chrome.runtime.getBackgroundPage(function(page){
		$(document).ready(function(){
			function repeat(){
				setTimeout(function(){
					var categoryArr = page.findCategories(tab.id);
					var title = $('title').text();
					for(var i=0;i<categoryArr.length;i++){
						title = categoryArr[i].substring(0,2)+": "+title;
					}
					document.title = category.substring(0,2)+": "+title;
					repeat();
				},100);
			}
			repeat();
		});
	});
});
	