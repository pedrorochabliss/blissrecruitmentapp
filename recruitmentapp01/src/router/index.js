import Vue from 'vue'
import Router from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoadingScreen',
      component: LoadingScreen
    }
  ]
})
