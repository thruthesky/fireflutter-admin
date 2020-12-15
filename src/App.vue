<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">FireFlutter</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link" href="#">Contacts</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Policy</a>
          </li>
        </ul>

        <router-link to="/admin">Admin</router-link>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="row">
      <div class="col-sm">
        One of three columns
      </div>
      <div class="col-sm">
        One of three columns
      </div>
      <div class="col-sm">
        One of three columns
      </div>
    </div>
  </div>

  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/users">Users</router-link> |
    <router-link to="/categories">Categories</router-link> |
    <router-link to="/posts">Posts</router-link> |
    <router-link to="/photos">Photos</router-link> |
    <router-link to="/purchases">Purchases</router-link> |
    <router-link to="/settings">Settings</router-link> |
    <router-link to="/translations">Translations</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/profile">Profile</router-link> |
    <router-link to="/logout">Logout</router-link> |
    <router-link to="/about">About</router-link>

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
</style>
