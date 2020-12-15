<template>
  <div class="about">
    <h1>This is an posts page</h1>

    <div>
      <button
        v-for="category in categories"
        :key="category"
        type="button"
        @click="fetchPosts(category)"
      >
        {{ category }}
      </button>
    </div>

    <br />
    <h2>{{ activeCategory }}</h2>
    <br />

    <div v-for="post in posts" :key="post.id">
      <post-component :post="post"> </post-component>
    </div>

    <p v-if="fetchingPosts">loading posts ...</p>
    <p v-if="!fetchingPosts">No more posts ...</p>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
import PostComponent from "./Posts-component.vue";

@Options({
  components: {
    PostComponent,
  },
})
export default class Posts extends Vue {
  categoriesCol = firebase.firestore().collection("categories");
  postsCol = firebase.firestore().collection("posts");

  categories: string[] = [];
  posts: any[] = [];

  fetchingCategories = false;
  fetchingPosts = false;
  noMorePosts = false;

  activeCategory = "";

  async fetchCategories() {
    if (this.fetchingCategories) return;
    this.fetchingCategories = true;
    const snapshot = await this.categoriesCol.get();
    snapshot.docs.forEach((doc) => {
      this.categories.push(doc.id);
    });

    this.fetchingCategories = false;
    this.fetchPosts(this.categories[1]);
  }

  async fetchPosts(category: string) {
    // console.log('category,', category);
    // console.log('this.activeCategory,', this.activeCategory);
    if (!category) return;
    if (this.fetchingPosts) return;
    if (this.noMorePosts) return;
    this.fetchingPosts = true;

    if (this.activeCategory != category) this.posts = [];
    this.activeCategory = category;

    let q = this.postsCol.orderBy("createdAt", "desc");
    if (this.posts.length) {
      q = q.startAfter(this.posts[this.posts.length - 1]["createdAt"]);
    }
    q = q.where("category", "==", category);
    q = q.limit(30);

    const snapshot = await q.get();
    // console.log("Snapshot size:", snapshot.size);
    this.noMorePosts = snapshot.size == 0;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["id"] = docSnapshot.id;
      this.posts.push(data);
    }
    this.fetchingPosts = false;
  }

  async created() {
    this.fetchCategories();
    window.addEventListener("scroll", this.handleScroll);
  }

  handleScroll(e: any) {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 200;

    if (bottomOfWindow) {
      this.fetchPosts(this.activeCategory);
    }
  }
}
</script>

