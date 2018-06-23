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