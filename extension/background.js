const BADGE_BACKGROUND_COLOR = 'gray'
chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR})

chrome.runtime.onMessage.addListener(function(message, sender) {
    const tabId = sender.tab.id
    if (message.type == 'numBrokenChanged') {
        const numBroken = message.data
        const badgeText = numBroken > 0 ? '' + numBroken : ''
        chrome.browserAction.setBadgeText({
            tabId,
            text: badgeText
        })
        const badgeTitle = numBroken > 0 ? `Bar Breaker (${badgeText})` : 'Bar Breaker'
        chrome.browserAction.setTitle({
            tabId,
            title: badgeTitle
        })
    }
})
