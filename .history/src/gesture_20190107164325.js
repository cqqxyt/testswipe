var _direction,
    _module = [];

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        this._registerModule()
        this.init()
    }
    init(){
        for(i = 0; i < _modules.length; i++) {
			self['init' + _modules[i]]();
		}
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