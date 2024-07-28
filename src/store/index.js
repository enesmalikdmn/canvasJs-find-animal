import Vue from 'vue'
import Vuex from 'vuex'
import viewer from './modules/viewer';
import VuexPersistence from 'vuex-persist';

const persistence = new VuexPersistence({
  storage: window.localStorage,
  reducer: ({ viewer }) => ({
    viewer
  }),
});
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    viewer
  },
  plugins: [persistence.plugin],
})
