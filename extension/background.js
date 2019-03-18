const BADGE_TEXT_COLOR = 'white'
const BADGE_BACKGROUND_COLOR = 'gray'
chrome.browserAction.setBadgeTextColor({color: BADGE_TEXT_COLOR})
chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR})

chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab.id
    if (message.type == 'stateChanged') {
        const enabled = message.data.enabled
        const numBroken = message.data.numBroken

        //TODO setIcon

        const badgeText = numBroken > 0 ? '' + numBroken : ''
        chrome.browserAction.setBadgeText({
            tabId,
            text: badgeText
        })

        const badgeTitleInfo = enabled ? (numBroken > 0 ? brokenMessage(numBroken) : 'enabled') : 'disabled'
        chrome.browserAction.setTitle({
            tabId,
            title: `Bar Breaker (${badgeTitleInfo})`
        })
    }
})

function brokenMessage(numBroken) {
    return numBroken + ' broken'
}

chrome.browserAction.onClicked.addListener(tab => {
    chrome.tabs.sendMessage(tab.id, { type : 'toggleEnabled' })
})
