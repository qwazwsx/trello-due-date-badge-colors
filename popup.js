var picker = document.getElementById('picker')
var save = document.getElementById('save')

chrome.storage.sync.get(['color'], function(result) {
  picker.value = result.color
  console.log(`color is ${result.color}`)
})

picker.oninput = (elem) => {
  console.log(`oninput ${picker.value}`)

  // send msg to content script
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      color: picker.value
    })
  })
}

picker.onchange = (elem) => {
  console.log(`setting color to ${picker.value}`)
  chrome.storage.sync.set({
    color: picker.value
  }, function() {
    console.log(`success`)
  })
}