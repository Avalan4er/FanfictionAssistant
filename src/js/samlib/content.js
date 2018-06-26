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
    $('dd').find('dl').each(function() {
        
        let siteFanficId = $(this).find('li').children('a').last().attr('href')
        if (siteFanficId == null) return true;
        siteFanficId = siteFanficId.substring(1, siteFanficId.length)
        
        let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
        let controlPanel = createControlPlate(fanficInfo)

        $(this).find('dt').first().wrap('<table><tbody><tr><td/>')
        $(this).find('tr').prepend(
            $('<td/>').attr('style', 'vertical-align: top').append(
                controlPanel
            )
        )
    })
}

function injectToFanficPage(repository) {
    let td = $('select[name="BALL"]').closest('td').first()
    if (td == null) {
        return
    }

    let siteFanficId = window.location.pathname.substring(1, window.location.pathname.length)
    let fanficInfo = repository.findBySiteFanficId(siteId, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)

    td.attr('valign', 'top').prepend(
        controlPlate.attr('style', 'text-align: left')
    )
}