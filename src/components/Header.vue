<template>
  <header
    class="d-flex justify-content-between"
    v-if="currentRoute != '/private-policy'"
  >
    <div class="d-flex">
      <router-link class="logo" to="/">FireFlutter</router-link>
      <router-link to="/login" v-if="app.notLoggedIn">Login</router-link>
      <router-link to="/register" v-if="app.notLoggedIn">Register</router-link>
      <router-link to="/profile" v-if="app.loggedIn">Profile</router-link>
      <router-link to="/contacts">Contacts</router-link>
      <router-link to="/private-policy">Private Policy</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/logout" v-if="app.loggedIn">Logout</router-link>
    </div>
    <div>
      <router-link to="/admin" v-if="app.isAdmin">Admin</router-link>
    </div>
  </header>
</template>
