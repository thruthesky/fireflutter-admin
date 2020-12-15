<template>
  <div class="about">
    <h1>User list in /meta/user/public collection</h1>

    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">UID / Name / Greeting</th>
          <th scope="col">Name</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid">
          <td>
            <img v-if="user.photoURL" :src="user.photoURL" class="avatar" />
          </td>
          <td>
            <div class="sm">{{ user.uid }}</div>
            <div class="md bold">{{ user.displayName }}</div>
            <div class="sm grey">{{ user.greeting ?? "" }}</div>
          </td>
          <td></td>
        </tr>
      </tbody>
    </table>

    <p v-if="fetchingUsers">loading users ...</p>
    <p v-if="!fetchingUsers">No more users ...</p>
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

  col = firebase
    .firestore()
    .collection("meta")
    .doc("user")
    .collection("public");

  async fetchUsers() {
    if (this.fetchingUsers) return;
    if (this.noMoreUsers) return;
    this.fetchingUsers = true;

    let q = this.col.orderBy("updatedAt", "desc");
    if (this.users.length) {
      q = q.startAfter(this.users[this.users.length - 1]["updatedAt"]);
    }
    q = q.limit(30);

    const snapshot = await q.get();
    console.log("Snapshot size:", snapshot.size);
    this.noMoreUsers = snapshot.size < 30;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["uid"] = docSnapshot.id;
      // console.log("data.firstname", data["firstName"]);
      // console.log("data.listOrder", data["listOrder"]);
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

<style lang="scss" scoped></style>
