document.addEventListener('DOMContentLoaded', function () {
  $('#foo').click(function() {
    createNewGroup();
    console.log("yoooo");
  });
  console.log('wooooooo');
  chrome.extension.getBackgroundPage().console.log('foo');
});

function createNewGroup() {
  self.location="../test.html";
}
