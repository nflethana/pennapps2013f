document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    chrome.tabs.getSelected(function(tab){

    });
    console.log(page.categories);
    var $list = $('#group-block');
    for (var i=0;i<page.categories.length;i++){
      $list.append('<input type="checkbox" name="'+page.categories[i]+'"></input><label>'+page.categories[i]+'</label><br>');
    }
      $('#createNewGroup').click(function() {
         createNewGroup();
     });
  });
});

function createNewGroup() {
	self.location="../createNewGroup.html";
}
