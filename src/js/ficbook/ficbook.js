chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }
    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(1)

    injectToSearch(repository)
    injectToFanficPage(repository)

    attachEventListeners()
})

function injectToSearch(repository) {
    let articles = document.querySelectorAll('article.block')
    for (let id in articles) {
        let article = articles[id]
        if (!(article instanceof Node)) {
            continue
        }

        let table = document.createElement('table')
        let tableBody = document.createElement('tbody')
        table.appendChild(tableBody)
        let row = document.createElement('tr')
        tableBody.appendChild(row)
        
        let articleCell = document.createElement('td')
        row.appendChild(articleCell)
        while (article.childNodes.length > 0) {
            articleCell.appendChild(article.childNodes[0])
        }
        
        article.appendChild(table)

        let controlPanelCell = document.createElement('td')
        row.appendChild(controlPanelCell)

        let fanficLink = article.querySelector('.visit-link').getAttribute('href')
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(1, siteFanficId)
        let controlPanel = createControlPlate(fanficInfo)
        let height = Number.parseInt(table.clientHeight)-35
        controlPanel.setAttribute('style', 'height: ' + height + 'px; margin: 35px -10px 0px 5px;')
        controlPanelCell.appendChild(controlPanel)
    }
}

function injectToFanficPage(repository) {
    let fanficLink = window.location.href
    if (!fanficLink.includes('readfic')) {
        return
    }

    let profile_top = document.querySelector('div.description')
    if (profile_top == null || !(profile_top instanceof Node)) {
        return
    }

    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(5, siteFanficId)
    let controlPlate = createControlPlate(fanficInfo)
    controlPlate.setAttribute('style', 'height: ' + profile_top.clientHeight + 'px')
    profile_top.appendChild(controlPlate)
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