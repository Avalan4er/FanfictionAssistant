chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.fanficId === undefined) {
            return false
        }

        console.log('Принято сообщение от контент скрипта: ' + JSON.stringify(request))

        if (request.fanficId != 'no_id') {
            console.log('Идентификатор фанфика известен')
            changeFavoriteMark(request.fanficId, request.mark, request.selected, sendResponse)
        } else {
            console.log('Идентификатор фанфика неизвестен, запрашиваю идентификатор фанфика')
            getFanficId(request.siteId, request.siteFanficId, function(data) {
                if (data === undefined) {
                    console.log('Система ФвФ ответила пустыми данными')
                    sendResponse({status: 'error', message: 'Ошибка запроса идентификатора фанфика'})
                    return
                }

                if (data.error !== undefined && data.error == 'no fic') {
                    console.log('Фанфик не добавлен в систему ФвФ, оповещаю клиента о необходимости добавить фанфик')
                    sendResponse({status: 'no_fic', message: 'Фанфик не добавлен на сайт'})
                    return
                }

                console.log('Идентификатор фанфика получен: ' + data.fic_id + '')
                changeFavoriteMark(data.fic_id, request.mark, request.selected, sendResponse)
            }, function(error) {
                sendResponse({status: 'error', message: error})
            })
        }



        return true
    })

function changeFavoriteMark(fanficId, mark, selected, sendResponse) {
    console.log('Отправляю запрос на смену метки фанфика')
    if (!selected) {
        addFavoriteMark(fanficId, mark, function() {
            console.log('Метка ' + mark + ' фанфика ' + fanficId + ' успешно добавлена')
            sendResponse({status: 'success'})
        }, function(message) {
            console.log('Ошибка добавления метки: ' + message !== undefined?message:'')
            sendResponse({status: 'error', message: message})
        })
    } else {
        deleteFavoriteMark(fanficId, mark, function() {
            console.log('Метка ' + mark + ' фанфика ' + fanficId + ' успешно удалена')
            sendResponse({status: 'success'})
        }, function(message) {
            console.log('Ошибка добавления метки: ' + message !== undefined?message:'')
            sendResponse({status: 'error', message: message})
        })
    }
}