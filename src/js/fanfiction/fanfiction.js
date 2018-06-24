chrome.storage.local.get(['fanficsCache'], function(result) {
    if (result.fanficsCache == undefined) {
        console.error('Ошибка - нет загруженых фанфиков')
        return
    }

    let repository = new FanficRepository(result.fanficsCache.data)
    repository.clearAllExeptForSite(5)

    injectToSearchResults(repository)
    injectToFanficPage(repository)
    attachEventListeners()
})

/**
 * Вставляет панель управление в список фанфиков
 * @param {FanficRepository} repository Репозиторий с сфанфиками
 */
function injectToSearchResults(repository) {
    let titles = document.querySelectorAll('.z-list')
    for (let id in titles) {
        let title = titles[id]
        if (!(title instanceof Node)) {
            continue
        }

        let fanficLink = title.querySelector('.stitle').getAttribute('href')
        let siteFanficId = parseSiteFanficId(fanficLink)
        let fanficInfo = repository.findBySiteFanficId(5, siteFanficId)
        let controlPlate = createControlPlate(fanficInfo)
        controlPlate.setAttribute('style', 'height: ' + title.clientHeight + 'px')
        title.insertBefore(controlPlate, title.lastChild)
    }
}

/**
 * Вставляет панель управления в страницу фанфика
 * @param {FanficRepository} repository Репозиторий фанфиков
 */
function injectToFanficPage(repository) {
    let profile_top = document.getElementById('profile_top')
    if (profile_top == null || !(profile_top instanceof Node)) {
        return
    }

    let table = document.createElement('table')
    let tbody = document.createElement('tbody')
    table.appendChild(tbody)

    let row = document.createElement('tr')
    tbody.appendChild(row)

    let infoCell = document.createElement('td')
    row.appendChild(infoCell)

    while (profile_top.childNodes.length > 0) {
        infoCell.appendChild(profile_top.childNodes[0])
    }
    profile_top.appendChild(table)

    let controlPanelCell = document.createElement('td')
    row.appendChild(controlPanelCell)

    let followBtn = infoCell.querySelector('button.btn')
    controlPanelCell.appendChild(followBtn)


    let fanficLink = window.location.href
    let siteFanficId = parseSiteFanficId(fanficLink)
    let fanficInfo = repository.findBySiteFanficId(5, siteFanficId)
    let controlPanel = createControlPlate(fanficInfo)
    let height = table.clientHeight - followBtn.clientHeight - 5
    controlPanel.setAttribute('style', 'height: ' + height + 'px; margin: 5px 15px 0 5px;')
    controlPanelCell.appendChild(controlPanel)
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