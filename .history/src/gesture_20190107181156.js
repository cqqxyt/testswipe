var _getEmptyPoint = function() { 
    return {x:0,y:0}; 
};

var _that ,
    _direction = 'h',
    _module = [],
    _tempPointsArr = [],
    _currPointers = [],
    _posPoints = [],
    _pointerEventEnabled,
    numPoints,
    _ePoint1 = {},
    _ePoint2 = {},
    _features = {},
    _startPoint = {},
    _currPoint = {},
    _startMainScrollPos = {},
    _dragAnimFrame,
    _isZooming = false,
    _currPanDist = _getEmptyPoint(),
    _mainScrollPos = _getEmptyPoint(),
    _slideSize = _getEmptyPoint(),
    _startPanOffset = _getEmptyPoint(),
	_panOffset = _getEmptyPoint(),
    _isDragging,
    _requestAF,
    _cancelAF,
    _currentPoints,
    _currPositionIndex = 0,
    DIRECTION_CHECK_OFFSET = 10;

    var framework = {
        arraySearch: function(array, value, key) {
            var i = array.length;
            while(i--) {
                if(array[i][key] === value) {
                    return i;
                } 
            }
            return -1;
        }
    }
  
    const util = {
        _equalizePoints : function(p1, p2) {
            p1.x = p2.x;
            p1.y = p2.y;
            if(p2.id) {
                p1.id = p2.id;
            }
        }
    }
class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        _pointerEventEnabled = navigator.pointerEnabled || navigator.msPointerEnabled;
        this.init()
        _that = this
    }
    init(){
        this.initFeatures()
        this.bindEvent()

        _requestAF = _features.raf
        _cancelAF = _features.caf
    }
    bindEvent(){
        this.container.addEventListener('touchstart',this._onDragStart, false)
        this.container.addEventListener('touchmove',this._onDragMove, false)
        this.container.addEventListener('touchend',this._onDragRelease, false)
    }
    _onDragStart(e){
        // if(e.type === 'mousedown' && e.button > 0  ) {
		// 	return;
        // }

        if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex < 0) {
				pointerIndex = _currPointers.length;
			}
			_currPointers[pointerIndex] = {x:e.pageX, y:e.pageY, id: e.pointerId};
        }
        
        var startPointsList = _that._getTouchPoints(e),
            numPoints = startPointsList.length;
            
            if(!_isDragging){
                _isDragging = true
                util._equalizePoints(_startPanOffset, _panOffset);

			    _currPanDist.x = _currPanDist.y = 0;
			    util._equalizePoints(_currPoint, startPointsList[0]);
                util._equalizePoints(_startPoint, _currPoint);
            
                //_equalizePoints(_startMainScrollPos, _mainScrollPos);
                _startMainScrollPos.x = _slideSize.x * _currPositionIndex;

                _posPoints = [{
                    x: _currPoint.x,
                    y: _currPoint.y
                }];
                
                _that._stopDragUpdateLoop();
                _that._dragUpdateLoop();
            }
    }
    
    _onDragMove(e){
        if(_isDragging) {
            var touchesList = _that._getTouchPoints(e);
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
        console.log(_direction)
        if(!_currentPoints) {
			return;
		}

		var numPoints = _currentPoints.length;

		if(numPoints === 0) {
			return;
        }
        
        if(_direction === 'v' && _options.closeOnVerticalDrag) {
            if(!_canPan()) {
                _currPanDist.y += delta.y;
                _panOffset.y += delta.y;

                var opacityRatio = _calculateVerticalDragOpacityRatio();

                _verticalDragInitiated = true;
                _shout('onVerticalDrag', opacityRatio);

                _applyBgOpacity(opacityRatio);
                _applyCurrentZoomPan();
                return ;
            }
        }
    }
    _onDragRelease(){
        _isDragging = false
        _that._stopDragUpdateLoop()
    }

    
    
    initFeatures(){
        if(window.requestAnimationFrame) {
			_features.raf = window.requestAnimationFrame;
			_features.caf = window.cancelAnimationFrame;
		}
    }

   
    getContainer(container){
        return document.querySelectorAll(container)[0]
    }
    _registerModule(name, module) {
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
    _convertTouchToPoint(touch, p) {
		p.x = touch.pageX;
		p.y = touch.pageY;
		p.id = touch.identifier;
		return p;
    }
    
    _stopDragUpdateLoop() {
		if(_dragAnimFrame) {
			_cancelAF(_dragAnimFrame);
			_dragAnimFrame = null;
		}
	}
	_dragUpdateLoop = function() {
		if(_isDragging) {
			_dragAnimFrame = _requestAF(_that._dragUpdateLoop);
			_that._renderMovement();
		}
	}
	_canPan() {
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
    }
    
   
}

export default gesture