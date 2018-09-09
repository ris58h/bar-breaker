const topBars = []

document.addEventListener("scroll", afterScrollHandler)

function afterScrollHandler () {
	if (window.pageYOffset === 0) {
		topBars.forEach(repairBar)
	} else {
		topBars.forEach(breakBar)
	}
}

for (const e of document.body.querySelectorAll('div,nav,header,section')) {
	processElement(e)
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
		} else if (parseFloat(style.top) >= 0) {
			const opacity = parseFloat(style.opacity)
			if (opacity < 1) {
				breakBar(e)
			} else {
				topBars.push(e)
				if (window.pageYOffset > 0) {
					breakBar(e)
				}
			}
		}
	} else if (style.position === 'sticky') {
		e.style.position = 'static'
	}
}

function breakBar(e) {
	e.classList.add('__bar-breaker__hidden')
}

function repairBar(e) {
	e.classList.remove('__bar-breaker__hidden')
}
