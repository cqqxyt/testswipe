const myMixin = {
    created: function () {
      this.hello()
    },
    methods: {
      hello () {
        console.log('hello from mixin!')
      },
      sayHi () {
        
      }
    }
  }

  export default myMixin