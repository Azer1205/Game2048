import Vue from 'vue'
import Vuex from 'vuex'
import mutation from './mutation'

Vue.use(Vuex);

const store = new Vuex.Store(mutation);

export default store
