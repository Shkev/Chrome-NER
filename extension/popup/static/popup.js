/**
 * Send message to content.js to start tagging NEs on the current page.
 * @return {void}
 */
function SendTagMessage() {
  const message = 'tag';
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    // send message to content.js
    chrome.tabs.sendMessage(tabs[0].id, {type: "init", status: message}, (response) => {
      console.log(response);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('click-count', (res) => {
    console.log(res['click-count']);
  });
  const btn = document.getElementById('tag-btn');
  btn.addEventListener('click', () => {
    chrome.storage.sync.get('click-count', (res) => {
      // tagging multiple times w/o refresh results in tagging the same NEs multiple times
      // so we only allow tagging once per page refresh
      if (res['click-count'] == 0) {
        SendTagMessage();
        chrome.storage.sync.set({'click-count': 1});
      } else {
        alert('Please refresh the page to start tagging again.');
      }
    });
  });
});