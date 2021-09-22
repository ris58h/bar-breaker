const settings = {}

settings.loadDefault = function(callback) {
    const settingsUrl = chrome.runtime.getURL('settings/settings.json')
    fetch(settingsUrl).then(function(response) {
        response.json().then(callback)
    })
}

settings.load = function(callback) {
    chrome.storage.sync.get("settings", function(result) {
        if (result && result.settings) {
            callback(result.settings)
        } else {
            settings.loadDefault(callback)
        }
    })
}

settings.save = function(newSettings) {
    chrome.storage.sync.set({
        "settings": newSettings
    })
}

settings.addChangeListener = function(listener) {
    chrome.storage.onChanged.addListener(function (changes) {
        for (const key in changes) {
            if (key == "settings") {
                var storageChange = changes[key]
                listener(storageChange.newValue)
            }
        }
    })
}