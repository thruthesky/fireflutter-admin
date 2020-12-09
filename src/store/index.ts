import { createStore } from "vuex";

import firebase from "firebase/app";
import "firebase/auth";

export default createStore({
  state: {
    user: {} as firebase.User
  },
  mutations: {},
  actions: {},
  modules: {}
});
