document.addEventListener("DOMContentLoaded", function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type : 'getBrokenBarsNumber' }, function (response) {
            if (response) {
                document.getElementById('message').textContent = getMessage(response['data'])
            }
        })
    })
})

function getMessage(numBroken) {
    if (numBroken == 1) {
        return "1 bar is broken"
    } else {
        return numBroken + " bars are broken"
    }
}