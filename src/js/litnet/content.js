const siteId = 8

chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }
    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(siteId)

    injectToList(repository)
    injectToSearch(repository)
    injectToFanficPage(repository)
})

function injectToList(repository) {
    $('div.book-item').each(function() {
        let fanficLink = $(this).find('.book-title').find('a').first().attr('href')

        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = createControlPlate(fanficInfo)

        $(this).prepend(
            controlPanel.attr('style', 'float: right;')
        )
    })
}

function injectToSearch(repository) {
    $('div.l-container').find('ul').first().find('li').each(function() {
        if ($(this).find('span').text() == 'Книга') {
            let fanficLink = $(this).find('a').attr('href')
            
            let siteFanficId = parseSiteFanficId(fanficLink)
            let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
            let controlPanel = createControlPlate(fanficInfo)
            
            $(this).append(
                controlPanel,
                $('<br>')
            )
        }
    })
}

function injectToFanficPage(repository) {
    let container = $('div.book-view-box').closest('.content')
    if (container == null) return

    let fanficLink = window.location.pathname.substring(1)
    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo).attr('style', 'float: left; margin-left: 20px;')

    controlPlate.insertAfter(container)
}

/**
 * Получает идентификатор фанфика из ссылки на фанфик
 * @param {String} fanficLink Ссылка на фанфик
 * @returns {String} Идентификатор фанфика
 */
function parseSiteFanficId(fanficLink) {
    return fanficLink.split('/').reverse()[0]
}