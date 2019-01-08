import $ from 'jquery'
import util from '../static/util/util.js'
class swiperUI  {
    constructor(params){
        this.params = params
        this.container = this.getContainer()
    }

    getContainer(){
        return document.querySelectorAll(this.params.container)[0]
    }

    getCurrentItem(){
        return $(this.container).find('.swiper-slide-active').find('.swiper-zoom-container')
    }

    currentItem(){
        return {
            node :this.getCurrentItem(),
            initialPosition:util._getZeroBounds().center
        }
    }
    getBgItem(){
        return this.getContainer()
    }

    getItemAt(index){
        $(this.container).find('.swiper-slide-active').find('.swiper-zoom-container').eq(index)
    }
    viewportSize(){
        return {
            x :this.container.clientWidth,
		    y : this.container.clientHeight
        }
    }
}

export default swiperUI