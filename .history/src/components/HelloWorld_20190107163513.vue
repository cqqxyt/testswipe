<template>
<div class="image-slide">
  <!-- Swiper -->
  <div class="swiper-container gallery-top">
    <div class="swiper-wrapper">
      <div class="swiper-slide">
        <div class="swiper-zoom-container">
          <img src="http://lorempixel.com/800/800/sports/1/">
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
</template>

<script>
import '../../node_modules/swiper/dist/css/swiper.css'
import Swiper from 'swiper'
//import gesture from '../gesture'
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
     var galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      touchStart(e) {
          vm.start(e)
        },
        touchMove() {
          vm.isMoved = true
        },
        touchEnd(e) {
          vm.end(e)
        }
    });
    var galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: galleryThumbs
      }
    });
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   

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
