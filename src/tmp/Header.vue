<template>
  <header
    class="d-flex justify-content-between"
    v-if="currentRoute != '/private-policy'"
  >
    <div class="d-flex">
      <router-link class="logo" to="/">나리야</router-link>
      <!-- <router-link to="/register" v-if="app.notLoggedIn">회원가입</router-link> -->
      <router-link to="/profile" v-if="app.loggedIn">프로필</router-link>
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <div class="d-flex">
      <router-link to="/private-policy">개인정보보호</router-link>
      <router-link to="/contacts">연락처</router-link>
      <router-link to="/admin" v-if="app.isAdmin">Admin</router-link>
      <router-link to="/login" v-if="app.notLoggedIn">로그인</router-link>
      <router-link to="/logout" v-if="app.loggedIn">로그아웃</router-link>
    </div>
  </header>
</template>
