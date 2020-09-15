// chrome.storage.sync.clear(function(result) {
//   console.log(`CLEAR is ${result.color}`)
//   // setColor(result.color)
// })

chrome.storage.sync.get(['color'], function(result) {
  console.log(`color is ${result.color}`)
  if (result.color) {
    setColor(result.color)
  }
})

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(`color from popup ${request.color}`)
  setColor(request.color)
})

function setColor(color) {
  addStyle(`
    .badge.is-due-soon {
      background-color: ${color}; // eslint-disable-line
    }
  `)
}

/**
 * Utility function to add replaceable CSS.
 * @param {string} styleString
 */
const addStyle = (() => {
  const style = document.createElement('style')
  document.head.append(style)
  return (styleString) => style.textContent = styleString
})()