// chrome.storage.sync.clear(function(result) {})
//
// is-due-past      due long time ago #ec9488
// is-due-now       overdue #eb5a46
// is-due-soon      within 24 hrs #f2d600
// is-due-complete  completed #61bd4f

const types = ['past', 'now', 'soon', 'complete']
var timeout = setTimeout(() => {}, 100)
var logLevel
chrome.storage.sync.get(['log'], function(result) {
  logLevel = result.log
  log(`log level ${result.log}`)
})

// set up animation
// let style_animate = document.createElement('style')
// style_animate.textContent = `
//   .badge.is-due-past, .badge.is-due-now, .badge.is-due-soon, .badge.is-due-complete {
//     transition: background-color .2s; // eslint-disable-line
//    }
//   .card-detail-due-date-badge.is-due-past .card-detail-due-status-lozenge, .card-detail-due-date-badge.is-due-now .card-detail-due-status-lozenge, .card-detail-due-date-badge.is-due-soon .card-detail-due-status-lozenge, .card-detail-due-date-badge.is-due-complete .card-detail-due-status-lozenge {
//     transition: background-color .2s; // eslint-disable-line
//    }`

types.forEach((type) => {
  chrome.storage.sync.get([type], function(result) {
    log(`${type} color is ${result[type]}`)
    if (result[type]) {
      setColor(type, result[type])
    }
  })
})

// let a = chrome.runtime.connect()
// a.onDisconnect.addListener(() => {
//   console.log(123)
//   // alert(1)
//   types.forEach((type) => {
//     console.log(`resetting ${type} - ${result[type]}`)
//     chrome.storage.sync.get([type], function(result) {
//       if (result[type]) {
//         setColor(type, result[type])
//       }
//     })
//   })
// })

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.messageType === 'color') {
    log(request.type, request.color)
    setColor(request.type, request.color)
  } else if (request.messageType === 'heartbeat') {
    // this is sooooo inneficient but i dont care
    log('heartbeat')
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      // style_animate.remove()

      log('TIMEOUT HIT')
      types.forEach((type) => {
        chrome.storage.sync.get([type], function(result) {
          log(`resetting ${type} - ${result[type]}`)

          // document.head.append(style_animate)

          if (result[type]) {
            setColor(type, result[type])
          }
        })
      })
    }, 100)
  }
})

function setColor(type, color) {
  log(`dom set ${type} - ${color}`)
  addStyle(type, `
    .badge.is-due-${type} {
      background-color: ${color}; // eslint-disable-line
    }
    .card-detail-due-date-badge.is-due-${type} .card-detail-due-status-lozenge {
      background-color: ${color}; // eslint-disable-line
    }
  `)
}

function log(str1, str2, str3) {
  str1 = str1 ?? ''
  str2 = str2 ?? ''
  str3 = str3 ?? ''
  if (logLevel == 1) {
    console.log(str1, str2, str3)
  } else if (logLevel == "2") {
    console.trace(str1, str2, str3)
  }
}

/**
 * Utility function to add replaceable CSS.
 * @param {string} styleString
 */
const addStyle = (() => {
  types.forEach((type) => {
    window[`style_${type}`] = document.createElement('style')
    document.head.append(window[`style_${type}`])
  })
  return (type, styleString) => window[`style_${type}`].textContent = styleString
})()