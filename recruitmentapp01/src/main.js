// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  mounted() {
    this.ready();
  },
  components: {
     App,
  },
  data() {
    var offline = false;
    var url;
    return {
      url,
      offline
    }
  },
  methods: {
    checkNoConnection : function() {
      if(window.navigator.onLine==false && this.offline == false ){
        this.offline = true;
        this.url = this.$route.path;
        this.$router.push({ path: '/noconnection', params: {}});
      }
    },

    checkRegainConnection : function() {
      if(window.navigator.onLine==true && this.offline == true){
        this.offline = false;
        this.$router.push({ path: this.url, params: {}});
      }
    },

    ready : function() {
      this.checkNoConnection();
      setInterval(function () {
        this.checkNoConnection();
        this.checkRegainConnection();
      }.bind(this), 1000); 
    }
  },
  template: '<App/>'
})
