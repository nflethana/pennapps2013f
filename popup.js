document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    chrome.tabs.getSelected(function(tab){
      for(category in page.categories){
        console.log(category);    
      }    
        //chrome.tabs.remove(tab.id);
      
      
    });

    $('#createNewGroup').click(function() {
       createNewGroup();
   });
  });
});

function createNewGroup() {
	self.location="../createNewGroup.html";
}
