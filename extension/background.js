const BADGE_TEXT_COLOR = 'white'
const BADGE_BACKGROUND_COLOR = 'gray'
const ENABLED_ICONS = {
    16: 'icons/icon16.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png'
}
const DISABLED_ICONS = {
    16: 'icons/disabled16.png',
    48: 'icons/disabled48.png',
    128: 'icons/disabled128.png'
}
chrome.browserAction.setBadgeTextColor({color: BADGE_TEXT_COLOR})
chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR})

chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab.id
    if (message.type == 'stateChanged') {
        const enabled = message.data.enabled
        const numBroken = message.data.numBroken

        const text = numBroken > 0 ? '' + numBroken : ''
        chrome.browserAction.setBadgeText({ tabId, text })

        const titleInfo = enabled ? (numBroken > 0 ? brokenMessage(numBroken) : 'enabled') : 'disabled'
        const title = `Bar Breaker (${titleInfo})`
        chrome.browserAction.setTitle({ tabId, title })

        const path = enabled ? ENABLED_ICONS : DISABLED_ICONS
        chrome.browserAction.setIcon({ tabId, path })
    }
})

function brokenMessage(numBroken) {
    return numBroken + ' broken'
}

function toggleEnabled(tabId) {
    chrome.tabs.sendMessage(tabId, { type : 'toggleEnabled' })
}

chrome.browserAction.onClicked.addListener(tab => {
    toggleEnabled(tab.id)
})

browser.commands.onCommand.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const tab = tabs[0]
        toggleEnabled(tab.id)
    })
})
