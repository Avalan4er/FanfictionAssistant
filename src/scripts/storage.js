$.get({
    url:"http://fanfics.me/api.php?action=member_favorite_ftf_list",
    xhrFields: { withCredentials: true }
}, function(data, status){
    if (status == 'success') {
        chrome.storage.local.set({'fanfics': data}, function() {
            console.log("Расширение Ассистент ФвФ загружено!")
        })
    }   
}).fail(function() {
    console.log("Ошибка запроса списка фанфиков с Фанфикс");
})