//  Uncomment the following to clear the local storage
//  Note:  You must also click reload on the extension on the Chrome extensions page
// chrome.storage.local.clear();

/*
window.currenttabs is an object whose keys are the different tab
categories and whose values are the current tabs open under that category
*/
window.groupExits=[];
window.currentTabs={};
window.ungrouped=[];
window.refreshGroups=false;
chrome.tabs.query({},function(arr){
	for(var i=0;i<arr.length;i++){
		window.ungrouped[i]=arr[i];
		console.log(window.ungrouped[i]);
	}
	console.log(window.ungrouped);
	chrome.storage.local.get('domainList',function(result){
		if(result.domainList){
			window.domainList = result.domainList;
		} else {
			window.domainList = {};
		}
		for(var i=0;i<window.ungrouped.length;i++){
			var hostname = getHostname(window.ungrouped[i].url);
		
			
			var a = findDomainCategory(hostname);
			if(a){
				var tab = window.ungrouped.splice(i,1);
				addTab(tab,a);
			}
		}
	});
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
		window.categoriesChecked['Ungrouped']=true;
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
function findDomainCategory(domain){
	for (x in domainList){
		for(var i=0;i<x.length;i++){
			if (x[i]==domain) return x;
		}
	}
	return null;
}
findinArray= function(tabId,arr){
	for(var i=0;i<arr.length;i++){
		if(arr[i].id==tabId) return i;
	}
	return -1;
}
findInObj = function(tabId,obj){
	for(x in obj){
		if(findinArray(tabId,obj[x])>-1) return x;
	}
	return 'Ungrouped';
}
findTabById = function(tabId){
	for(x in currentTabs){
		var num = findinArray(tabId,currentTabs[x]);
		if(num>-1) return currentTabs[x][num];
	}
	num = findinArray(tabId,ungrouped);
	if (num>-1) return ungrouped[num];
	else return null;
}
addDomain = function(url,addCategories){
	var hostname = getHostname(url);
	for (var i = 0; i < categories.length; i++) {
		if(window.domainList[addCategories[i]].indexOf(hostname)==-1){
			window.domainList[addCategories[i]].push(hostname);
		}
	}
}

addTab = function(tab, addCategory,fromChecked){
	console.log(addCategory);
	if(fromChecked){
		console.log(window.currentTabs);
		console.log(window.ungrouped);
		//console.log(getAllTabs());
		var ung = findinArray(tab.id,window.ungrouped);
		if(ung>-1){
			window.ungrouped.splice(ung,1);
		}
	}
		// clear other categories
	for(x in window.currentTabs){
		for(var j=0;j<window.currentTabs[x].length;j++){
			if(window.currentTabs[x][j].id==tab.id){
				window.currentTabs[x].splice(j,1);
			}
		}
	}
	if(!fromChecked){
		chrome.tabs.create({url:tab.url,active:false}, function(newTab){
			if(addCategory=='Ungrouped'){
				window.ungrouped.push(newTab);
			} else {
				window.currentTabs[addCategory].push(newTab);
			}
		});
	} else{
	if (addCategory=='Ungrouped'){
		window.ungrouped.push(tab);
	} else {
	// select the new one
		window.currentTabs[addCategory].push(tab);
	}
	if(!window.categoriesChecked[addCategory]){
		chrome.tabs.remove(tab.id,function(){});
	}
	console.log(currentTabs);
	saveTabs();
	}
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

openTabs = function(category,tab){
	var arr;
	console.log(tab);
	if(typeof tab!='undefined'){
		arr=[tab];
	}else if(category=='Ungrouped'){
		arr = window.ungrouped;
	} else {
		arr = window.currentTabs[category];
	}
	console.log(arr);
	for(var i=0; i<arr.length;i++){
		chrome.tabs.create({url:arr[i].url,active:false}, function(newTab){
			saveNewTab(newTab);

			// window.currentTabs[category][i]=newTab;
		});
	}
	window.setTimeout(function() {
		replaceOldTabs(category,typeof tab!='undefined');
	}, 1000);


	// replaceOldTabs(category);
}

window.tabsBeingAdded = [];

saveNewTab = function(tab) {
	window.tabsBeingAdded.push(tab);
}

replaceOldTabs = function(category,issingle) {
	if(issingle){
		if(category=="Ungrouped"){
			window.ungrouped.push(window.tabsBeingAdded[0]);
		} else {
			window.currentTabs[category].push(window.tabsBeingAdded[0]);
		}
	} else if(category=="Ungrouped"){
		window.ungrouped=[];
	} else {
		window.currentTabs[category] = [];
	}
	if(!issingle){
	for (var i = 0; i < window.tabsBeingAdded.length; i++) {
		if(category=="Ungrouped"){
			window.ungrouped.push(tabsBeingAdded[i]);
		} else{
			window.currentTabs[category].push(tabsBeingAdded[i]);
		}
		
		}
	}
	window.tabsBeingAdded = [];
}

removeCategory = function(categoryName){
	console.log(categories);
	console.log(categoryName);
	window.categories.splice(window.categories.indexOf(categoryName),1);
	for(var i=0; i<window.currentTabs[categoryName].length;i++){
		window.ungrouped.push(window.currentTabs[categoryName][i]);
	}
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



