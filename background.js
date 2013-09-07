
/*
window.currenttabs is an object whose keys are the different tab
categories and whose values are the current tabs open under that category
*/
window.currentTabs={};

/* 
categories is just an array with all the category names in it
*/
chrome.storage.local.get('categories',function(result){
	if(result.categories){
		window.categories = result.categories;
	} else {
		window.categories = [];
	}
});


addTab = function(tab,category){
	if(window.currentTabs[category]){
		window.currentTabs[category].push(tab);
	}
	saveTabs();
}
/*
window.domainlist is an object of the same format as currenttabs,
however it stores the domains associated with each group for auto-categorizing
*/
chrome.storage.local.get('domainList',function(result){
	if(result.domainList){
		window.domainList = result.domainLiset;
	} else {
		window.domainList = {};
	}
});

findCategory = function(tabID){
	for(category in window.currentTabs){
		for(var i=0;i<currentTabs[category].length;i++){
			if (tabID==currentTabs[category][i].id) return category;
		}
	}
	return null;
}

openTabs = function(category){
	for(var i=0; i<window.currentTabs[category].length;i++){
		chrome.tabs.create({window.currentTabs[category][i]);
	}
}
addCategory = function(categoryName) {
	if (window.categories.indexOf(categoryName)==-1){
		window.categories.push(categoryName);
		window.currentTabs[categoryName]=[];
		window.domainList[categoryName]=[];
		saveAll();
		console.log(categoryName + " added");
		console.log(categories);
	}
	
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