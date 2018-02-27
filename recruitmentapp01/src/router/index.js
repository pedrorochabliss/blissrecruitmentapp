import Vue from 'vue'
import Router from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen'
import ListScreen from '@/components/ListScreen'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'

Vue.use(Buefy)
Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/home',
      name: 'LoadingScreen',
      component: LoadingScreen
    },

    {
      path: '/questions/:filter?',
      name: 'ListScreen',
      component: ListScreen
    }
  ]
})
