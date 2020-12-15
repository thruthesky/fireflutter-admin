<template>
  <div class="c-a-padding d-flex justify-content-between bg-light">
    <div class="d-flex">
      <a class="navbar-brand" href="/">FireFlutter</a>
      <a class="nav-link" href="/login">Login</a>
      <a class="nav-link" href="/logout">Logout</a>
      <a class="nav-link" href="/register">Register</a>
      <a class="nav-link" href="/profile">Profile</a>
      <a class="nav-link" href="/contact">Contacts</a>
      <a class="nav-link" href="/policy">Policy</a>
      <a class="nav-link" href="/about">About</a>
    </div>

    <div>
      <router-link class="nav-link" to="/admin/home">Admin</router-link>
    </div>
  </div>

  <div id="nav">
    <router-link to="/users">Users</router-link> |
    <router-link to="/categories">Categories</router-link> |
    <router-link to="/posts">Posts</router-link> |
    <router-link to="/photos">Photos</router-link> |
    <router-link to="/purchases">Purchases</router-link> |
    <router-link to="/settings">Settings</router-link> |
    <router-link to="/translations">Translations</router-link>

    <p v-if="app.loggedIn">Current user Email: {{ $store.state.user.email }}</p>
    <span v-if="app.isAdmin">You are an ADMIN!</span>
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
