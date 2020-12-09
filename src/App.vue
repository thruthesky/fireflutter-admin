<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/users">Users</router-link> |
    <router-link to="/categories">Categories</router-link> |
    <router-link to="/posts">Posts</router-link> |
    <router-link to="/photos">Photos</router-link> |
    <router-link to="/settings">Settings</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/logout">Logout</router-link> |
    <router-link to="/about">About</router-link>

    <span v-if="app.loggedIn">Uid: {{ $store.state.user.uid }}</span>
  </div>
  <router-view />
</template>

<script lang="ts">
import { AppService } from "@/services/app.service";
import store from "@/store/index";
import firebase from "firebase/app";
import "firebase/auth";

import { Vue } from "vue-class-component";

export default class RegisterForm extends Vue {
  app = new AppService();

  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        store.state.user = user;
        console.log("user logged in!");
      } else {
        store.state.user = {} as firebase.User;
        console.log("user Not logged in!");
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
</style>
