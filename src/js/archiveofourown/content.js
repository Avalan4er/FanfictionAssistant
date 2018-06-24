const siteId = 7

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
    $('li.work').each(function() {
        let fanficLink = $(this).attr('id')
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = $(createControlPlate(fanficInfo))
            .attr('style', 'float: right; margin: 30px 0 5px 5px; z-index: 999; position: relative;')
        $(this).prepend(controlPanel)
    })
}

function injectToFanficPage(repository) {
    let fanficLink = window.location.href
    if (!fanficLink.includes('works')) {
        return
    }

    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo).attr('style', 'float:right;')

    $('dl.work.meta.group').prepend(controlPlate)
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