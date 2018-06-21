var titles = document.querySelectorAll('.z-list')
Array.prototype.forEach.call(titles, function(title) {
    var fanficLink = 'https://fanfiction.net' + title.querySelector('.stitle').getAttribute('href')
    var fvfLink = createFvFLink(fanficLink)
    title.insertBefore(fvfLink, title.lastChild)
});