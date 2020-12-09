import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

import firebase from "firebase/app";
import { AppService } from "./services/app.service";

const firebaseConfig = {
  apiKey: "AIzaSyC49ys8M4jbznfV0PxoKvPJ4Bqldy3WC2g",
  authDomain: "sonub-dating.firebaseapp.com",
  databaseURL: "https://sonub-dating.firebaseio.com",
  projectId: "sonub-dating",
  storageBucket: "sonub-dating.appspot.com",
  messagingSenderId: "229679080903",
  appId: "1:229679080903:web:4a89ae0b27d2c2922da5e2"
};

firebase.initializeApp(firebaseConfig);

const appService = new AppService();

createApp(App)
  .mixin({
    data() {
      return {
        app: appService
      };
    }
  })
  .use(store)
  .use(router)
  .mount("#app");
