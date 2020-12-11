<template>
  <div class="purchases">
    <h1>Purchases</h1>

    <form @submit.prevent="onSubmit">
      <input type="text" v-model="form.uid" />
      <button>
        Search
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

import firebase from "firebase/app";
import "firebase/firestore";
import { proxy } from "@/services/functions";
export default class Purchases extends Vue {
  col = firebase.firestore().collection("purchase");

  form = {};

  async created() {
    console.log("getting purchases");

    const got = await this.col.get();
    got.docs.forEach((d) => console.log(d.data()));
  }

  async onSubmit() {
    const data = proxy(this.form);
    console.log(data);

    const got = await this.col.where("uid", "==", data.uid).get();
    got.docs.forEach((d) => console.log(d.data()));
  }
}
</script>
