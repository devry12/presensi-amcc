import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Presensi from './views/Presensi.vue';
import Rekap from './views/Rekap.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/presensi',
      name: 'presensi',
      component: Presensi,
    },
    {
      path: '/rekap',
      name: 'rekap',
      component: Rekap,
    },

  ],
});
