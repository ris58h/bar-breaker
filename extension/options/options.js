const options = {}

options.save = function() {
    const exceptions = document.querySelector("#exceptions").value
        .split('\n')
        .filter(line => line.length > 0)
    settings.save({ exceptions })
}

options.restore = function() {
    settings.load(options.renderSettings)
}

options.restoreDefault = function() {
    settings.loadDefault(options.renderSettings)
}

options.renderSettings = function(settings) {
    document.querySelector("#exceptions").value = settings["exceptions"].join('\n')
}

document.addEventListener("DOMContentLoaded", options.restore)
document.querySelector("#save").addEventListener("click", options.save)
document.querySelector("#default").addEventListener("click", options.restoreDefault)