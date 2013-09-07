window.openLastPage = function(){
	if(window.lastpageURL){
		chrome.tabs.create({url:window.lastpageURL});
	}
}
window.lastpageURL="http://www.google.com"