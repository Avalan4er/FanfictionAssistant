
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
};

/**
 * Создает панель управления метками
 * @param {Object} fanficInfo  Информация о фанфике
 * @returns {Node} HTML элемент панели управления метками
 */
function createControlPlate(id = -1, siteId = -1, siteFanficId = '', marks = []) {
    var controlPlate = document.createElement('span')
    controlPlate.setAttribute('class', 'control_plate')

    if (marks != null) {
        for (var mark in marks) {
            var markPlate = createMarkPlate(mark)
            controlPlate.appendChild(markPlate)
        }    
    }

    var link = ''
    if (id != -1) {
        link = getDownloadLinkByFtfId(id)
    } else if (siteId != -1 && siteFanficId != '') {
        link = getDownloadLinkBySiteId(siteId, siteFanficId)
    }

    var linkPlate = createDownloadPlate(link)
    controlPlate.appendChild(linkPlate)

    return controlPlate
}

/**
 * Создает HTML элемент отметки
 * @param {Number} markId идентификатор отметки
 * @returns {Node} HTML элемент метки фанфика
 */
function createMarkPlate(markId) {
    var markPlate = document.createElement('span')
    markPlate.setAttribute('class', 'plate type' + markId)
    return markPlate
}

/**
 * Создает элемент Скачать фанфик
 * @param {String} link Ссылка на ФвФ
 * @returns {Node} HTML элемент Скачать фанфик
 */
function createDownloadPlate(link) {
    var linkPlate = document.createElement('span')
    linkPlate.setAttribute('class', 'plate download')

    var linkHref = document.createElement("a");
    linkHref.setAttribute('href', 'http://fanfics.me/fictofile?url='+link)
    linkHref.setAttribute('target', '_blank')
    var hrefText = document.createTextNode('Скачать')
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
    if (id == -1) return '';

    return 'http://fanfics.me/ftf' + id
}

/**
 * Формирует ссылку на фанфик в ФвФ
 * @param {Number} siteId Идентификатор сайта
 * @param {String} siteFanficId Идентификатор фанфика на сайте
 * @returns {String} Ссылка на фанфик в ФвФ
 */
function getDownloadLinkBySiteId(siteId = -1, siteFanficId = '') {
    if (siteId == -1) return '';
    if (siteFanficId == '') return '';

    var site = sites[siteId]
    return 'http://fanfics.me/fictofile?url=' + site.url + site.format.replace('{id}', siteFanficId)
}
