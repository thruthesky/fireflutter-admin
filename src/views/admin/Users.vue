<template>
  <div class="about">
    <h1>User list in /users collection</h1>

    <button @click="onSelectAllUsers">Select all users(in the list)</button>
    <button @click="onDeleteSelectedUsers">Delete selected users</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Photo</th>
          <th scope="col">UID / Name / Greeting</th>
          <th scope="col">Name</th>
          <th scope="col">Last</th>
          <th scope="col">Buttons</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.uid">
          <td>
            <input
              type="checkbox"
              :id="user.uid"
              :value="user.uid"
              v-model="checkbox"
            />
          </td>
          <td>
            <img v-if="user.photoURL" :src="user.photoURL" class="avatar" />
          </td>
          <td>
            <div class="sm">{{ user.uid }}</div>
            <div class="md bold">{{ user.displayName }}</div>
            <div class="sm grey">{{ user.greeting ?? "" }}</div>
          </td>
          <td></td>
          <td>.</td>
          <td>
            <button type="button" @click="onDelete(user.uid)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="fetching">loading users ...</p>
    <p v-if="noMoreUsers">No more users ...</p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
import { AppService } from "@/services/app.service";
import { proxy } from "@/services/functions";
export default class Users extends Vue {
  app = new AppService();
  limit = 30;
  users: any[] = [];
  fetching = false;
  noMoreUsers = false;

  checkbox: any = [];

  col = firebase.firestore().collection("users");

  lastSnapshot: any;

  async fetchUsers() {
    if (this.fetching) return;
    if (this.noMoreUsers) return;
    this.fetching = true;

    let q = this.col.limit(this.limit);
    // .orderBy("updatedAt", "desc");
    if (this.lastSnapshot) {
      q = q.startAfter(this.lastSnapshot);
    }
    // q = q.limit(this.limit);

    const snapshot = await q.get();

    this.fetching = false;
    console.log("Snapshot size:", snapshot.size);
    this.noMoreUsers = snapshot.size < this.limit;

    for (const docSnapshot of snapshot.docs) {
      this.lastSnapshot = docSnapshot;
      const data = docSnapshot.data();
      data["uid"] = docSnapshot.id;
      // console.log("data.firstname", data["firstName"]);
      // console.log("data.listOrder", data["listOrder"]);
      this.users.push(data);
    }
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
  onDelete(uid: string) {
    console.log(uid);
    try {
      this.app.userDelete(uid);
    } catch (e) {
      console.log(e);
    }
  }
  onDeleteSelectedUsers() {
    const uids = proxy(this.checkbox);
    this.onDelete(uids);
  }
  onSelectAllUsers() {
    this.checkbox = [];
    this.users.forEach((user) => {
      this.checkbox.push(user.uid);
    });
  }
}
</script>

<style lang="scss" scoped></style>
