<template>
  <div class="about">
    <h1>This is an Users page</h1>

    <div v-for="user in users" :key="user.uid" class="user-info">
      UID: {{ user.uid }} <br />
      Display Name: {{ user.displayName ?? "No Display Name" }} <br />
    </div>

    <p v-if="!fetchingUsers"> loading users ... </p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
export default class Users extends Vue {
  users: any[] = [];
  fetchingUsers = false;
  noMoreUsers = false;

  async fetchUsers() {
    if (this.fetchingUsers) return;
    if (this.noMoreUsers) return;
    this.fetchingUsers = true;

    const col = firebase
      .firestore()
      .collection("meta")
      .doc("user")
      .collection("public");

    let q = col.limit(30);
    if (this.users.length) {
      q = q.startAfter([this.users[this.users.length - 1]]);
      // q = col.orderBy('orderBy').startAfter([this.users[this.users.length - 1]]).limit(30);
    } 
    // else {
    //   q = col.limit(30);
    // }
    
    const snapshot = await q.get();
    console.log('Snapshot size:', snapshot.size);
    this.noMoreUsers = snapshot.size == 0;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["uid"] = docSnapshot.id;
      this.users.push(data);
    }
    this.fetchingUsers = false;
  }

  async created() {
    this.fetchUsers();
		window.addEventListener("scroll", this.handleScroll);
  }
    
  handleScroll(e: any) {
    const bottomOfWindow = 
    document.documentElement.scrollTop + window.innerHeight >
    document.documentElement.offsetHeight - 200;

    if (bottomOfWindow) {
      this.fetchUsers();
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  margin-bottom: 1.5em;
}
</style>