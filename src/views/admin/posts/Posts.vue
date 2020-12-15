<template>
  <div class="about">
    <h1>This is an posts page</h1>

    <div>
      <a href="/admin/posts/all">All</a>
      <a
        :href="'/admin/posts/' + category"
        v-for="category in categories"
        :key="category"
        >{{ category }}</a
      >
    </div>

    <br />
    <h2>{{ category }}</h2>
    <br />

    <div v-for="post in posts" :key="post.id">
      <post-component :post="post" @on-deleted="onDeleted($event)"> </post-component>
    </div>

    <p v-if="fetching">loading posts ...</p>
    <p v-if="noMorePosts">No more posts ...</p>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
import PostComponent from "./Posts-component.vue";

@Options({
  components: {
    PostComponent
  }
})
export default class Posts extends Vue {
  limit = 30;
  categoriesCol = firebase.firestore().collection("categories");
  postsCol = firebase.firestore().collection("posts");

  categories: string[] = [];
  posts: any[] = [];

  fetchingCategories = false;
  fetching = false;
  noMorePosts = false;

  category = "";

  async fetchCategories() {
    if (this.fetchingCategories) return;
    this.fetchingCategories = true;
    const snapshot = await this.categoriesCol.get();
    snapshot.docs.forEach((doc) => {
      this.categories.push(doc.id);
    });

    this.fetchingCategories = false;
  }

  async fetchPosts() {
    if (this.fetching) return;
    if (this.noMorePosts) return;
    this.fetching = true;

    let q = this.postsCol.limit(this.limit);
    if (this.category) q = q.where("category", "==", this.category);

    q = q.orderBy("createdAt", "desc");

    if (this.posts.length) {
      q = q.startAfter(this.posts[this.posts.length - 1]["createdAt"]);
    }

    const snapshot = await q.get();
    this.fetching = false;
    // console.log("Snapshot size:", snapshot.size);
    this.noMorePosts = snapshot.size < this.limit;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["id"] = docSnapshot.id;
      this.posts.push(data);
    }
  }

  async created() {
    this.category = this.$route.params.category as any;
    this.fetchPosts();
    this.fetchCategories();
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

  onDeleted(id: string) {
    console.log('onDeleted', id);
  }
}
</script>
