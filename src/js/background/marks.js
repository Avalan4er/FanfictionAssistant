chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.fanficId === undefined) {
            return false
        }

        console.log('Принято сообщение от контент скрипта: ' + JSON.stringify(request))

        // Фанфик известен
        if (request.fanficId != 'no_id') {
            console.log('Идентификатор фанфика известен')
            changeFavoriteMark(request.fanficId, request.mark, request.action, sendResponse)
            updateFanficMark(request.fanficId, request.siteId, request.siteFanficId, request.mark, request.action)
        } else { // Id фанфика нужно запросить
            console.log('Идентификатор фанфика неизвестен, запрашиваю идентификатор фанфика')
            getFanficId(request.siteId, request.siteFanficId, function(data) {
                // Пустые данные
                if (data == null) {
                    console.log('Система ФвФ ответила пустыми данными')
                    sendResponse({status: 'error', message: 'Ошибка запроса идентификатора фанфика'})
                }

                // Идентификатор в наличии
                else if (data.fic_id != null) {
                    console.log('Идентификатор фанфика получен: ', data.fic_id)
                    changeFavoriteMark(data.fic_id, request.mark, request.action, sendResponse)
                    updateFanficMark(data.fic_id, request.siteId, request.siteFanficId, request.mark, request.action)
                }

                // Ошибка в наличии
                else if (data.error == 'no fic') {
                    console.log('Фанфик не добавлен в систему ФвФ, оповещаю клиента о необходимости добавить фанфик')
                    sendResponse({status: 'no_fic', message: 'Фанфик не добавлен на сайт'})
                }

                // Непонятно что произошло
                else {
                    console.log('Не удалось распознать ответ от системы ФвФ.', data)
                }
            }, function(error) {
                sendResponse({status: 'error', message: error})
            })
        }



        return true
    })

function changeFavoriteMark(fanficId, mark, action, sendResponse) {
    console.log('Отправляю запрос на смену метки фанфика')
    if (action == 'add') {
        addFavoriteMark(fanficId, mark, function() {
            console.log('Метка ' + mark + ' фанфика ' + fanficId + ' успешно добавлена в систему ФвФ')
            sendResponse({status: 'success', fanficId: fanficId })
        }, function(message) {
            console.log('Ошибка добавления метки: ' + message !== undefined?message:'')
            sendResponse({status: 'error', message: message})
        })
    } else {
        deleteFavoriteMark(fanficId, mark, function() {
            console.log('Метка ' + mark + ' фанфика ' + fanficId + ' успешно удалена из системы ФвФ')
            sendResponse({status: 'success', fanficId: fanficId })
        }, function(message) {
            console.log('Ошибка добавления метки: ' + message !== undefined?message:'')
            sendResponse({status: 'error', message: message})
        })
    }
}