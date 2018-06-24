const siteId = 3

chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }
    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(siteId)

    $('strong:contains("Статус")').closest('tr').append(
        $('<td/>').append(
            $('<strong/>').text('ФвФ')
        )
    )
    $('td[colspan="8"]').attr('colspan', '9')

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
            $('<td/>').attr('style', 'vertical-align: middle;').append(
                controlPanel.attr('style', 'margin: auto;')
            )
        )
    })
}

function injectToFanficPage(repository) {
    let fanficLink = window.location.href
    if (!fanficLink.includes('fic_id')) {
        return
    }

    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo).attr('style', 'text-align: left;')

    let row = $('h3').closest('tr').parent().closest('tr')
    row.append(
        $('<td/>').attr('style', 'vertical-align:top').append(
            controlPlate.attr('style', 'float: right; margin: 5px 0 0 0')
        )
    )
    row.children().first().attr('colspan', '3')
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