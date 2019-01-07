var _direction,
    _module = [],
    _tempPointsArr = [];

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
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