const cacheRefreshPeriod = 1 * 60 * 1000
const cacheStorageKey = 'fanficsCache'

updateStorage()
periodicalyRunUpdate(cacheRefreshPeriod + 100)
console.log('Расширение Ассистент ФвФ загружено!')

/**
 * Периодически запускает обновление кэша
 * @param {Number} interval Интервал вызова обновления кэша в милисекундах
 */
function periodicalyRunUpdate(interval) {
    console.log('Период обновления кэша установлен на ' + cacheRefreshPeriod + 'мс')
    setInterval(updateStorage, interval)
}

/**
 * Обновляет метку в хранилище
 * @param {Number} fanficId Идентификатор фанфика
 * @param {Number} siteId Идентификатор сайта
 * @param {String} siteFanficId Идентификатор фанфика на сайте
 * @param {String} mark Метка
 * @param {String} action Действие над меткой (add, remove)
 */
function updateFanficMark(fanficId, siteId, siteFanficId, mark, action) {
    chrome.storage.local.get([cacheStorageKey], function(result) {
        if(chrome.runtime.lastError)
        {
            /* error */
            console.log('Кэш еще не создан. Создаю новый кэш.')
            refreshCache()
            return
        }

        let cache = result[cacheStorageKey]
        let repository = new FanficRepository(cache.data)
        repository.updateFanficMark(action, fanficId, siteId, siteFanficId, mark)
        cache.data = repository.fanfics

        let dto = {}
        dto[cacheStorageKey] = cache
        chrome.storage.local.set(dto, function() {
            console.log('Метка ' + mark + ' фанфика ' + fanficId + ' успешно ' + (action=='add'?'добавлена в хранилище':'удалена из хранилища'))
        })
    })
}

/**
 * Проверяет нужно ли обновлять кэш и обновляет если нужно
 */
function updateStorage() {
    chrome.storage.local.get([cacheStorageKey], function(result) {
        if(chrome.runtime.lastError)
        {
            /* error */
            console.log('Кэш еще не создан. Создаю новый кэш.')
            refreshCache()
            return
        }

        let cache = result[cacheStorageKey]
        if (shouldRefreshCache(cache)) {
            console.log('Кэш устарел. Обновляю кэш.')
            refreshCache()
        }
    })
}

/**
 * Проверяет нужно ли обновлять кэш 
 * @param {Object} cache Кэш фанфиков
 * @returns {Boolean}
 */
function shouldRefreshCache(cache) {
    if (cache == undefined || cache.updateTime == undefined) {
        return true
    }

    let currentTime = new Date()
    let cacheTime = new Date(cache.updateTime)
    if (!isValidDate(cacheTime)) {
        return true
    }
    return (currentTime > cacheTime.setMilliseconds(cacheRefreshPeriod)) 
}

/**
 * Запрашивает список фанфиков и сохраняет их в хранилище Chrome
 */
function refreshCache() {
    getUserFavorites(function(data) {
        let timestamp = + new Date()
        let cache = {
            updateTime: timestamp,
            data: data
        }

        let dto = {}
        dto[cacheStorageKey] = cache
        chrome.storage.local.set(dto, function() {
            console.log('Кэш избранного обновлен в ' + timestamp)
        })
    }, function(error) {
        if (error === 'bad auth') {
            alert('Прежде чем использовать Ассистент ФвФ, пожалуйста, авторизуйтесь на сайте fanfics.me.')
        }
        console.log(error)
    })
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d)
}