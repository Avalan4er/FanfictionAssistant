var titles = document.querySelectorAll('.z-list')
chrome.storage.local.get(['fanfics'], function(result) {
    if (result.fanfics == undefined) {
        console.error("Ошибка - нет загруженых фанфиков")
        return
    }

    var repository = new FanficRepository(result.fanfics)
    for (var id in titles) {
        var title = titles[id]
        var fanficLink = title.querySelector('.stitle').getAttribute('href')
        var siteFanficId = getSiteFanficId(fanficLink)
        var fanficInfo = repository.getById(5, 'fanficLink')
        var controlPlate = createControlPlate(fanficInfo.Id, fanficInfo.siteId, fanficInfo.siteFanficId, fanficInfo.marks)
        title.insertBefore(controlPlate, title.lastChild)
    }
})


function getSiteFanficId(fanficLink) {
    return fanficLink.split('([0-9]{2,})')
}