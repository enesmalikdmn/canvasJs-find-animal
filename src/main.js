import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/index.css';
import './assets/tailwind.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

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

