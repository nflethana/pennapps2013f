document.addEventListener('DOMContentLoaded', function () {
<<<<<<< HEAD
  chrome.runtime.getBackgroundPage(function(page){
=======

	chrome.runtime.getBackgroundPage(function(page){
  
  	console.log("ahhh");

    for(category in page.categories){
      console.log(category);
    
    }
>>>>>>> 298f58158b8b69d4a86eead471d107129d26ef0e
    chrome.tabs.getSelected(function(tab){
      for(category in page.categories){
        console.log(category);
      
      }
      
        //chrome.tabs.remove(tab.id);
        page.addTab(tab.url,'foo');
      
      $('#createNewGroup').click(function(){
        console.log('clicked');
        $('#createNewGroup').css('display','none');
        $('#groupform').show();
      });
      $('groupsubmit').click(function({
        console.log($('#groupinput').val());
      });
      $('#addTab').click(function(){
        console.log('clicked');
        page.openTabs('foo');
        page.categories.foo=[];
      });
    });

    $('#createNewGroup').click(function() {
       createNewGroup();
   });
  });
});

function createNewGroup() {
	self.location="../createNewGroup.html";
}
