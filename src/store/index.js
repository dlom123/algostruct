import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentContent: null,
    currentLanguage: null,
    languages: [
      { name: 'c', text: 'C' },
      { name: 'python', text: 'Python' }
    ]
  },
  actions,
  mutations,
  modules: {}
})
