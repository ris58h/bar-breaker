const puppeteer = require('puppeteer')
const parseUrl = require('url').parse
const assert = require('assert').strict


describe('e2e', () => {
    let browser

    before(async () => {
        const pathToExtension = process.cwd() + '/extension'
        browser = await puppeteer.launch({
            headless: false, // Chrome Headless doesn't support extensions. https://github.com/GoogleChrome/puppeteer/issues/659
            args: [
                '--no-sandbox',
                '--disable-extensions-except=' + pathToExtension,
                '--load-extension=' + pathToExtension,
                '--mute-audio'
            ]
        })
    })

    //TODO: cookies
    describe('www.ft.com', () => {
        let page

        before(async () => {
            page = await createPage('https://www.ft.com')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, 'header.o-header--sticky')
        })

        after(async () => {
            await page.close()
        })
    })

    //TODO fixed header after scroll down. Is it still here ?????
    describe('livejournal.com', () => {
        let page

        before(async () => {
            page = await createPage('https://sergeytsvetkov.livejournal.com/816658.html')
        })

        it('fixed footer', async () => {
            await assertDisplayNone(page, '.b-discoverytimes-wrapper')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('medium.com', () => {
        let page

        before(async () => {
            page = await createPage('https://medium.com/s/story/let-the-robots-take-your-job-150e5e7d694f')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, '.metabar')
        })

        it.skip('fixed footer', async () => {
            await page.waitFor('.postMeterBar')
            await assertDisplayNone(page, '.postMeterBar')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('www.planetary.org', () => {
        let page

        before(async () => {
            page = await createPage('http://www.planetary.org')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, 'header.topheader')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('www.polygon.com', () => {
        let page

        before(async () => {
            page = await createPage('https://www.polygon.com/')
        })

        it('privacy bar at bottom', async () => {
            await assertDisplayNone(page, '#privacy-consent')
        })

        after(async () => {
            await page.close()
        })
    })

    after(() => {
        browser.close()
    })

    async function testHeaderAfterScroll(page, selector) {
        try {
            await page.evaluate(() => { window.scrollBy(0, window.innerHeight) });
            await page.waitFor(100) //TODO
            await assertDisplayNone(page, selector)
        } finally {
            await page.evaluate(() => { window.scrollTo(0, 0) });
        }
    }

    async function assertDisplayNone(page, selector) {
        const display = await page.$eval(selector, e => getComputedStyle(e).display)
        assert.equal(display, 'none')
    }

    async function createPage(url) {
        const page = await browser.newPage()
        await page.setRequestInterception(true)
        page.on('request', request => {
            if (isImageUrl(request.url()) || isFontUrl(request.url())) {
                request.abort()
            } else {
                request.continue()
            }
        })
        await page.goto(url)
        return page
    }

    function isImageUrl(url) {
        const pathname = parseUrl(url).pathname
        if (!pathname) {
            return false
        }
        return pathname.endsWith('.png')
            || pathname.endsWith('.jpg')
            || pathname.endsWith('.jpeg')
            || pathname.endsWith('.gif')
            || pathname.endsWith('.svg')
    }

    function isFontUrl(url) {
        const pathname = parseUrl(url).pathname
        if (!pathname) {
            return false
        }
        return pathname.endsWith('.woff')
            || pathname.endsWith('.woff2')
    }
})