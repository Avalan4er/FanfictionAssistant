
const sites = {
    1:  { url:'http://ficbook.net', format:'' },
    2:  { url:'http://hogwartsnet.ru', format:'' },
    3:  { url:'http://snapetales.com', format:'' },
    4:  { url:'http://samlib.ru', format:'' },
    5:  { url:'https://www.fanfiction.net', format:'/s/{id}' },
    6:  { url:'http://fan-book.ru', format:'' },
    7:  { url:'https://archiveofourown.org', format:'' },
    8:  { url:'https://litnet.com', format:'' },
    9:  { url:'https://ranobelib.ru', format:'' },
    10: { url:'https://author.today', format:'' }
}

const marks = ['1', /*'2',*/ '3', '4', '5', '6', '7', '8', /*'9', 'a', 'b'*/]

/**
 * Прикрепляет хэндлеры событий кнопок
 */
function attachEventListeners() {
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
                // При успешном выполнении запроса мы 100% узнаем ID фанфика в системе ФвФ
                parent.attr('data-fanfic-id', response.fanficId)
                
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
}

/**
 * Создает панель управления метками
 * @param {FanficDetails} fanficDetails  Информация о фанфике
 * @returns {Node} HTML элемент панели управления метками
 */
function createControlPlate(fanficDetails) {
    let controlPlateContainer = document.createElement('span')
    controlPlateContainer.setAttribute('class', 'control_panel_container')

    let controlPanel = document.createElement('span')
    controlPanel.setAttribute('class', 'control_panel')
    controlPanel.setAttribute('data-fanfic-id', fanficDetails.id!=-1?fanficDetails.id:'no_id')
    controlPanel.setAttribute('data-site-fanfic-id', fanficDetails.siteFanficId)
    controlPlateContainer.appendChild(controlPanel)

    // Скачать
    let link = ''
    if (fanficDetails.id != -1) {
        link = getDownloadLinkByFtfId(fanficDetails.id)
    } else if (fanficDetails.siteId != -1 && fanficDetails.siteFanficId != '') {
        link = getDownloadLinkBySiteId(fanficDetails.siteId, fanficDetails.siteFanficId)
    }

    // Кнопка Добавить в...
    let linkPlate = createDownloadPlate(link)
    controlPanel.appendChild(linkPlate)

    // Список меток
    let marksList = document.createElement('ul')
    marksList.setAttribute('class', 'marks')
    controlPanel.appendChild(marksList)

    // Добавляем метки в список
    marks.forEach(mark => {
        let markPlate = createMarkPlate(mark, fanficDetails.marks.includes(mark))
        marksList.appendChild(markPlate)
    })

    return controlPlateContainer
}

/**
 * Создает HTML элемент отметки
 * @param {Number} markId идентификатор отметки
 * @param {Boolean} selected выбрана ли метка
 * @returns {Node} HTML элемент метки фанфика
 */
function createMarkPlate(markId, selected) {
    let markPlate = document.createElement('li')
    markPlate.setAttribute('class', 'plate type' + markId + (selected ? ' selected' : ''))
    markPlate.setAttribute('id', markId)
    return markPlate
}

/**
 * Создает элемент Скачать фанфик
 * @param {String} link Ссылка на ФвФ
 * @returns {Node} HTML элемент Скачать фанфик
 */
function createDownloadPlate(link) {
    let linkPlate = document.createElement('div')
    linkPlate.setAttribute('class', 'plate download')

    let linkHref = document.createElement('a')
    linkPlate.appendChild(linkHref)
    linkHref.setAttribute('href', link)
    linkHref.setAttribute('style', 'display: none;')
    linkHref.setAttribute('target', '_blank')

    let hrefText = document.createTextNode('Добавить в...')
    linkPlate.appendChild(hrefText)

    return linkPlate
}

/**
 * Формирует ссылку на фанфик в ФвФ
 * @param {Number} id Идентификатор фанфика в системе ФвФ
 * @returns {String} Ссылка на фанфик в ФвФ
 */
function getDownloadLinkByFtfId(id = -1) {
    if (id == -1) return ''

    return 'http://fanfics.me/ftf' + id
}

/**
 * Формирует ссылку на фанфик в ФвФ
 * @param {Number} siteId Идентификатор сайта
 * @param {String} siteFanficId Идентификатор фанфика на сайте
 * @returns {String} Ссылка на фанфик в ФвФ
 */
function getDownloadLinkBySiteId(siteId = -1, siteFanficId = '') {
    if (siteId == -1) return ''
    if (siteFanficId == '') return ''

    let site = sites[siteId]
    return 'http://fanfics.me/fictofile?url=' + site.url + site.format.replace('{id}', siteFanficId)
}
