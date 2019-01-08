const util = {
    _equalizePoints : function(p1, p2) {
        p1.x = p2.x;
        p1.y = p2.y;
        if(p2.id) {
            p1.id = p2.id;
        }
    },
    _getCurrentTime : function() {
        return new Date().getTime();
    },
    _getEmptyPoint : function() { 
        return {x:0,y:0}; 
    },
    _getZeroBounds : function() {
		return {
			center:{x:0,y:0}, 
			max:{x:0,y:0}, 
			min:{x:0,y:0}
		}
    },
    _calculateItemSize:function(item, viewportSize, zoomLevel){
        const _tempPanAreaSize = {}
        _tempPanAreaSize.x = viewportSize.x;
        _tempPanAreaSize.y = viewportSize.y;

        if (isInitial) {
            var hRatio = _tempPanAreaSize.x / item.w;
            var vRatio = _tempPanAreaSize.y / item.h;

            item.fitRatio = hRatio < vRatio ? hRatio : vRatio;
            //item.fillRatio = hRatio > vRatio ? hRatio : vRatio;

            var scaleMode = _options.scaleMode;

            if (scaleMode === 'orig') {
                zoomLevel = 1;
            } else if (scaleMode === 'fit') {
                zoomLevel = item.fitRatio;
            }

            if (zoomLevel > 1) {
                zoomLevel = 1;
            }

            item.initialZoomLevel = zoomLevel;
            
            if(!item.bounds) {
                // reuse bounds object
                item.bounds = this._getZeroBounds(); 
            }
        }
        return item
    }
}

export default util