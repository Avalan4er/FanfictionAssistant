let titles = document.querySelectorAll('.z-list')
chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }

    let repository = new FanficRepository(result.fanficsCache.data)
    for (let id in titles) {
        let title = titles[id]
        if (!(title instanceof Node)) {
            continue
        }

        let fanficLink = title.querySelector('.stitle').getAttribute('href')
        let siteFanficId = getSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(5, siteFanficId)
        let controlPlate = createControlPlate(fanficInfo)
        controlPlate.setAttribute('style', 'height: ' + title.clientHeight + 'px')
        title.insertBefore(controlPlate, title.lastChild)
    }
})


/**
 * Получает идентификатор фанфика из ссылки на фанфик
 * @param {String} fanficLink Ссылка на фанфик
 * @returns {String} Идентификатор фанфика
 */
function getSiteFanficId(fanficLink) {
    let matches = fanficLink.match('([0-9]{2,})')
    if (matches == null || matches.length < 1) {
        return ''
    }

    return matches[0]
}