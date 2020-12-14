<template>
  <div class="about">
    <h1>This is an posts page</h1>

    <div v-for="post in posts" :key="post.id" class="post">
      <!-- {{ post }} -->
      Post ID: {{ post.id }} <br />
      <div class="meta">
        <img v-if="post.photoURL" :src="post.photoURL" :alt="post.photoURL">
        <div>
          Title: {{ post.title ?? "No title"}} <br />          
          Owner: {{ post.displayName ?? "No Display Name" }} <br />
          Files {{ post.files?.length }}
        </div>
      </div>
      <div class="content">
        Owner UID: {{ post.uid }} <br />
      </div>
      <hr>
    </div>

    <p v-if="fetchingPosts">loading posts ...</p>
    <p v-if="!fetchingPosts">No more posts ...</p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
export default class Posts extends Vue {
  posts: any[] = [];
  fetchingPosts = false;
  noMorePosts = false;

  col = firebase
    .firestore()
    .collection("posts");

  async fetchPosts() {
    if (this.fetchingPosts) return;
    if (this.noMorePosts) return;
    this.fetchingPosts = true;

    let q = this.col.orderBy("createdAt", "desc");
    if (this.posts.length) {
      q = q.startAfter(this.posts[this.posts.length - 1]["createdAt"]);
    }
    q = q.limit(30);

    const snapshot = await q.get();
    console.log("Snapshot size:", snapshot.size);
    this.noMorePosts = snapshot.size == 0;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["id"] = docSnapshot.id;
      this.posts.push(data);
    }
    this.fetchingPosts = false;
  }

  async created() {
    this.fetchPosts();
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll(e: any) {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 200;

    if (bottomOfWindow) {
      this.fetchPosts();
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  margin-bottom: 1.5em;
  text-align: left;

  .meta {
    display: flex;

    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>
