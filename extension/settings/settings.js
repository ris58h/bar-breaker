extension = typeof extension === 'undefined' ? {} : extension
extension.settings = {}

extension.settings.loadDefault = function(callback) {
    const settingsUrl = chrome.runtime.getURL('settings/settings.json')
    fetch(settingsUrl).then(function(response) {
        response.json().then(callback)
    })
}

extension.settings.load = function(callback) {
    chrome.storage.sync.get("settings", function(result) {
        if (result && result.settings) {
            callback(result.settings)
        } else {
            extension.settings.loadDefault(callback)
        }
    })
}

extension.settings.save = function(settings) {
    chrome.storage.sync.set({
        "settings": settings
    })
}

extension.settings.addChangeListener = function(listener) {
    chrome.storage.onChanged.addListener(function (changes) {
        for (const key in changes) {
            if (key == "settings") {
                var storageChange = changes[key]
                listener(storageChange.newValue)
            }
        }
    })
}