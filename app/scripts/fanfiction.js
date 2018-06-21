var titles = document.querySelectorAll('.z-list')
Array.prototype.forEach.call(titles, function(title) {
    var finfictionUrl = location.protocol + '//' + location.host
    var fanficLink = finfictionUrl + title.querySelector('.stitle').getAttribute('href')
    var fvfLink = createControlPlate(fanficLink)
    title.insertBefore(fvfLink, title.lastChild)
});