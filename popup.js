document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
    chrome.tabs.getSelected(function(tab){

    });
    console.log(page.categories);
    var $list = $('#group-list');
    for (var i=0;i<page.categories.length;i++){
      var li = $('li');
      li.append('<input type="checkbox" name="'+page.categories[i]+'">');
      li.append('<label>'+page.categories[i]+'</label>');
      $list.append(li);
    }
      $('#createNewGroup').click(function() {
         createNewGroup();
     });
  });
});

function createNewGroup() {
	self.location="../createNewGroup.html";
}
