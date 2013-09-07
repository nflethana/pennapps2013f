document.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.getBackgroundPage(function(page){
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
  });
});
