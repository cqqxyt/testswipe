var _direction,
    _module = [];

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        this.init()
    }
    init(){
        this.bindEvent()
    }
    bindEvent(){
        this.container.bind('touchmove',this._dragMove, false)
    }
    getContainer(container){
        return document.querySelectorAll(container)[0]
    }
    _registerModule = function(name, module) {
		_modules.push(name);
	}
    _dragMove(e){
        console.log(e)
    }
}

export default gesture