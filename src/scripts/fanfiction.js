import {FanficRepository} from 'fanficRepository'
import {createControlPlate} from 'utils'

var titles = document.querySelectorAll('.z-list')
chrome.storage.local.get(['fanfics'], function(result) {
    if (result.fanfics == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }

    var repository = new FanficRepository(result.fanfics)
    for (var id in titles) {
        var title = titles[id]
        var fanficLink = title.querySelector('.stitle').getAttribute('href')
        var siteFanficId = getSiteFanficId(fanficLink)
        var fanficInfo = repository.findBySiteFanficId(5, siteFanficId)
        var controlPlate = createControlPlate(fanficInfo)
        title.insertBefore(controlPlate, title.lastChild)
    }
})


/**
 * Получает идентификатор фанфика из ссылки на фанфик
 * @param {String} fanficLink Ссылка на фанфик
 * @returns {String} Идентификатор фанфика
 */
function getSiteFanficId(fanficLink) {
    var matches = fanficLink.match('([0-9]{2,})')
    if (matches == null || matches.length < 1) {
        return ''
    }

    return matches[0]
}