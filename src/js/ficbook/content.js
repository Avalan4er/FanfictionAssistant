const siteId = 1

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
    $('article.block').each(function() {
        let fanficLink = $(this).find('.visit-link').attr('href')
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = $('<td style="vertical-align: top;"/>').append(
            createControlPlate(fanficInfo)
                .attr('style', 'margin: 40px -10px 0 5px; float: right;')
        )

        $(this).children().wrapAll('<td class="article-content"/>')
        $(this).append(
            $('<table style="width: 100%;"/>').append(
                $('<tbody/>').append(
                    $('<tr/>').append([
                        $(this).find('.article-content'),
                        controlPanel
                    ])
                )
            )
        )
    })
}

function injectToFanficPage(repository) {
    let fanficLink = window.location.href
    if (!fanficLink.includes('readfic')) {
        return
    }

    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)

    $('div.description').append(controlPlate.attr('style', 'margin: 10px 0 0 -5px'))
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