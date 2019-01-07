var _direction,
    container,

class gesture  {
    constructor(params){
        this.container = this.getContainer(params.container)
        this.init()
    }
    init(){
        this.registerModule()
    },
    getContainer(container){
        return document.querySelectorAll(container)[0]
    }
    registerModule(){

    }
    _dragMove(){

    }
}

export default gesture