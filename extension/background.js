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

if (chrome.browserAction.setBadgeTextColor) {
    chrome.browserAction.setBadgeTextColor({color: BADGE_TEXT_COLOR})
}
if (chrome.browserAction.setBadgeBackgroundColor) {
    chrome.browserAction.setBadgeBackgroundColor({color: BADGE_BACKGROUND_COLOR})
}

chrome.runtime.onMessage.addListener((message, sender) => {
    const tabId = sender.tab.id
    if (message.type == 'stateChanged') {
        const enabled = message.data.enabled
        const numBroken = message.data.numBroken

        if (chrome.browserAction.setBadgeText) {
            const text = numBroken > 0 ? '' + numBroken : ''
            chrome.browserAction.setBadgeText({ tabId, text })
        }

        const titleInfo = enabled ? brokenMessage(numBroken) : 'disabled'
        const title = `Bar Breaker (${titleInfo})`
        chrome.browserAction.setTitle({ tabId, title })

        if (chrome.browserAction.setIcon) {
            const path = enabled ? ENABLED_ICONS : DISABLED_ICONS
            chrome.browserAction.setIcon({ tabId, path })
        }
    }
})

function brokenMessage(numBroken) {
    return numBroken > 0 ? (numBroken + ' broken') : 'no broken'
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
