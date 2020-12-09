<template>
  <div class="about">
    <h1>This is an Users page</h1>

    <div v-for="user in users" :key="user.uid">
      {{ user.uid }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
export default class Users extends Vue {
  users: any[] = [];
  async created() {
    const col = firebase
      .firestore()
      .collection("meta")
      .doc("user")
      .collection("public");

    let q = col.limit(30);
    if (this.users.length) {
      q = q.startAfter([this.users[this.users.length - 1]]);
    }
    const snapshot = await q.get();
    console.log(snapshot.size);

    for (const docSnapshot of snapshot.docs) {
      this.users.push(docSnapshot.data());
    }

    console.log(this.users);
  }
}
</script>
