window.openLastPage = function(){
	if(window.lastpageURL){
		chrome.tabs.create({url:window.lastpageURL});
	}
}
window.lastpageURL="http://www.google.com"
window.categories = [];
addTab = function(url,category){
	if(window.categories[category]){
		window.categories[category].push(url);
	} else {
		window.categories[category] = [url];
	}
}
openTabs = function(category){
	for(var i=0; i<window.categories[category].length;i++){
		chrome.tabs.create({url:window.categories[category][i]});
	}
}
addCategory = function(categoryName) {
	window.categories.push(categoryName);
}