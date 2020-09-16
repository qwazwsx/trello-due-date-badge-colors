const types = ['past', 'now', 'soon', 'complete']
const defaults = {
  past: '#ec9488',
  now: '#eb5a46',
  soon: '#f2d600',
  complete: '#61bd4f'
}
let start = {}

var save = document.getElementById('save')
var reset = document.getElementById('reset')
var log = document.getElementById('log')

chrome.storage.sync.get(['log'], function(result) {
  console.log(result.log)
  log.value = result.log
  console.log(`log option is ${result.log}`)
})

// heartbeat
setInterval(() => {
  // send msg to content script
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      messageType: 'heartbeat'
    })
  })
}, 10)

// send color messages to content script
setInterval(() => {
  if (!checkChanges()) return true

  console.log(checkChanges())

  // send msg to content script
  types.forEach((type) => {
    let elem = document.getElementById(type)

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        messageType: 'color',
        type: type,
        color: elem.value
      })
    })
  })
}, 100)

reset.onclick = () => {
  types.forEach((type) => {
    let elem = document.getElementById(type)
    elem.value = defaults[type]
  })
}

save.onclick = () => {
  chrome.storage.sync.set({
    log: log.value
  })

  types.forEach((type) => {
    _save(type, document.getElementById(type).value)
  })
  window.location.reload()
}

// loop over each type
types.forEach((type) => {
  let elem = document.getElementById(type)

  // fetch color
  chrome.storage.sync.get([type], function(result) {
    elem.value = result[type]
    start[type] = result[type]
    console.log(`${type} is ${result[type]}`)
  })

  // register oninput
  // elem.oninput = () => {
  //   console.log(`${type} oninput ${elem.value}`)
  //   checkChanges()
  // }

  // register onchange
  // elem.onchange = () => {
  //   _save(type, elem.value)
  // }
})

function checkChanges() {
  let changes = false
  types.forEach((type) => {
    if (start[type] !== document.getElementById(type).value) {
      changes = true
      document.getElementById('draft').style.visibility = 'visible'
    }
  })
  if (!changes) {
    document.getElementById('draft').style.visibility = 'hidden'
  }
  return changes
}

function _save(type, value) {
  console.log(`${type} setting color to ${value}`)
  let obj = {}
  obj[type] = value

  chrome.storage.sync.set(obj, function() {
    console.log(`success`)
  })
}