<template>
  <hr />

  <div id="nav">
    <router-link to="/admin/users">Users</router-link> |
    <router-link to="/admin/categories">Categories</router-link> |
    <router-link to="/admin/posts">Posts</router-link> |
    <router-link to="/admin/photos">Photos</router-link> |
    <router-link to="/admin/purchases">Purchases</router-link> |
    <router-link to="/admin/settings">Settings</router-link> |
    <router-link to="/admin/translations">Translations</router-link>

    <p v-if="app.loggedIn">Current user Email: {{ $store.state.user.email }}</p>
    <span v-if="app.isAdmin">You are an ADMIN!</span>
  </div>
  <hr />
  <router-view />
</template>
