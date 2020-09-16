chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({
    past: '#ec9488',
    soon: '#f2d600',
    now: '#eb5a46',
    complete: '#61bd4f',
    log: 0
  })
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'trello.com'
        }
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }])
  })
})