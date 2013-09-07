chrome.runtime.getBackgroundPage(function(page){

  document.addEventListener('DOMContentLoaded', function () {
    for(category in page.categories){
      console.log(category);
    
    }
    chrome.tabs.getSelected(function(tab){
      //chrome.tabs.remove(tab.id);
      page.addTab(tab.url,'foo');
    });
    $('#addtab').click(function(){
      console.log('clicked');
      page.openTabs('foo');
      page.categories.foo=[];
    });
  });
});
