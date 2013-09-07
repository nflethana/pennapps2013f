document.addEventListener('DOMContentLoaded', function () {
  var ptag = $('<p>asdfasdfsdaf</p>');
  $('body').append(ptag);
  console.log('wooooooo');
  chrome.tabs.getSelected(function(tab){
    //chrome.tabs.remove(tab.id);
    chrome.runtime.getBackgroundPage(function(page){
      page.openLastPage();
      page.lastpageURL = tab.url;
    });
  });
});

