
/*
window.currenttabs is an object whose keys are the different tab
categories and whose values are the current tabs open under that category
*/
window.currentTabs={};

/* 
categories is just an array with all the category names in it
*/
window.categories = [];

addTab = function(tab,category){
	if(window.currentTabs[category]){
		window.currentTabs[category].push(tab);
	} else {
		window.currentTabs[category]=[];
		window.currentTabs[category].push(tab);
	}
}
/*
window.domainlist is an object of the same format as currenttabs,
however it stores the domains associated with each group for auto-categorizing
*/
window.domainlist={};


openTabs = function(category){
	for(var i=0; i<window.categories[category].length;i++){
		chrome.tabs.create({url:window.categories[category][i].url});
	}
}
addCategory = function(categoryName) {
	if (window.categories.indexOf(categoryName)==-1){
		window.categories.push(categoryName);
		window.currentTabs[categoryName]=[];
		window.domainlist[categoryName]=[];
		console.log(categoryName + " added");
		console.log(categories);
	}
	
}