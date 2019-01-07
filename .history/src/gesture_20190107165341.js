var _direction,
    _module = [],
    _tempPointsArr = [],
    _pointerEventEnabled,
    numPoints;

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        _pointerEventEnabled = navigator.pointerEnabled || navigator.msPointerEnabled;
        this.init()
    }
    init(){
        this.bindEvent()
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
        if(e.type.indexOf('touch') > -1) {

            if(e.touches && e.touches.length > 0) {
                _tempPointsArr[0] = _convertTouchToPoint(e.touches[0], _ePoint1);
                if(e.touches.length > 1) {
                    _tempPointsArr[1] = _convertTouchToPoint(e.touches[1], _ePoint2);
                }
            }
            
        } else {
            _ePoint1.x = e.pageX;
            _ePoint1.y = e.pageY;
            _ePoint1.id = '';
            _tempPointsArr[0] = _ePoint1;//_ePoint1;
        }

        return _tempPointsArr;
    }
    _convertTouchToPoint = function(touch, p) {
		p.x = touch.pageX;
		p.y = touch.pageY;
		p.id = touch.identifier;
		return p;
	}
    _onDragStart(e){
        if(e.type === 'mousedown' && e.button > 0  ) {
			return;
        }
        
        var startPointsList = _getTouchPoints(e),
			numPoints = startPointsList.length;
    }
    _onDragMove(e){
        console.log(e)
    }
    _renderMovement(){

    }
    _onDragRelease(){}
}

export default gesture