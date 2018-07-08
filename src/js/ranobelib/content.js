const siteId = 9

chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }
    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(siteId)

    injectToFanficPage(repository)
})

function injectToFanficPage(repository) {
    let itemInformation = $('div.item__information').find('div.row')
    if (itemInformation == null) {
        return
    }

    let siteFanficId = window.location.pathname.slice(1, -1)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)

    itemInformation.append(
        controlPlate.attr('style', 'float: left; margin: 10px 0px 0px 15px;')
    )
}