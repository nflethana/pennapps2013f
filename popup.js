document.addEventListener('DOMContentLoaded', function () {
  var ptag = document.createElement('p');
  ptag.innerHTML = "skl;sdfjlasl;kdfjsadl;k";
  document.body.appendChild(ptag);
  createNewGroup();
  console.log('wooooooo');
  chrome.extension.getBackgroundPage().console.log('foo');
});

function createNewGroup() {
  window.location="http://www.google.com/";
}
