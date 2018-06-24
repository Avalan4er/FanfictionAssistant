/**
 * Репозиторий фанфиков
 */
class FanficRepository {
    /**
     * 
     * @param {Object} fanfics Словарь фанфиков в виде id : {default_id, site_id, mark}
     * @returns {FanficRepository}
     */
    constructor(fanfics){
        this.fanfics = fanfics
    }

    /**
     * Ищет в списке фанфиков п одходящий по идентификатору
     * @param {Number} siteId Идентификатор сайта
     * @param {String} siteFanficId Идентификатор фанфика на сайте
     * @returns {FanficDetails} Информация о фанфике
     */
    findBySiteFanficId(siteId = -1, siteFanficId = '') {
        let defaultFanfic = new FanficDetails(-1, siteId, siteFanficId, [])
        
        if (siteFanficId == '') return defaultFanfic
        if (siteId == -1) return defaultFanfic


        for (let id in this.fanfics) {
            let fanfic = this.fanfics[id]
            if (fanfic.site_id == siteId && fanfic.default_id == siteFanficId) {
                return new FanficDetails(id, siteId, siteFanficId, fanfic.mark.split(','))
            }
        }

        return defaultFanfic
    }

    /**
     * Обновляет метку в репозитории
     * @param {Number} fanficId Идентификатор фанфика
     * @param {Number} siteId Идентификатор сайта
     * @param {String} siteFanficId Идентификатор фанфика на сайте
     * @param {String} mark Метка
     * @param {String} action Действие над меткой (add, remove)
     */
    updateFanficMark(action, fanficId, siteId, siteFanficId, mark) {
        let fanfic = this.fanfics[fanficId]
        if (fanfic == null) {
            this.fanfics[fanficId] = {
                site_id: siteId,
                default_id: siteFanficId,
                mark: mark
            }
        } else {
            let marks = Object.values(fanfic.mark.split(','))
            if (action == 'add') {
                if (!marks.includes(mark)) {
                    marks.push(mark)
                }
            } else {
                var idx = marks.indexOf(mark)
                if (idx > -1) {
                    marks.splice(idx, 1)
                }
            }
            fanfic.mark = marks.join(',')
            this.fanfics[fanficId] = fanfic
        }
        
    }
}

/**
 * Информация о фанфике
 */
class FanficDetails {
    /**
     * Конструктор 
     * @param {Number} id Идентификатор фанфика в системе ФвФ
     * @param {Number} siteId Идентификатор сайта источника фанфика
     * @param {String} siteFanficId Идентификатор фанфика на сайте-источнике
     * @param {Array} marks Метки фанфика в системе ФвФ
     */
    constructor(id = -1, siteId = -1, siteFanficId = '', marks = []) {
        this.id = id
        this.siteId = siteId
        this.siteFanficId = siteFanficId
        this.marks = marks
    }
}