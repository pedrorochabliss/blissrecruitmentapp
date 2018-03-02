import Vue from 'vue'
import Router from 'vue-router'
import LoadingScreen from '@/components/LoadingScreen'
import ListScreen from '@/components/ListScreen'
import Buefy from 'buefy'
import 'buefy/lib/buefy.css'
import VueResource from 'vue-resource'
import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

Vue.use(KeenUI)
Vue.use(Buefy)
Vue.use(Router)
Vue.use(VueResource)



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
      component: ListScreen,
      props: true
    }
  ]
})
