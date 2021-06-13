import Vue from 'vue'
import App from './App.vue'
import VModal from 'vue-js-modal'
import Spinner from 'vue-simple-spinner';

Vue.config.productionTip = false

Vue.use(VModal,Spinner)

new Vue({
  render: h => h(App),
}).$mount('#app')
