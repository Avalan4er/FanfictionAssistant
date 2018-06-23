
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

/**
 * Создает панель управления метками
 * @param {FanficDetails} fanficDetails  Информация о фанфике
 * @returns {Node} HTML элемент панели управления метками
 */
function createControlPlate(fanficDetails) {
    let controlPlate = document.createElement('span')
    controlPlate.setAttribute('class', 'control_plate')

    // Скачать
    let link = ''
    if (fanficDetails.id != -1) {
        link = getDownloadLinkByFtfId(fanficDetails.id)
    } else if (fanficDetails.siteId != -1 && fanficDetails.siteFanficId != '') {
        link = getDownloadLinkBySiteId(fanficDetails.siteId, fanficDetails.siteFanficId)
    }

    let linkPlate = createDownloadPlate(link)
    controlPlate.appendChild(linkPlate)

    // Список меток
    if (fanficDetails.marks != null) {
        let marksList = document.createElement('ul')
        marksList.setAttribute('class', 'marks')
        controlPlate.appendChild(marksList)

        for (let index in fanficDetails.marks) {
            let mark = fanficDetails.marks[index]
            let markPlate = createMarkPlate(mark)
            marksList.appendChild(markPlate)
        }    
    }

    return controlPlate
}

/**
 * Создает HTML элемент отметки
 * @param {Number} markId идентификатор отметки
 * @returns {Node} HTML элемент метки фанфика
 */
function createMarkPlate(markId) {
    let markPlate = document.createElement('li')
    markPlate.setAttribute('class', 'plate type' + markId)
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
    linkHref.setAttribute('href', link)
    linkHref.setAttribute('target', '_blank')
    let hrefText = document.createTextNode('Скачать')
    linkHref.appendChild(hrefText)

    linkPlate.appendChild(linkHref)

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
