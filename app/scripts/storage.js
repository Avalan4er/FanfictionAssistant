chrome.runtime.onInstalled.addListener(function() {
    var fanfics = [
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
    })
})