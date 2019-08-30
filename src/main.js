import Vue from 'vue'
import App from './App.vue'
import ws from './lib/ws'
import router from './router'
import './assets/css/style.css'

Vue.prototype.$ws = ws

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
