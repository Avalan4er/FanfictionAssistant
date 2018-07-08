const siteId = 10

chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }
    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(siteId)

    injectToSearch(repository)
    injectToFanficPage(repository)
})

function injectToSearch(repository) {
    $('div.book-row').each(function() {
        
        let fanficLink = $(this).find('div.book-title').children('a').first().attr('href')
        if (fanficLink == null) return true

        let siteFanficId = parseSiteFanficId(fanficLink)

        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = createControlPlate(fanficInfo)

        $(this).append(
            controlPanel.attr('style', 'margin: 5px 0px 0px 15px;')
        )
    })
}

function injectToFanficPage(repository) {
    let bookActionPanel = $('div.book-action-panel')
    if (bookActionPanel == null) {
        return
    }

    let fanficLink = window.location.pathname.substring(1)
    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)

    bookActionPanel.append(
        controlPlate
    )
}

/**
 * Получает идентификатор фанфика из ссылки на фанфик
 * @param {String} fanficLink Ссылка на фанфик
 * @returns {String} Идентификатор фанфика
 */
function parseSiteFanficId(fanficLink) {
    let matches = fanficLink.match('([0-9]{2,})')
    if (matches == null || matches.length < 1) {
        return ''
    }

    return matches[0]
}