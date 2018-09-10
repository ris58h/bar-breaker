const topBars = []
const topBarSymbol = Symbol()
function addToTopBars(e) {
	if (e[topBarSymbol]) {
		return
	}
	e[topBarSymbol] = true
	topBars.push(e)
}

document.addEventListener("scroll", afterScrollHandler)

function afterScrollHandler () {
	processElements()

	if (window.pageYOffset === 0) {
		topBars.forEach(repairBar)
	} else {
		topBars.forEach(breakBar)
	}
}

processElements()

function processElements() {
	for (const e of document.body.querySelectorAll('div,nav,header,section')) {
		processElement(e)
	}
}

function processElement(e) {
	const minWidth = window.innerWidth / 2
	const looksLikeBar = e.offsetHeight > 0 && e.offsetWidth > minWidth
	if (!looksLikeBar) {
		return
	}

	const style = window.getComputedStyle(e)

	const hidden =  style.display === 'none'
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
		//TODO tests for this case
		pinBar(e)
	}
}

function breakBar(e) {
	e.classList.add('__bar-breaker__hidden')
}

function repairBar(e) {
	e.classList.remove('__bar-breaker__hidden')
}

function pinBar(e) {
	e.classList.add('__bar-breaker__static')
}
