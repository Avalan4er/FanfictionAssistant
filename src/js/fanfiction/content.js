const siteId = 5

chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }

    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(siteId)

    injectToSearchResults(repository)
    injectToFanficPage(repository)
})

/**
 * Вставляет панель управление в список фанфиков
 * @param {FanficRepository} repository Репозиторий с сфанфиками
 */
function injectToSearchResults(repository) {
    $('.z-list').each(function() {
        let fanficLink = $(this).find('.stitle').attr('href')
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPlate = createControlPlate(fanficInfo)
        controlPlate.attr('style', 'float: right;')

        controlPlate.insertAfter($(this).find('a').last())
    })
}

/**
 * Вставляет панель управления в страницу фанфика
 * @param {FanficRepository} repository Репозиторий фанфиков
 */
function injectToFanficPage(repository) {
    let fanficLink = window.location.href
    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPanel = createControlPlate(fanficInfo)

    $('#profile_top').find('button.btn').removeClass('pull-right').wrap($('<span/>', { 'class': 'control-panel-container pull-right', 'style': 'margin: 5px'}))
    $(controlPanel).appendTo('span.control-panel-container')
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