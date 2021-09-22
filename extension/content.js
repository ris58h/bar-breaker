let enabled = false

updateBadge()

addChangeListener(settingsHandler)
load(settingsHandler)

let timer = null
window.addEventListener('scroll', () => {
    if (timer !== null) {
        clearTimeout(timer)      
    }
    timer = setTimeout(processElements, 100)
}, false)

chrome.runtime.onMessage.addListener(request => {
	if (request.type == 'toggleEnabled') {
		setEnabled(!enabled)
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
		updateBadge()
	}
}

function settingsHandler(settings) {
	const pageUrl = window.location.href
	setEnabled(!isUrlInExceptions(pageUrl, settings['exceptions']))
}

function isUrlInExceptions(url, exceptions) {
	for (const line of exceptions) {
		const r = new RegExp('^' + line.replace(/\*/g, '.*') + '$')
		if (r.test(url)) {
			return true
		}
	}
	return false
}

const skipTagsSelector = 'SCRIPT,NOSCRIPT,STYLE,svg,IFRAME,META,FORM,TABLE,DL,OL,UL,P'
const skipTags = new Set()
for (const skipTag of skipTagsSelector.split(',')) {
	skipTags.add(skipTag)
}

function processElements() {
	if (!enabled) {
		return
	}

	const elements = []
	elements.push(document.body)
	while (elements.length > 0) {
		const element = elements.pop()
		for (const child of element.childNodes) {
			if (child.tagName && !skipTags.has(child.tagName)) {
				processElement(child)
				if (child.hasChildNodes && child.hasChildNodes()) {
					elements.push(child)
				}
			}
		}
	}
}

function processElement(e) {
	if (isHiddenBar(e)) {
		if (isInTopBars(e)) {
			const style = window.getComputedStyle(e)
			if (style.position !== 'fixed') {
				removeFromTopBars(e)
				showBar(e)
				return
			}
			if (window.pageYOffset === 0) {
				showBar(e)
				return
			}
		}
		return
	}
	if (isPinnedBar(e)) {
		return
	}

	if (isInTopBars(e)) {
		if (window.pageYOffset > 0) {
			hideBar(e)
		}
		return
	}

	const minWidth = window.innerWidth / 2
	const maxHeight = window.innerHeight
	const looksLikeBar = e.offsetHeight < maxHeight && e.offsetWidth > minWidth
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
			if (!seemsLikeBottomMenu(e)) {
				hideBar(e)
			}
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

function seemsLikeBottomMenu(e) {
	return e.tagName === 'NAV'
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
	if (isInTopBars(e)) {
		return
	}
	e.classList.add('__bar-breaker-top')
}

function removeFromTopBars(e) {
	e.classList.remove('__bar-breaker-top')
}

function isInTopBars(e) {
	return e.classList.contains('__bar-breaker-top')
}

function getNumBroken() {
	const selector = '.__bar-breaker__hidden,.__bar-breaker__static'
	return document.querySelectorAll(selector).length
}

function updateBadge() {
	chrome.runtime.sendMessage({
		type: 'stateChanged',
		data: {
			enabled,
			numBroken: getNumBroken()
		}
	})
}
