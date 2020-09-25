import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n';
import './filters';
import Snotify from 'vue-snotify';
import './assets/scss/notifi-theme/theme.scss';

Vue.use(Snotify, {
  toast: {
    titleMaxLength: 50,
    showProgressBar: false,
    pauseOnHover: false,
    closeOnClick: true,
  },
  global: {
    maxOnScreen: 10,
    maxAtPosition: 10,
    newOnTop: false,
  },
});

Vue.config.productionTip = false

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
