const BADGE_BACKGROUND_COLOR = 'gray'
browser.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR})

chrome.runtime.onMessage.addListener(function(message, sender) {
    if (message.type == 'updateBadge') {
        chrome.browserAction.setBadgeText({
            tabId: sender.tab.id,
            text: message.data.text
        })
    }
})