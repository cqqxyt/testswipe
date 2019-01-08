
import $ from 'jquery'
import framework from '../static/util/framework.js'
import util from '../static/util/util.js'
import swiperUI from '../src/swiperUI.js'
import {_animateProp,_stopAllAnimations,_stopAnimation,_registerStartAnimation} from '../static/util/animations.js'

let _that ,
_isOpen = true,
_isDestroying,
_initialZoomRunning,
_initialContentSet,
    _gestureStartTime,
    _gestureCheckSpeedTime,
    _verticalDragInitiated,
    _verticalDragRange=0.75,
    hideAnimationDuration=333,
	showAnimationDuration= 333,
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
    _currItem,
    _startMainScrollPos = {},
    _dragAnimFrame,
    _isZooming = false,
    _bgOpacity,
     p = util._getEmptyPoint(),
    _currPanDist = util._getEmptyPoint(),
    _mainScrollPos = util._getEmptyPoint(),
    _slideSize = util._getEmptyPoint(),
    _startPanOffset = util._getEmptyPoint(),
    _panOffset = util._getEmptyPoint(),
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
    DIRECTION_CHECK_OFFSET = 10,
    _hideTimeout;
   
   

class gesture  {
    constructor(params){
		_that = this
		this.swiperUI = new swiperUI(params)
		this.items = params.items
        _pointerEventEnabled = navigator.pointerEnabled || navigator.msPointerEnabled;
        this.init()
    }
    init(){
        _features = framework.detectFeatures()

        _requestAF = _features.raf
        _cancelAF = _features.caf
        _transformKey = _features.transform;

        this._setupTransforms()
        
        this.initFeatures()
		this.bindEvent()
		this.currentItemIndex = 1
		this.item = this.getItemAt()
		this.initItem()
	}
	initItem(){
		this.items[this.currentItemIndex].initialPosition = util._getZeroBounds().center
	}
	
	getThumbBoundsFn(){
		return this.items[this.currentItemIndex].initialLayout
	}
	getItemAt(){
		return this.items[this.currentItemIndex]
	}

    bindEvent(){
        this.swiperUI.container.addEventListener('touchstart',this._onDragStart, false)
        this.swiperUI.container.addEventListener('touchmove',this._onDragMove, false)
        this.swiperUI.container.addEventListener('touchend',this._onDragRelease, false)
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
                _currItem = _that.swiperUI.currentItem()
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
        e.preventDefault()
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
        if(_direction === 'v' && _currentPoints.length == 1){
            e.preventDefault();
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

        if(numPoints < 2){
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
    
                    var opacityRatio = this._calculateVerticalDragOpacityRatio();
                     _verticalDragInitiated = true;
                    this._applyBgOpacity(opacityRatio);
					this._stopAnimation()
					_currZoomLevel = opacityRatio
                    this._applyCurrentZoomPan();
                    //return ;
                }
            }
        }
    }

    _onDragRelease(e){
        e.preventDefault()

        if(_features.isOldAndroid ) {

			if(_oldAndroidTouchEndTimeout && e.type === 'mouseup') {
				return;
			}

			// on Android (v4.1, 4.2, 4.3 & possibly older) 
			// ghost mousedown/up event isn't preventable via e.preventDefault,
			// which causes fake mousedown event
			// so we block mousedown/up for 600ms
			if( e.type.indexOf('touch') > -1 ) {
				clearTimeout(_oldAndroidTouchEndTimeout);
				_oldAndroidTouchEndTimeout = setTimeout(function() {
					_oldAndroidTouchEndTimeout = 0;
				}, 600);
			}
			
        }
        
        var releasePoint;

		if(_pointerEventEnabled) {
			var pointerIndex = framework.arraySearch(_currPointers, e.pointerId, 'id');
			
			if(pointerIndex > -1) {
				releasePoint = _currPointers.splice(pointerIndex, 1)[0];

				if(navigator.pointerEnabled) {
					releasePoint.type = e.pointerType || 'mouse';
				} else {
					var MSPOINTER_TYPES = {
						4: 'mouse', // event.MSPOINTER_TYPE_MOUSE
						2: 'touch', // event.MSPOINTER_TYPE_TOUCH 
						3: 'pen' // event.MSPOINTER_TYPE_PEN
					};
					releasePoint.type = MSPOINTER_TYPES[e.pointerType];

					if(!releasePoint.type) {
						releasePoint.type = e.pointerType || 'mouse';
					}
				}

			}
		}

		var touchList = _that._getTouchPoints(e),
			gestureType,
			numPoints = touchList.length;

		// if(e.type === 'mouseup') {
		// 	numPoints = 0;
		// }

		// Do nothing if there were 3 touch points or more
		if(numPoints === 2) {
			_currentPoints = null;
			return true;
		}

		// if second pointer released
		if(numPoints === 1) {
			_equalizePoints(_startPoint, touchList[0]);
        }	
        _isDragging = false
        _that._stopDragUpdateLoop()
        
        if(_verticalDragInitiated) {

			var opacityRatio = _that._calculateVerticalDragOpacityRatio();

			if(opacityRatio < _verticalDragRange) {
				_that.close();
			} else {
				var initalPanY = _panOffset.y,
					initialBgOpacity = _bgOpacity;

                    _animateProp('verticalDrag', 0, 1, 300, framework.easing.cubic.out, function(now) {
					
					_panOffset.y = (_currItem.initialPosition.y - initalPanY) * now + initalPanY;

					_that._applyBgOpacity(  (1 - initialBgOpacity) * now + initialBgOpacity );
					_currZoomLevel =  (1 - initialBgOpacity) * now + initialBgOpacity
					_that._applyCurrentZoomPan();
				});

			}

			return;
        }
        
       
    }
    _applyBgOpacity (opacity) {
		_bgOpacity = opacity;
		this.swiperUI.getBgItem().style.background = 'rgba(0,0,0,'+opacity * 1+')';
    }
    
    _calculateVerticalDragOpacityRatio() {
        const viewportSize = this.swiperUI.viewportSize()
        var yOffset = _panOffset.y - _currItem.initialPosition.y; // difference between initial and current position
		return 1 -  Math.abs( yOffset / (viewportSize.y / 2)  );
	}
    _stopAnimation(){
        _currItem.node[0].style['transition-duration'] = 0
    }
    _setupTransforms(){
        if(_transformKey) {
			var allow3dTransform = _features.perspective;
			_translatePrefix = 'translate' + (allow3dTransform ? '3d(' : '(');
			_translateSufix = _features.perspective ? ', 0px)' : ')';	
			return;
		}
		_transformKey = 'left';
    }
    getCurrentItem(){
        return $(this.container).find('.swiper-slide-active').find('.swiper-zoom-container')
    }
    _applyZoomTransform = function(styleObj,x,y,zoom,item) {
		
        styleObj[_transformKey] = _translatePrefix + x + 'px, ' + y + 'px' + _translateSufix + ' scale(' + zoom + ')';
	}
	_applyCurrentZoomPan ( allowRenderResolution ) {
        _currZoomElementStyle = _that.swiperUI.currentItem().node[0].style
		_currZoomLevel = _currZoomLevel ? _currZoomLevel : 1
		_currZoomLevel = 1
		this._applyZoomTransform(_currZoomElementStyle, _panOffset.x, _panOffset.y,_currZoomLevel);
	}
    
    _canPan = function() {
        return false
		return !(_options.scaleMode === 'fit' && _currZoomLevel ===  self.currItem.initialZoomLevel);
	}
	
    
    initFeatures(){
        if(window.requestAnimationFrame) {
			_features.raf = window.requestAnimationFrame;
			_features.caf = window.cancelAnimationFrame;
		}
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
		return false
		return !(_currZoomLevel ===  self.currItem.initialZoomLevel);
    }

    close() {
		// if(!_isOpen) {
		// 	return;
		// }

		// _isOpen = false;
		// _isDestroying = true;

		this._hide(_currItem.node[0], true);
    }
    
	_hide(item, out) {
		if(_hideTimeout) {
			clearTimeout(_hideTimeout);
		}

		_initialZoomRunning = true;
		_initialContentSet = true;
		
		var thumbBounds = {x:0,y:0,w:200}; 
		

		var duration = out ? hideAnimationDuration : showAnimationDuration;

		var onComplete = function() {
			_stopAnimation('initialZoom');
			$(_that.swiperUI.container).addClass('sipwe__ui--hidden')
			_currItem.node[0].removeAttribute('style');
			_that.swiperUI.getBgItem().removeAttribute('style');
			_initialZoomRunning = false;
		};

		// if bounds aren't provided, just open gallery without animation
		if(!duration || !thumbBounds || thumbBounds.x === undefined) {


			_currZoomLevel = item.initialZoomLevel;
			util._equalizePoints(_panOffset,  item.initialPosition );
			_that._applyCurrentZoomPan();

			template.style.opacity = out ? 0 : 1;
			_that._applyBgOpacity(1);

			if(duration) {
				setTimeout(function() {
					onComplete();
				}, duration);
			} else {
				onComplete();
			}

			return;
		}

		var startAnimation = function() {
			_registerStartAnimation('initialZoom');
			_hideTimeout = setTimeout(function() {
					var destZoomLevel = thumbBounds.w / 1920,
						initialPanOffset = {
							x: _panOffset.x,
							y: _panOffset.y
						},
						initialZoomLevel = _currZoomLevel,
						onUpdate = function(now) {
							const _currentWindowScrollY = 0
							console.log(now)
							if(now === 1) {
								_currZoomLevel = destZoomLevel;
								_panOffset.x = thumbBounds.x;
								_panOffset.y = thumbBounds.y  - _currentWindowScrollY;
							} else {
								_currZoomLevel = (destZoomLevel - initialZoomLevel) * now + initialZoomLevel;
								_panOffset.x = (thumbBounds.x - initialPanOffset.x) * now + initialPanOffset.x;
								_panOffset.y =  (thumbBounds.y - _currentWindowScrollY - initialPanOffset.y) * now + initialPanOffset.y;
							}
							console.log(_panOffset)
							_that._applyCurrentZoomPan();
							_that.swiperUI.getBgItem().style.opacity = 1 - now;
						};

						_animateProp('initialZoom', 0, 1, duration, framework.easing.cubic.out, onUpdate, onComplete);
					
			}, 50); 
		};
		startAnimation();

		
	}

    
   
}

export default gesture