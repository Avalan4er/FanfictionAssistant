chrome.runtime.onInstalled.addListener(function() {
    // DATA TYPE
    /*var fanfics = [
        {
            'link':'https://www.fanfiction.net/s/12976347/1/Amina-Precure',
            'statuses': ['read']
        },
        {
            'link':'https://www.fanfiction.net/s/7347955/1/Dreaming-of-Sunshine',
            'statuses': ['to_read']
        },
        {
            'link':'https://www.fanfiction.net/s/3929411/1/Chunin-Exam-Day',
            'statuses': ['read', 'downloaded']
        },
    ]

    chrome.storage.local.set({'fanfics': fanfics}, function(){
        console.log('Storage initialized')
    })*/

    
    // JQUERY
    /*$.get(
        {
            url:"http://fanfics.me/favorite?action=subscribed_fics",
            xhrFields: { withCredentials: true }
        }, function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });*/

    // XMLHTTPREQUEST
    /*var cookies = chrome.cookies.getAll({url:'http://fanfics.me'}, function(cookies){
        var client = new XMLHttpRequest();
        var endPoint="http://fanfics.me/favorite?action=subscribed_fics";
        var cookie="";
        
        client.open("GET", endPoint, false);//This Post will become put 
        client.setRequestHeader("Accept", "application/json");
        client.setRequestHeader("Content-Type","application/json");

        client.setRequestHeader("Set-Cookie","session=abc");
        for (var i in cookies) {
            //cookie += cookies[i].name + '=' + cookies[i].value + ';' 
            client.setRequestHeader("Set-Cookie", cookies[i].name + '=' + cookies[i].value );
        }
        client.withCredentials = true;
        client.send();

        if (client.status != 200) {
            // обработать ошибку
            alert( client.status + ': ' + client.statusText ); // пример вывода: 404: Not Found
        } else {
            // вывести результат
            alert( client.responseText ); // responseText -- текст ответа.
        }
    })*/
})