<template>
  <div>
        <div class="text-content">
            <img src="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg">
            <img src="http://lorempixel.com/800/400/sports/2/">
        </div>   
      
        <div id="imgThumbComponentsContent">
        <div class="image-slide sipwe__ui--hidden">
            <!-- Swiper -->
            <div class="swiper-container gallery-top gallery-top-content">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <div class="swiper-zoom-container">
                    <img src="https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_m.jpg">
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="swiper-zoom-container">
                    <img src="http://lorempixel.com/800/400/sports/2/">
                  </div>
                </div>
                <div class="swiper-slide">
                  <div class="swiper-zoom-container">
                    <img src="http://lorempixel.com/400/800/sports/3/">
                  </div>
                </div>
              </div>
              <!-- Add Pagination -->
              <div class="swiper-pagination swiper-pagination-white"></div>
              <!-- Add Navigation -->
              <div class="swiper-button-prev"></div>
              <div class="swiper-button-next"></div>
            </div>
            <div class="swiper-container gallery-thumbs">
              <div class="swiper-wrapper">
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/1)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/2)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/3)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/4)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/5)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/6)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/7)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/8)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/9)"></div>
                <div class="swiper-slide" style="background-image:url(http://lorempixel.com/1200/1200/nature/10)"></div>
              </div>
            </div>
          </div>
        </div>
  </div>

</template>

<script>
 import $ from 'jquery'
import '../../node_modules/swiper/dist/css/swiper.css'
import Swiper from '../../static/swiper.js'
import gesture from '../gesture'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    start(e){},
    end(e){}
  },
  mounted() {
    const vm = this
    $(".text-content img").on("click", function(){
      var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 4,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true
      });
      var galleryTop = new Swiper('.gallery-top', {
        width: document.body.clientWidth,
        zoom: {
          enable: true,
          containerClass: 'swiper-zoom-container'
        },
        spaceBetween: 10,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        thumbs: {
          swiper: galleryThumbs
        },
        on:{
          touchStart(e) {
            //vm.obj._onDragStart(e)
          },
          touchMove(e){
          // console.log('move')
          },
          touchEnd(e) {
            //vm.obj._onDragRelease(e)
          }
        }
      });
      vm.obj = new gesture({container:'.image-slide'})
      vm.obj._showOrHide({src:'https://farm6.staticflickr.com/5591/15008867125_68a8ed88cc_b.jpg'}, $(this))
      })
    
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#app, .image-slide {
    position: fixed;
    top: 0;
    left: 0;
    z-index:10;
    background: #000;
}
.gallery-top-content{
  opacity: 0;
}
.text-content{
  position: relative;
  z-index:0;
}
.text-content img{
  width: 200px;
  height:200px;
}
.sipwe__ui--hidden{
  display: none;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
