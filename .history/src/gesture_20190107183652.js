var _getEmptyPoint = function() { 
    return {x:0,y:0}; 
};

var _that ,

    _gestureStartTime,
	_gestureCheckSpeedTime,
    _direction ,
    _module = [],
    _tempPointsArr = [],
    _currPointers = [],
    _posPoints = [],
    _pointerEventEnabled,
    numPoints,
    delta = {},
    _ePoint1 = {},
    _ePoint2 = {},
    _features = {},
    _startPoint = {},
    _currPoint = {},
    _startMainScrollPos = {},
    _dragAnimFrame,
    _isZooming = false,
     p = _getEmptyPoint(),
    _currPanDist = _getEmptyPoint(),
    _mainScrollPos = _getEmptyPoint(),
    _slideSize = _getEmptyPoint(),
    _startPanOffset = _getEmptyPoint(),
    _panOffset = _getEmptyPoint(),
    _currZoomElementStyle,
    _currZoomLevel,
    _isDragging,
    _isFirstMove,
    _requestAF,
    _cancelAF,
    _currentPoints,
    _transformKey,
    _translatePrefix,
    _translateSufix,
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
        },
        _getCurrentTime : function() {
            return new Date().getTime();
        },
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

        if(_transformKey) {
			// setup 3d transforms
			var allow3dTransform = true;//_features.perspective && !_likelyTouchDevice;
			_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
			_translateSufix = _features.perspective ? ', 0px)' : ')';	
			return;
		}
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
                _isDragging = _isFirstMove = true
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

                _gestureCheckSpeedTime = _gestureStartTime = util._getCurrentTime();

                _that._stopDragUpdateLoop();
                _that._dragUpdateLoop();
            }
    }
    
    _onDragMove(e){
        e.preventDefault();

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			if(pointerIndex > -1) {
				var p = _currPointers[pointerIndex];
				p.x = e.pageX;
				p.y = e.pageY; 
			}
        }
        
        if(_isDragging) {
            var touchesList = _that._getTouchPoints(e);
			if(!_direction &&  !_isZooming) {

				if(_mainScrollPos.x !== _slideSize.x * _currPositionIndex) {
					// if main scroll position is shifted – direction is always horizontal
					_direction = 'h';
				} else {
                    var diff = Math.abs(touchesList[0].x - _currPoint.x) - Math.abs(touchesList[0].y - _currPoint.y);
                    console.log(Math.abs(diff))
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
        if(!_currentPoints) {
			return;
		}

		var numPoints = _currentPoints.length;

		if(numPoints === 0) {
			return;
		}

		util._equalizePoints(p, _currentPoints[0]);
		delta.x = p.x - _currPoint.x;
		delta.y = p.y - _currPoint.y;

        
        if(!_direction) {
            return;
        }

        if(_isFirstMove) {
            _isFirstMove = false;

            // subtract drag distance that was used during the detection direction  

            if( Math.abs(delta.x) >= DIRECTION_CHECK_OFFSET) {
                delta.x -= _currentPoints[0].x - _startPoint.x;
            }
            
            if( Math.abs(delta.y) >= DIRECTION_CHECK_OFFSET) {
                delta.y -= _currentPoints[0].y - _startPoint.y;
            }
        }

        _currPoint.x = p.x;
        _currPoint.y = p.y;

        // do nothing if pointers position hasn't changed
        if(delta.x === 0 && delta.y === 0) {
            return;
        }
        if(_direction === 'v' ) {
            if(!this._canPan()) {
                _currPanDist.y += delta.y;
                _panOffset.y += delta.y;

                //var opacityRatio = _calculateVerticalDragOpacityRatio();

               // _verticalDragInitiated = true;
               // _shout('onVerticalDrag', opacityRatio);

                //_applyBgOpacity(opacityRatio);
                this._applyCurrentZoomPan();
                return ;
            }
        }

    }

    _applyZoomTransform = function(styleObj,x,y,zoom,item) {
		// if(!_renderMaxResolution || (item && item !== self.currItem) ) {
		// 	zoom = zoom / (item ? item.fitRatio : self.currItem.fitRatio);	
        // }
        zoom = 1
			
		styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
	}
	_applyCurrentZoomPan = function( allowRenderResolution ) {
		// if(_currZoomElementStyle) {

		// 	if(allowRenderResolution) {
		// 		if(_currZoomLevel > self.currItem.fitRatio) {
		// 			if(!_renderMaxResolution) {
		// 				_setImageSize(self.currItem, false, true);
		// 				_renderMaxResolution = true;
		// 			}
		// 		} else {
		// 			if(_renderMaxResolution) {
		// 				_setImageSize(self.currItem);
		// 				_renderMaxResolution = false;
		// 			}
		// 		}
		// 	}
			
        _currZoomElementStyle = document.querySelectorAll('.swiper-zoom-container')[0].style
        _currZoomLevel = 1
			this._applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y, _currZoomLevel);
		//}
	}
    
    _canPan = function() {
        return false
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
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