function createLinkPlate(link) {
    var fvfSpanNode = document.createElement('span')
    fvfSpanNode.setAttribute('class', 'status_plate download')

    var fvfLinkNode = document.createElement("a");
    fvfLinkNode.setAttribute('href', 'http://fanfics.me/fictofile?url='+link)
    fvfLinkNode.setAttribute('target', '_blank')
    var fvfLinkContent = document.createTextNode('Скачать')
    fvfLinkNode.appendChild(fvfLinkContent)

    fvfSpanNode.appendChild(fvfLinkNode)

    return fvfSpanNode
}

function createStatusPlate(link, parentNode) {
    var statuses = chrome.storage.local.get(['fanfics'], function(result){
        result.fanfics.forEach(fanfic => {
            if (fanfic.link == link) {
                fanfic.statuses.forEach(status => {
                    var statusPlate = document.createElement('span')
                    statusPlate.setAttribute('class', 'status_plate '+ status)
                    parentNode.appendChild(statusPlate)
                })
            }
        });
    })
}

function createControlPlate(link) {
    var controlPlate = document.createElement('span')
    controlPlate.setAttribute('class', 'control_plate')

    var linkPlate = createLinkPlate(link)
    controlPlate.appendChild(linkPlate)

    createStatusPlate(link, controlPlate)

    return controlPlate
}