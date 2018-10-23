let enabled = false

addChangeListener(settingsHandler)
load(settingsHandler)

document.addEventListener("scroll", afterScrollHandler)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type == 'getState') {
		sendResponse({
			data: {
				enabled,
				numBroken: getNumBroken()
			}
		})
	} else if (request.type == 'setEnabled') {
		setEnabled(request.data)
	}
})

function setEnabled(value) {
	const prevEnabled = enabled
	enabled = value
	if (prevEnabled != enabled) {
		if (enabled) {
			processElements()
		} else {
			showHiddenBars()
			unpinPinnedBars()
		}
	}
}

function settingsHandler(settings) {
	const pageUrl = window.location.href
	setEnabled(!urlIsInExceptions(pageUrl, settings['exceptions']))
}

function urlIsInExceptions(url, exceptions) {
	for (const line of exceptions) {
		const r = new RegExp('^' + line.replace(/\*/g, '.*') + '$')
		if (r.test(url)) {
			return true;
		}
	}
	return false;
}

function afterScrollHandler() {
	if (!enabled) {
		return
	}

	processElements()

	for (const e of document.querySelectorAll('.__bar-breaker-top')) {
		if (window.pageYOffset === 0) {
			showBar(e)
		} else {
			hideBar(e)
		}
	}
}

const elementsSelector = 'div,nav,header,section'
	+ ',ul' // VSCode Marketplace
	+ ',app-header' // YouTube channel's page header
	+ ',cloudflare-app' // Cloudflare cookies bar
function processElements() {
	for (const e of document.body.querySelectorAll(elementsSelector)) {
		processElement(e)
	}
}

function processElement(e) {
	if (isHiddenBar(e) || isPinnedBar(e)) {
		return
	}

	if (inTopBars(e) && window.pageYOffset > 0) {
		hideBar(e)
		return
	}

	const minWidth = window.innerWidth / 2
	const maxHeight = window.innerHeight
	const looksLikeBar = e.offsetHeight > 0
		&& e.offsetHeight < maxHeight
		&& e.offsetWidth > minWidth
	if (!looksLikeBar) {
		return
	}

	const style = window.getComputedStyle(e)

	const hidden = style.display === 'none'
		|| (e.offsetParent === null && style.position !== 'fixed')
		|| style.visibility === 'hidden'
	if (hidden) {
		return
	}

	if (style.position === 'fixed') {
		if (parseFloat(style.bottom) === 0) {
			hideBar(e)
		} else if (!isNaN(parseFloat(style.top))) {
			const opacity = parseFloat(style.opacity)
			if (opacity < 1) {
				hideBar(e)
			} else {
				addToTopBars(e)
				if (window.pageYOffset > 0) {
					hideBar(e)
				}
			}
		}
	} else if (style.position === 'sticky') {
		pinBar(e)
	}
}

function hideBar(e) {
	e.classList.add('__bar-breaker__hidden')
	updateBadge()
}

function showBar(e) {
	e.classList.remove('__bar-breaker__hidden')
	updateBadge()
}

function showHiddenBars() {
	for (const e of document.querySelectorAll('.__bar-breaker__hidden')) {
		showBar(e)
	}
}

function isHiddenBar(e) {
	return e.classList.contains('__bar-breaker__hidden')
}

function pinBar(e) {
	e.classList.add('__bar-breaker__static')
	updateBadge()
}

function unpinBar(e) {
	e.classList.remove('__bar-breaker__static')
	updateBadge()
}

function unpinPinnedBars() {
	for (const e of document.querySelectorAll('.__bar-breaker__static')) {
		unpinBar(e)
	}
}

function isPinnedBar(e) {
	e.classList.contains('__bar-breaker__static')
}

function addToTopBars(e) {
	if (inTopBars(e)) {
		return
	}
	e.classList.add('__bar-breaker-top')
}

function inTopBars(e) {
	return e.classList.contains('__bar-breaker-top')
}

function getNumBroken() {
	const selector = '.__bar-breaker__hidden,.__bar-breaker__static'
	return document.querySelectorAll(selector).length
}

function updateBadge() {
	const numBroken = getNumBroken()
	chrome.runtime.sendMessage({ type: 'numBrokenChanged', data: numBroken })
}
