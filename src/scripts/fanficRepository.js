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
     * Ищет в списке фанфиков подходящий по идентификатору
     * @param {Number} siteId Идентификатор сайта
     * @param {String} siteFanficId Идентификатор фанфика на сайте
     * @returns {Object} {id, siteId, siteFanficId, marks}
     */
    getById(siteId = -1, siteFanficId = '') {
        var defaultFanfic = {
            id: -1,
            siteId: siteId,
            siteFanficId: siteFanficId,
            marks: []
        };
        
        if (siteFanficId == '') return defaultFanfic;
        if (siteId == -1) return defaultFanfic;


        for (var id in this.fanfics) {
            var fanfic = this.fanfics[id]
            if (fanfic.site_id == siteId && fanfic.default_id == siteFanficId) {
                return {
                    id: id,
                    siteId: siteId,
                    siteFanficId: siteFanficId,
                    marks: fanfic.mark.split(',')
                }
            }
        }

        return defaultFanfic
    }
}