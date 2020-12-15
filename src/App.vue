<template>
  <div class="c-a-padding d-flex justify-content-between bg-light">
    <div class="d-flex">
      <router-link class="navbar-brand" to="/">FireFlutter</router-link>
      <router-link class="nav-link" to="/login">Login</router-link>
      <router-link class="nav-link" to="/logout">Logout</router-link>
      <router-link class="nav-link" to="/register">Register</router-link>
      <router-link class="nav-link" to="/profile">Profile</router-link>
      <router-link class="nav-link" to="/contact">Contacts</router-link>
      <router-link class="nav-link" to="/policy">Policy</router-link>
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

export default class RegisterForm extends Vue {
  app = new AppService();

  created() {
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
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.c-a-padding a {
  padding: 12px;
}
</style>
