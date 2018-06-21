function createFvFLink(link) {
    var newNode = document.createElement("a");
    newNode.setAttribute('href', 'http://fanfics.me/fictofile?url='+link)
    newNode.setAttribute('target', '_blank')
    var text = document.createTextNode('[ФвФ]')
    newNode.appendChild(text)

    return newNode
}