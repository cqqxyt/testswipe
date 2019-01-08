const getThumbBoundsFn = function(index, items) {
    // See Options->getThumbBoundsFn section of docs for more info
    var thumbnail = items[index].el.children[0],
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect(); 

    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
}

export default getThumbBoundsFn