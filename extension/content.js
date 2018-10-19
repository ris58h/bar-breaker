let enabled = false

addChangeListener(settingsHandler)
load(settingsHandler)

document.addEventListener("scroll", afterScrollHandler)

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.type == 'getBrokenBarsNumber') {
		sendResponse({ data: getBrokenBarsNumber() })
	}
})

function settingsHandler(settings) {
	const pageUrl = window.location.href
	const prevEnabled = enabled
	enabled = !urlIsInExceptions(pageUrl, settings['exceptions'])
	if (prevEnabled != enabled) {
		if (enabled) {
			processElements()
		} else {
			repairBrokenBars()
			unpinPinnedBars()
		}
	}
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
			repairBar(e)
		} else {
			breakBar(e)
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
	if (isBrokenBar(e) || isPinnedBar(e) || inTopBars(e)) {
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
			breakBar(e)
		} else if (!isNaN(parseFloat(style.top))) {
			const opacity = parseFloat(style.opacity)
			if (opacity < 1) {
				breakBar(e)
			} else {
				addToTopBars(e)
				if (window.pageYOffset > 0) {
					breakBar(e)
				}
			}
		}
	} else if (style.position === 'sticky') {
		pinBar(e)
	}
}

function breakBar(e) {
	e.classList.add('__bar-breaker__hidden')
	updateBadge()
}

function repairBar(e) {
	e.classList.remove('__bar-breaker__hidden')
	updateBadge()
}

function repairBrokenBars() {
	for (const e of document.querySelectorAll('.__bar-breaker__hidden')) {
		repairBar(e)
	}
}

function isBrokenBar(e) {
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

function getBrokenBarsNumber() {
	const selector = '.__bar-breaker__hidden,.__bar-breaker__static'
	return document.querySelectorAll(selector).length
}

function updateBadge() {
	const numBroken = getBrokenBarsNumber()
	const text = numBroken > 0 ? '' + numBroken : ''
	chrome.runtime.sendMessage({ type: 'updateBadge', data: { text }})
}
