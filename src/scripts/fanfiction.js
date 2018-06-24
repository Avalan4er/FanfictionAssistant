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

    $('.control_panel').on('click', '.plate.download', function() {
        $(this).children()[0].click()       
    })

    $('.marks').on('click', '.plate', function() {
        let plate = $(this)
        let parent = plate.closest('.control_panel')
        let fanficId = parent.attr('data-fanfic-id')
        let siteFanficId = parent.attr('data-site-fanfic-id')
        if (fanficId === undefined || fanficId == '') {
            console.log('Не найден идентификатор фанфика')
            return
        }
        
        let markId = this.id
        let isSelected = plate.hasClass('selected')

        chrome.runtime.sendMessage({
            fanficId: fanficId,
            action: isSelected ? 'remove' : 'add',
            siteId: 5,
            siteFanficId: siteFanficId,
            mark: markId
        }, function(response) {
            if (response.status == 'success')
            {
                if (isSelected) {
                    plate.removeClass('selected')
                } else {
                    plate.addClass('selected')
                }
            }
            if (response.status == 'no_fic') {
                parent.children()[0].click()  
            }
        })
    })
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