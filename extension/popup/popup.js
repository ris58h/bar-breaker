document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        const tabId = tabs[0].id
        chrome.tabs.sendMessage(tabId, { type : 'getNumBroken' }, function (response) {
            if (response) {
                document.getElementById('not-available-stub').style.display = 'none'
                updateMessage(response.data)
                chrome.runtime.onMessage.addListener(function(message, sender) {
                    if (sender.tab.id == tabId) {
                        if (message.type == 'numBrokenChanged') {
                            updateMessage(message.data)
                        }
                    }
                })
                const enabledCb = document.getElementById('enabled')
                enabledCb.addEventListener('change', function () {
                    chrome.tabs.sendMessage(tabId, { type: 'setEnabled', data: enabledCb.checked })
                })
            } else {
                document.getElementById('main').style.display = 'none'
            }
        })
    })
})

function updateMessage(numBroken) {
    const message = numBroken == 1 ? "1 bar broken" : numBroken + " bars broken"
    document.getElementById('message').textContent = message
}
