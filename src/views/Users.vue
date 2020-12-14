<template>
  <div class="about">
    <h1>This is an Users page</h1>

    <div v-for="user in users" :key="user.uid" class="user-info">
      <img v-if="user.photoURL" :src="user.photoURL" :alt="user.photoURL" class="user-photo">
      <div>        
        UID: {{ user.uid }} <br />
        Display Name: {{ user.displayName ?? "No Display Name" }} <br />
        Greeting: {{ user.greeting ?? 'None' }}
      </div>
    </div>

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

    let q = this.col.orderBy("listOrder", "desc");
    if (this.users.length) {
      q = q.startAfter(this.users[this.users.length - 1]["listOrder"]);
    }
    q = q.limit(30);

    const snapshot = await q.get();
    console.log("Snapshot size:", snapshot.size);
    this.noMoreUsers = snapshot.size == 0;

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

<style lang="scss" scoped>
.user-info {
  display: flex;
  text-align: left;
  margin-bottom: 1.5em;
}

.user-photo {
  height: 50px;
  width: 50px;
}
</style>
