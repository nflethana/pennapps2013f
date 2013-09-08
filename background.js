//  Uncomment the following to clear the local storage
//  Note:  You must also click reload on the extension on the Chrome extensions page
chrome.storage.local.clear();

/*
window.currenttabs is an object whose keys are the different tab
categories and whose values are the current tabs open under that category
*/
window.currentTabs={};
window.ungrouped=[];
chrome.tabs.query({},function(arr){
	for(var i=0;i<arr.length;i++){
		window.ungrouped[i]=arr[i];
		console.log(window.ungrouped[i]);
	}
	console.log(window.ungrouped);
});
// setTimeout(function(){
// 	console.log(window.ungrouped);
// },10);
window.categoriesChecked={};

function uncheckCategory(category) {
	if (window.categoriesChecked[category]) {
		window.categoriesChecked[category] = false;
	}
}

function checkCategory(category) {
	if (!window.categoriesChecked[category]) {
		window.categoriesChecked[category] = true;
	}
}
function getAllTabs(){
	chrome.tabs.query({},function(arr){
		console.log(arr);
		return arr.slice(0);
	});
}
function findinArray(tabId,arr){
	for(var i=0;i<arr.length;i++){
		if(arr[i].id==tabId) return i;
	}
	return -1;
}
/* 
categories is just an array with all the category names in it
*/
chrome.storage.local.get('categories',function(result){
	console.log(result);
	if(result.categories){
		window.categories = result.categories;
	} else {
		window.categories = [];
	}
	for(var i=0;i<window.categories.length;i++){
		if(typeof window.currentTabs[window.categories[i]]== "undefined"){
			window.currentTabs[window.categories[i]]=[];
		}
		window.categoriesChecked[window.categories[i]]=true;
	}
});

/*
window.domainlist is an object of the same format as currenttabs,
however it stores the domains associated with each group for auto-categorizing
*/
chrome.storage.local.get('domainList',function(result){
	if(result.domainList){
		window.domainList = result.domainList;
	} else {
		window.domainList = {};
	}
});
addDomain = function(url,addCategories){
	var hostname = getHostname(url);
	for (var i = 0; i < categories.length; i++) {
		if(window.domainList[addCategories[i]].indexOf(hostname)==-1){
			window.domainList[addCategories[i]].push(hostname);
		}
	}
}
addTab = function(tab, addCategory){
	console.log(window.currentTabs);
	console.log(window.ungrouped);
	//console.log(getAllTabs());
	var ung = findinArray(tab.id,window.ungrouped);
	if(ung>-1){
		window.ungrouped.splice(ung,1);
	}
	// clear other categories
	for(x in window.currentTabs){
		for(var j=0;j<window.currentTabs[x].length;j++){
			if(window.currentTabs[x][j].id==tab.id){
				window.currentTabs[x].splice(j,1);
			}
		}
	}
	if (addCategory=='Ungrouped'){
		window.ungrouped.push(tab);
	} else {
	// select the new one
		window.currentTabs[addCategory].push(tab);
	}
	saveTabs();
}
findCategories = function(tabID){
	var found = [];
	for(category in window.currentTabs){
		for(var i=0;i<currentTabs[category].length;i++){
			if (tabID==currentTabs[category][i].id) found.push(category);
		}
	}
	return found;
}

openTabs = function(category){
	for(var i=0; i<window.currentTabs[category].length;i++){
		chrome.tabs.create({url:window.currentTabs[category][i].url},function(newTab){
			saveNewTab(newTab);

			// window.currentTabs[category][i]=newTab;
		});
	}
	replaceOldTabs(category);
}

window.tabsBeingAdded = [];

saveNewTab = function(tab) {
	window.tabsBeingAdded.push(tab);
}

replaceOldTabs = function(category) {
	window.currentTabs[category] = [];
	for (var i = 0; i < window.tabsBeingAdded.length; i++) {
		window.currentTabs[category].push(tabsBeingAdded[i]);
	}
	window.tabsBeingAdded = [];
}

removeCategory = function(categoryName){
	window.categories.splice(window.categories.indexOf(categoryName),1);
	delete window.currentTabs[categoryName];
	delete window.domainList[categoryName];
	delete window.categoriesChecked[categoryName];
	saveAll();
}
addCategory = function(categoryName) {
	if (window.categories.indexOf(categoryName)==-1){
		window.categories.push(categoryName);
		window.currentTabs[categoryName]=[];
		window.domainList[categoryName]=[];
		window.categoriesChecked[categoryName]=true;
		saveAll();
		console.log(categoryName + " added");
		console.log(categories);
	}
	
}
function getLocation(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
}
function getHostname(url){
	var l = getLocation(url);
	return l.hostname;
}
function saveAll(){
 	saveCategories();
 	saveTabs();
 	saveDomains();

}
function saveCategories(){
	chrome.storage.local.set({"categories":categories},function(){
		console.log('category storage done');
	});
}
function saveTabs(){
	chrome.storage.local.set({"currentTabs":currentTabs},function(){
		console.log('tab storage done');
	});
}
function saveDomains(){
	chrome.storage.local.set({"domainList":domainList},function(){
		console.log('domain storage done');
	});

}



