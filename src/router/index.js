import Vue from 'vue';
import VueRouter from 'vue-router';
// components
import welcome from './routes/welcome';

Vue.use(VueRouter);

let routes = [
  ...welcome,
];

let router = new VueRouter({
  routes: routes,
  // mode: 'history',
});

export default router;
