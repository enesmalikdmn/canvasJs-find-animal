import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Digikit from 'digikit';
import './assets/index.css';
import './assets/tailwind.css'


Vue.use(Digikit);
Vue.config.productionTip = false
// Vue.directive('click-outside', {
//   bind: function (element, binding, vnode) {
//     element.clickOutsideEvent = function (event) {  //  check that click was outside the el and his children
//       if (!(element === event.target || element.contains(event.target))) { // and if it did, call method provided in attribute value
//         vnode.context[binding.expression](event);
//         // binding.value(); run the arg
//       }
//     };
//     document.body.addEventListener('click', element.clickOutsideEvent)
//   },
//   unbind: function (element) {
//     document.body.removeEventListener('click', element.clickOutsideEvent)
//   }
// });
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

