chrome.tabs.getCurrent(function(tab){
	chrome.runtime.getBackgroundPage(function(page){
		var category = page.findCategory(tab.id);
		if(category){
			var title = $('title').text();
			document.title = category.substring(0,2)+": "+title;
		}
	});
});