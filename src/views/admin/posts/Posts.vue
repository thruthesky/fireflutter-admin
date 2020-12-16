<template>
  <div class="posts">
    <!-- posts categories -->
    <div>
      <a href="/admin/posts/all">All</a> |
      <a
        :href="'/admin/posts/' + category"
        v-for="category in categories"
        :key="category"
        >{{ category }}</a
      >
    </div>
    <h2>Category: {{ category ?? "All" }}</h2>
    <br />

    <!-- post create -->
    <div class="post-create">
      <label for="title">Title</label>
      <input type="text" name="title" id="title" v-model="newPostData.title" />
      <label for="content">Content</label>
      <input
        type="text"
        name="content"
        id="content"
        v-model="newPostData.content"
      />
      <select v-if="!category" v-model="newPostData.category">
        <option disabled value="">Category</option>
        <option v-for="category of categories" :key="category">
          {{ category }}
        </option>
      </select>
      <button type="button" @click="onCreate()">Create</button>
    </div>
    <br />

    <!-- posts table -->
    <button
      type="button"
      @click="onDeleteAll()"
      :disabled="!selectedPostIDs.length"
    >
      DELETE SELECTED
    </button>
    <br />
    <br />
    <table class="posts-table">
      <tr>
        <th>
          <input
            type="checkbox"
            name="select-all"
            id="select-all"
            @change="onSelectAll($event.target.checked)"
            :checked="selectedPostIDs.length == posts.length"
          />
          <label for="select-all">All</label>
        </th>
        <th>Post ID / User ID / Category</th>
        <th>Title / Content</th>
        <th>Files</th>
        <th>Buttons</th>
      </tr>
      <tr
        v-for="post in posts"
        :key="post.id"
        style="border-bottom: 1px solid black"
      >
        <td>
          <input type="checkbox" :value="post.id" v-model="selectedPostIDs" />
        </td>
        <post-component :post="post" @on-deleted="onDeleted($event)" />
      </tr>
    </table>
    <br />
    <p v-if="fetching">loading posts ...</p>
    <p v-if="noMorePosts">No more posts ...</p>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
import PostComponent from "./Post-component.vue";

@Options({
  components: {
    PostComponent,
  },
})
export default class Posts extends Vue {
  limit = 30;
  categoriesCol = firebase.firestore().collection("categories");
  postsCol = firebase.firestore().collection("posts");

  newPostData: any = {
    title: "",
    content: "",
    category: "",
  };
  selectedPostIDs: any[] = [];
  categories: string[] = [];
  posts: any[] = [];

  fetchingCategories = false;
  fetching = false;
  noMorePosts = false;

  category = null;

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
    const cat = this.$route.params.category as any;
    if (cat != "all") this.category = cat;
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

  /**
   * Creates new post
   *
   * TODO: add files.
   */
  async onCreate() {
    const data: any = {};
    Object.assign(data, this.newPostData);
    if (this.category) data.category = this.category;

    if (!data.category) {
      return alert("Please choose category");
    }
    data.uid = firebase.auth().currentUser?.uid;
    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    data.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

    // console.log(data);
    try {
      const post = await this.postsCol.add(data);
      data.id = post.id;
      this.posts.unshift(data);
      this.newPostData.title = "";
      this.newPostData.content = "";
      alert("New post created!");
    } catch (e) {
      alert(e);
    }
  }

  onSelectAll(checked: boolean) {
    this.selectedPostIDs = [];
    if (checked) {
      this.posts.forEach((post) => this.selectedPostIDs.push(post.id));
    }
  }

  onDeleteAll() {
    const conf = confirm("Delete selected posts?");

    if (!conf) return;

    this.selectedPostIDs.forEach((id) => {
      this.postsCol.doc(id).delete();
      this.onDeleted(id);
    });

    this.selectedPostIDs = [];
    alert('Selected Posts deleted!');
  }

  onDeleted(id: string) {
    const idx = this.posts.findIndex((post) => post.id == id);
    this.posts.splice(idx, 1);
  }
}
</script>


<style lang="scss" scoped>
.posts-table {
  width: 100%;
  tr {
    padding: 0.25em !important;
  }

  tr > th {
    border: 1px solid black;
  }
}
</style>
