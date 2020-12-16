<template>
  <div class="home">
    Home
    <div v-if="app.loggedIn">User logged: uid: {{ app.user.uid }}</div>
    <div v-if="app.notLoggedIn">
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import LoginForm from "@/components/LoginForm.vue"; // @ is an alias to /src
import { AppService } from "@/services/app.service";

import firebase from "firebase/app";
import "firebase/functions";

@Options({
  components: {
    LoginForm
  }
})
export default class Home extends Vue {
  app = new AppService();

  async created() {
    console.log("begin create user");
    try {
      const userCreate = await firebase
        .app()
        .functions("asia-northeast3")
        .httpsCallable("userDelete");
      const re = await userCreate("abc");
      console.log("re: ", re);
    } catch (e) {
      console.log(e);
    }
  }
}
</script>
