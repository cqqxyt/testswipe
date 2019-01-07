var _direction,
    _module [];

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        this.init()
    }
    init(){
        this._registerModule()
    }
    getContainer(container){
        return document.querySelectorAll(container)[0]
    }
    _registerModule = function(name, module) {
		_modules.push(name);
	},
    _dragMove(){

    }
}

export default gesture