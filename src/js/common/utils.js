
const sites = {
    1:  { url:'http://ficbook.net', format:'/readfic/{id}' },
    2:  { url:'http://hogwartsnet.ru', format:'/mfanf/ffshowfic.php?fid={id}' },
    3:  { url:'http://snapetales.com', format:'/index.php?fic_id={id}' },
    4:  { url:'http://samlib.ru', format:'/{id}' },
    5:  { url:'https://www.fanfiction.net', format:'/s/{id}' },
    //6:  { url:'http://fan-book.ru', format:'' },
    7:  { url:'https://archiveofourown.org', format:'/works/{id}' },
    //8:  { url:'https://litnet.com', format:'' },
    9:  { url:'https://ranobelib.ru', format:'' },
    10: { url:'https://author.today', format:'' }
}

const marks = ['1', /*'2',*/ '3', '4', '5', '6', '7', '8', /*'9', 'a', 'b'*/]

/**
 * Создает панель управления метками
 * @param {FanficDetails} fanficDetails  Информация о фанфике
 * @returns {Node} HTML элемент панели управления метками
 */
function createControlPlate(fanficDetails) {
    let downloadLink = ''
    if (fanficDetails.id != -1) {
        downloadLink = getDownloadLinkByFtfId(fanficDetails.id)
    } else if (fanficDetails.siteId != -1 && fanficDetails.siteFanficId != '') {
        downloadLink = getDownloadLinkBySiteId(fanficDetails.siteId, fanficDetails.siteFanficId)
    }


    var controlPlateContainer = $('<div/>', {
        'class': 'control_panel',
        'data-fanfic-id': fanficDetails.id!=-1?fanficDetails.id:'no_id',
        'data-site-id': fanficDetails.siteId,
        'data-site-fanfic-id': fanficDetails.siteFanficId
    })

    let listOfAllMarks = $('<div/>')
        .addClass('marks-list marks-all')
        .append(createDownloadPlate(downloadLink))
    marks.forEach(mark => {
        let markPlate = createMarkPlate(mark, fanficDetails.marks.includes(mark))
        $(markPlate).click(markPlateClick)
        listOfAllMarks.append(markPlate)
    })
    controlPlateContainer.append(listOfAllMarks)

    let listOfSelectedMarks = $('<div/>')
        .addClass('marks-list marks-selected')
        .append(createDownloadPlate(downloadLink))
    marks.forEach(mark => {
        let markPlate = createMarkPlate(mark, fanficDetails.marks.includes(mark))
        listOfSelectedMarks.append(markPlate)
    })
    controlPlateContainer.append(listOfSelectedMarks)

    return controlPlateContainer
}

function markPlateClick() {
    let plate = $(this)
    let controlPanel = plate.closest('.control_panel')
    let fanficId = controlPanel.attr('data-fanfic-id')
    let siteId = controlPanel.attr('data-site-id')
    let siteFanficId = controlPanel.attr('data-site-fanfic-id')
    if (fanficId === undefined || fanficId == '') {
        console.log('Не найден идентификатор фанфика')
        return
    }
    
    let markId = this.id
    let isSelected = plate.hasClass('selected')

    chrome.runtime.sendMessage({
        fanficId: fanficId,
        action: isSelected ? 'remove' : 'add',
        siteId: siteId,
        siteFanficId: siteFanficId,
        mark: markId
    }, function(response) {
        if (response.status == 'success')
        {
            // При успешном выполнении запроса мы 100% узнаем ID фанфика в системе ФвФ
            controlPanel.attr('data-fanfic-id', response.fanficId)
            plate.toggleClass('selected')
            controlPanel.find('.marks-selected > .type'+markId).toggleClass('selected')
        }
        if (response.status == 'no_fic') {
            controlPanel.find('.download').first().click()  
        }
    })
}

/**
 * Создает HTML элемент отметки
 * @param {Number} markId идентификатор отметки
 * @param {Boolean} selected выбрана ли метка
 * @returns {Node} HTML элемент метки фанфика
 */
function createMarkPlate(markId, selected) {
    return $('<div/>', {
        'class': 'plate type' + markId + (selected ? ' selected' : ''),
        'id': markId
    })
}

/**
 * Создает элемент Скачать фанфик
 * @param {String} link Ссылка на ФвФ
 * @returns {Node} HTML элемент Скачать фанфик
 */
function createDownloadPlate(link) {
    let $linkPlate = $('<div/>', { 'class': 'plate download selected' })
    $('<a>', {
        'href': link,
        'style': 'display: none;',
        'target': '_blank'
    }).appendTo($linkPlate)

    $linkPlate.click(function() {
        $(this).children()[0].click()   
    })

    return $linkPlate
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