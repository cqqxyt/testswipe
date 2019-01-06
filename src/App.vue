<template>
  <div id="app">
    <hello-world/>
  </div>
</template>

<script>
//import myMixin from './myMixin'
//import test from './test'
import HelloWorld from './components/HelloWorld'
export default {
  name: 'App',
  components:{
    HelloWorld
  },
  //mixins: [myMixin],
  methods: {
    hello () {
      //console.log('first')
    }
  },
  created () {
    //this.sayHi()
   // new test()
  }
}
</script>

<style>
 html, body {
      position: relative;
      height: 100%;
    }
    body {
      background: #000;
      font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
      font-size: 14px;
      color:#000;
      margin: 0;
      padding: 0;
    }
    #app,.image-slide{
      height:100%;
    }
    .swiper-container {
      width: 100%;
      height: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .swiper-slide {
      background-size: cover;
      background-position: center;
    }
    .gallery-top {
      height: 80%;
      width: 100%;
    }
    .gallery-thumbs {
      height: 20%;
      box-sizing: border-box;
      padding: 10px 0;
    }
    .gallery-thumbs .swiper-slide {
      width: 25%;
      height: 100%;
      opacity: 0.4;
    }
    .gallery-thumbs .swiper-slide-thumb-active {
      opacity: 1;
    }
</style>
