<template>
  <div class="login-form">
    <h1>Login</h1>
    <form @submit.prevent="onSubmit">
      <div>
        Email
        <input type="email" name="email" v-model="form.email" />
      </div>
      <div>
        Password
        <input type="password" name="password" v-model="form.password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script lang="ts">
import { AppService } from "@/services/app.service";
import firebase from "firebase/app";
import "firebase/auth";

import { Vue } from "vue-class-component";

export default class LoginForm extends Vue {
  app = new AppService();

  form: any = {};

  async onSubmit() {
    try {
      const credential = await firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password);
      this.app.alert("login success");
    } catch (e) {
      this.app.error(e);
    }
    return;
  }
}
</script>

<style scoped lang="scss"></style>
