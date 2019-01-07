var _getEmptyPoint = function() { 
    return {x:0,y:0}; 
};

var _direction,
    _module = [],
    _tempPointsArr = [],
    _pointerEventEnabled,
    numPoints,
    _ePoint1 = {},
    _ePoint2 = {},
    _features = {},
    _dragAnimFrame,
    _isZooming = false,
    _mainScrollPos = _getEmptyPoint(),
    _slideSize = _getEmptyPoint(),
    _currPositionIndex = 0,
    DIRECTION_CHECK_OFFSET = 10;

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        _pointerEventEnabled = navigator.pointerEnabled || navigator.msPointerEnabled;
        this.init()
    }
    init(){
        this.initFeatures()
        this.bindEvent()

        this._requestAF = _features.raf
        this._cancelAF = _features.caf
    }

    initFeatures(){
        if(window.requestAnimationFrame) {
			_features.raf = window.requestAnimationFrame;
			_features.caf = window.cancelAnimationFrame;
		}
    }

    bindEvent(){
        this.container.addEventListener('touchmove',this._dragMove, false)
    }
    getContainer(container){
        return document.querySelectorAll(container)[0]
    }
    _registerModule = function(name, module) {
		_modules.push(name);
    }
    _getTouchPoints(e){
        while(_tempPointsArr.length > 0) {
			_tempPointsArr.pop();
		}

		if(!_pointerEventEnabled) {
			if(e.type.indexOf('touch') > -1) {

				if(e.touches && e.touches.length > 0) {
					_tempPointsArr[0] = this._convertTouchToPoint(e.touches[0], _ePoint1);
					if(e.touches.length > 1) {
						_tempPointsArr[1] = this._convertTouchToPoint(e.touches[1], _ePoint2);
					}
				}
				
			} else {
				_ePoint1.x = e.pageX;
				_ePoint1.y = e.pageY;
				_ePoint1.id = '';
				_tempPointsArr[0] = _ePoint1;//_ePoint1;
			}
		} else {
			_tempCounter = 0;
			// we can use forEach, as pointer events are supported only in modern browsers
			_currPointers.forEach(function(p) {
				if(_tempCounter === 0) {
					_tempPointsArr[0] = p;
				} else if(_tempCounter === 1) {
					_tempPointsArr[1] = p;
				}
				_tempCounter++;

			});
		}
		return _tempPointsArr;
    }
    _convertTouchToPoint = function(touch, p) {
		p.x = touch.pageX;
		p.y = touch.pageY;
		p.id = touch.identifier;
		return p;
    }
    
    _stopDragUpdateLoop = function() {
		if(_dragAnimFrame) {
			this._cancelAF(_dragAnimFrame);
			_dragAnimFrame = null;
		}
	}
	_dragUpdateLoop = function() {
		if(_isDragging) {
			_dragAnimFrame = this._requestAF(_dragUpdateLoop);
			this._renderMovement();
		}
	}
	_canPan = function() {
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
    }
    
    _onDragStart(e){
        console.log(e)
        // if(e.type === 'mousedown' && e.button > 0  ) {
		// 	return;
        // }
        
        var startPointsList = this._getTouchPoints(e),
            numPoints = startPointsList.length;
            
            console.log(startPointsList)
            this._stopDragUpdateLoop();
			this._dragUpdateLoop();
    }
    
    _onDragMove(e){
        if(_isDragging) {
			var touchesList = this._getTouchPoints(e);
			if(!_direction &&  !_isZooming) {

				if(_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
					// if main scroll position is shifted – direction is always horizontal
					_direction = 'h';
				} else {
					var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
					// check the direction of movement
					if(Math.abs(diff) >= DIRECTION_CHECK_OFFSET) {
						_direction = diff > 0 ? 'h' : 'v';
						_currentPoints = touchesList;
					}
				}
				
			} else {
				_currentPoints = touchesList;
			}
		}	
    }
    _renderMovement(){

    }
    _onDragRelease(){}
}

export default gesture