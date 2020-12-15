<template>
  <div
    class="c-a-padding d-flex justify-content-between bg-light"
    v-if="currentRoute != '/private-policy'"
  >
    <div class="d-flex">
      <router-link class="navbar-brand" to="/">FireFlutter</router-link>
      <router-link class="nav-link" to="/login">Login</router-link>
      <router-link class="nav-link" to="/logout">Logout</router-link>
      <router-link class="nav-link" to="/register">Register</router-link>
      <router-link class="nav-link" to="/profile">Profile</router-link>
      <router-link class="nav-link" to="/contacts">Contacts</router-link>
      <router-link class="nav-link" to="/private-policy"
        >Private Policy</router-link
      >
      <router-link class="nav-link" to="/about">About</router-link>
    </div>
    <div>
      <router-link class="nav-link" to="/admin">Admin</router-link>
    </div>
  </div>

  <router-view />
</template>

<script lang="ts">
import { AppService } from "@/services/app.service";
import store from "@/store/index";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { Vue } from "vue-class-component";
import router from "@/router";

export default class RegisterForm extends Vue {
  app = new AppService();
  currentRoute = "";

  created() {
    router.beforeEach((to, from, next) => {
      // console.log(from.path, "=>", to.path);
      this.currentRoute = to.path;
      next();
    });

    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        store.state.user = user;
        // console.log("user logged in!");

        const sanpshot = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();
        if (sanpshot.exists) {
          store.state.userData = sanpshot.data();
        }
      } else {
        store.state.user = {} as firebase.User;
        store.state.userData = {};
        // console.log("user Not logged in!");
      }
    });
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.c-a-padding a {
  padding: 12px;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
}
.sm {
  font-size: 12px;
}
.md {
  font-size: 16px;
}
.bold {
  font-weight: bold;
}
.grey {
  color: grey;
}
</style>
