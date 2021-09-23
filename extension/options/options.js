function saveOptions() {
    const exceptions = document.querySelector("#exceptions").value
        .split('\n')
        .filter(line => line.length > 0)
    extension.settings.save({ exceptions })
}

function restoreOptions() {
    extension.settings.load(renderSettings)
}

function restoreDefault() {
    extension.settings.loadDefault(renderSettings)
}

function renderSettings(settings) {
    document.querySelector("#exceptions").value = settings["exceptions"].join('\n')
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.querySelector("#save").addEventListener("click", saveOptions)
document.querySelector("#default").addEventListener("click", restoreDefault)