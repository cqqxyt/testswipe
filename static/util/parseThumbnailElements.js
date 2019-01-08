const parseThumbnailElements = function(el) {
    var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        el,
        childElements,
        thumbnailEl,
        size,
        item;

    for(var i = 0; i < numNodes; i++) {
        el = thumbElements[i];

        // include only element nodes 
        if(el.nodeType !== 1) {
          continue;
        }

        childElements = el.children;

        size = [1920,1920];

        // create slide object
        item = {
            src: el.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
            author: el.getAttribute('data-author')
        };

        item.el = el; // save link to element for getThumbBoundsFn

        if(childElements.length > 0) {
          item.msrc = childElements[0].getAttribute('src'); // thumbnail url
          if(childElements.length > 1) {
              item.title = childElements[1].innerHTML; // caption (contents of figure)
          }
        }


        var mediumSrc = el.getAttribute('data-med');
          if(mediumSrc) {
            size = [200,200];
            // "medium-sized" image
            item.m = {
                  src: mediumSrc,
                  w: parseInt(size[0], 10),
                  h: parseInt(size[1], 10)
            };
          }
          // original image
          item.o = {
              src: item.src,
              w: item.w,
              h: item.h
          };

        items.push(item);
    }

    return items;
};

export default parseThumbnailElements
