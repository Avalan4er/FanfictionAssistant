const getUserFavoritesUrl = 'http://fanfics.me/api.php?action=member_favorite_ftf_list'
const getFanficIdUrl = 'http://fanfics.me/api.php?action=ftf_check&site_id={siteId}&default_id={siteFanficId}'
const addFavoriteMarkUrl = 'http://fanfics.me/api.php?action=member_favorite_mark_add&fic_type=ftf&fic_id={fanficId}&mark={mark}'
const deleteFavoriteMarkUrl = 'http://fanfics.me/api.php?action=member_favorite_mark_del&fic_type=ftf&fic_id={fanficId}&mark={mark}'

/**
 * Запрашивает избранное пользователя
 * @param {Function} successCallback Метод выполнится при успешном запросе
 * @param {Function} failCallback Метод выполнится при ошибке запроса
 */
function getUserFavorites(successCallback, failCallback) {
    executeRequest(getUserFavoritesUrl, successCallback, failCallback)
}

/**
 * Запрашивает идентификатор фанфика в системе ФвФ по идентификатору сайта и идентификатору фанфика с сайта
 * @param {Number} siteId Идентификатор сайта
 * @param {String} siteFanficId Идентификатор фанфика на сайте
 * @param {Function} successCallback Метод вызывается при успешном запросе
 * @param {Function} failCallback Метод вызывается при ошибке запроса
 */
function getFanficId(siteId, siteFanficId, successCallback, failCallback) {
    if (siteId === undefined || siteFanficId === undefined) {
        if (failCallback !== undefined) {
            failCallback('Неверные аргументы')
        }
        return
    }

    let request = getFanficIdUrl.replace('{siteId}', siteId).replace('{siteFanficId}',  siteFanficId)
    executeRequest(request, successCallback, failCallback)
}

/**
 * Добавляет отметку на фанфик
 * @param {String} fanficId Идентификатор фанфика
 * @param {String} mark Метка фанфика
 * @param {Function} successCallback Метод вызывается при успешном запросе
 * @param {Function} failCallback Метод вызывается при ошибке запроса
 */
function addFavoriteMark(fanficId, mark, successCallback, failCallback) {
    if (fanficId === undefined || mark === undefined) {
        if (failCallback !== undefined) {
            failCallback('Неверные аргументы')
        }
        return
    }

    let request = addFavoriteMarkUrl.replace('{fanficId}', fanficId).replace('{mark}', mark)
    executeRequest(request, successCallback, failCallback)
}

/**
 * Удаляет отметку с фанфика
 * @param {String} fanficId Идентификатор фанфика
 * @param {String} mark Метка фанфика
 * @param {Function} successCallback Метод вызывается при успешном запросе
 * @param {Function} failCallback Метод вызывается при ошибке запроса
 */
function deleteFavoriteMark(fanficId, mark, successCallback, failCallback) {
    if (fanficId === undefined || mark === undefined) {
        if (failCallback !== undefined) {
            failCallback('Неверные аргументы')
        }
        return
    }

    let request = deleteFavoriteMarkUrl.replace('{fanficId}', fanficId).replace('{mark}', mark)
    executeRequest(request, successCallback, failCallback)
}

/**
 * Выполняет запрос
 * @param {String} url Адрес запроса
 * @param {Function} successCallback Метод выполняется при успешном запросе
 * @param {Function} failCallback Метод выполняется при ошибке запроса
 */
function executeRequest(url, successCallback, failCallback) {
    console.log('Отправляю запрос системе ФвФ: ', url)
    $.get({
        url: url,
        xhrFields: { withCredentials: true }
    }, function(data, status) {
        if (status == 'success') {
            if (successCallback !== undefined) {
                successCallback(data)
            }
        } else {
            if (failCallback !== undefined) {
                failCallback(data.error)
            }
        }
    }).fail(function() {
        if (failCallback !== undefined) {
            failCallback('Ошибка выполнения запроса: ' + url)
        }
    })
}