var _direction,
    _module = [],
    _tempPointsArr = [],
    _pointerEventEnabled,
    numPoints,
    _ePoint1 = {},
    _ePoint2 = {},
    _features = {};

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        _pointerEventEnabled = navigator.pointerEnabled || navigator.msPointerEnabled;
        this.init()
    }
    init(){
        this.initFeatures()
        this.bindEvent()

        _features = features
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
        console.log(e)
    }
    _renderMovement(){

    }
    _onDragRelease(){}
}

export default gesture