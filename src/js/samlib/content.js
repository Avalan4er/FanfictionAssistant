const siteId = 4

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
    $('a[title="читать фик"]').each(function() {
        
        let fanficLink = $(this).attr('href')
        
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = createControlPlate(fanficInfo)
        
        $(this).closest('tr').next().append(
            $('<td/>').attr('style', 'vertical-align: top;').append(controlPanel)
        )
    })
}

function injectToFanficPage(repository) {
    let td = $('select[name="BALL"]').closest('td')
    if (td == null) {
        return
    }

    let siteFanficId = window.location.pathname.substring(1, window.location.pathname.length - 1)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)

    td.prepend(
        controlPlate.attr('style', 'text-align: left')
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