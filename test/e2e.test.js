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

    //TODO fix it
    describe.skip('awwwards.com', () => {
        let page

        before(async () => {
            page = await createPage('https://www.awwwards.com/')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, '#header')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('blog.gradle.org', () => {
        let page

        before(async () => {
            page = await createPage('https://blog.gradle.org/')
        })

        it('cookies footer', async () => {
            await assertDisplayStyleIsNone(page, 'cloudflare-app')
        })

        after(async () => {
            await page.close()
        })
    })

    //TODO: cookies
    describe('ft.com', () => {
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
            await assertDisplayStyleIsNone(page, '.b-discoverytimes-wrapper')
        })

        after(async () => {
            await page.close()
        })
    })

    describe.skip('marketplace.visualstudio.com', () => {
        let page

        before(async () => {
            page = await createPage('https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, ['#section-banner', "[role='tablist']"])
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
            await assertDisplayStyleIsNone(page, '.postMeterBar')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('planetary.org', () => {
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

    describe('polygon.com', () => {
        let page

        before(async () => {
            page = await createPage('https://www.polygon.com/')
        })

        it('privacy bar at bottom', async () => {
            await assertDisplayStyleIsNone(page, '#privacy-consent')
        })

        after(async () => {
            await page.close()
        })
    })

    //TODO footer
    describe('quora.com', () => {
        let page

        before(async () => {
            page = await createPage('https://www.quora.com/Are-2-in-1-laptops-worth-buying')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, '.SiteHeader')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('rbc.ru', () => {
        describe('main page', () => {
            let page

            before(async () => {
                page = await createPage('https://www.rbc.ru')
            })

            it('fixed header', async () => {
                await testHeaderAfterScroll(page, [
                    '.live-tv__overlay__big_close',
                    '.checkad_info',
                    '.topline.fixed'
                ])
            })

            after(async () => {
                await page.close()
            })
        })

        describe('article page', () => {
            let page

            before(async () => {
                page = await createPage('https://www.rbc.ru/spb_sz/25/09/2018/5baa0ac89a7947decf7446ab')
            })

            it("bar-breaker should be disabled", async () => {
                await page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
                await assertDisplayStyleIsNotNone(page, '.rbcslider')
            })

            after(async () => {
                await page.close()
            })
        })
    })

    describe('reddit.com', () => {
        let page

        before(async () => {
            page = await createPage('https://new.reddit.com')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, 'header')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('stackoverflow.com', () => {
        let page

        before(async () => {
            page = await createPage('https://stackoverflow.com/')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, 'header.top-bar')
        })

        after(async () => {
            await page.close()
        })
    })

    //TODO fix it
    describe.skip('stokedrideshop.com', () => {
        let page

        before(async () => {
            page = await createPage('https://stokedrideshop.com/')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, 'header.site-header', 50)
        })

        after(async () => {
            await page.close()
        })
    })

    describe('techadvisor.co.uk', () => {
        let page

        before(async () => {
            page = await createPage('https://www.techadvisor.co.uk/')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, ['#topNav', '#subHeader'])
        })

        after(async () => {
            await page.close()
        })
    })

    describe('twitter.com', () => {
        let page

        before(async () => {
            page = await createPage('https://twitter.com/Blizzard_Ent/status/968727468675809280')
        })

        it("fullscreen popup shouldn't be broken " , async () => {
            await page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
            await assertDisplayStyleIsNotNone(page, '#permalink-overlay')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('vc.ru', () => {
        let page

        before(async () => {
            page = await createPage('https://vc.ru/hr/45373-cifry-srednyaya-zarplata-molodyh-specialistov-v-rossii-po-ocenke-sberbanka')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, '.main_menu')
        })

        it('sticky header in comments section', async () => {
            await page.$eval('.comments__item:first-child', e => e.scrollIntoView())
            const position = await page.$eval('.comments__navigation', e => getComputedStyle(e).position)
            assert.equal(position, 'static')
        })

        after(async () => {
            await page.close()
        })
    })

    describe('youtube.com', () => {
        let page

        before(async () => {
            page = await createPage('https://youtube.com')
        })

        it('fixed header', async () => {
            await testHeaderAfterScroll(page, '#masthead-container')
        })

        after(async () => {
            await page.close()
        })
    })

    after(() => {
        browser.close()
    })

    async function testHeaderAfterScroll(page, selector) {
        await assertDisplayStyleIsNotNone(page, selector)
        await page.evaluate(() => { window.scrollBy(0, window.innerHeight) })
        try {
            await page.waitFor(50) //TODO
            if (selector instanceof Array) {
                for (const s of selector) {
                    await assertDisplayStyleIsNone(page, s)
                }
            } else {
                await assertDisplayStyleIsNone(page, selector)
            }
        } finally {
            await page.evaluate(() => { window.scrollBy(0, -window.innerHeight) })
        }
        await page.waitFor(50) //TODO
        if (selector instanceof Array) {
            for (const s of selector) {
                await assertDisplayStyleIsNotNone(page, s)
            }
        } else {
            await assertDisplayStyleIsNotNone(page, selector)
        }
    }

    async function getDisplayStyle(page, selector) {
        return await page.$eval(selector, e => getComputedStyle(e).display)
    }

    async function assertDisplayStyleIsNone(page, selector) {
        const display = await getDisplayStyle(page, selector)
        assert.equal(display, 'none')
    }

    async function assertDisplayStyleIsNotNone(page, selector) {
        const display = await getDisplayStyle(page, selector)
        assert.notEqual(display, 'none')
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