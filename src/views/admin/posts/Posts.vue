<template>
  <div class="posts">
    <h2>
      Category:
      <select v-model="search.category" @change="onSearch()">
        <option value="">All</option>
        <option v-for="category of categories" :key="category">
          {{ category }}
        </option>
      </select>
    </h2>
    <br />

    <!-- post create -->
    <div class="post-create" style="width: 50%">
      Title<br />
      <input
        type="text"
        name="title"
        id="title"
        v-model="newPostData.title"
        style="width: 100%"
      />
      <br />
      <br />
      Content<br />
      <textarea
        name="content"
        id="content"
        v-model="newPostData.content"
        style="width: 100%"
      />
      <div v-if="newPostData.files.length" class="d-flex m-2">
        <div
          v-for="url in newPostData.files"
          :key="url"
          class="position-relative"
          style="width: 150px; height: 150px"
        >
          <img :src="url" style="width: 100%; height: 100%" />
          <button
            type="button"
            class="position-absolute top left"
            @click="onClickDeleteFile(url)"
          >
            DELETE
          </button>
        </div>
      </div>
      <div class="d-flex">
        <input
          type="file"
          name="image_upload"
          id="image_upload"
          v-on:change="onImageChanged($event)"
        />
        <select v-if="!search.category" v-model="newPostData.category">
          <option disabled value="">Category</option>
          <option v-for="category of categories" :key="category">
            {{ category }}
          </option>
        </select>
        <button type="button" @click="onCreate()">Create</button>
      </div>
    </div>
    <br />

    <!-- delete selected button / search bar -->
    <div class="d-flex m-2">
      <button
        style="margin-right: 1.5em"
        type="button"
        @click="onDeleteAll()"
        :disabled="!selectedPostIDs.length"
      >
        DELETE SELECTED
      </button>
      <input
        style="margin-right: 0.5em"
        type="text"
        placeholder="Search User ID"
        v-model="search.uid"
      />
      <button type="button" @click="onSearch()">Search</button>
    </div>

    <!-- posts table -->
    <table class="posts-table">
      <tr>
        <th>
          <label for="select-all">
            <input
              type="checkbox"
              name="select-all"
              id="select-all"
              @change="onSelectAll($event.target.checked)"
              :checked="selectedPostIDs.length == posts.length"
            />
            All</label
          >
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
import "firebase/storage";
import PostComponent from "./Post-component.vue";
import { AppService } from "@/services/app.service";

@Options({
  components: {
    PostComponent,
  },
})
export default class Posts extends Vue {
  app = new AppService();
  limit = 30;
  categoriesCol = firebase.firestore().collection("categories");
  postsCol = firebase.firestore().collection("posts");
  storage = firebase.storage();
  forumPhotosFolder = "forum-photos";
  uploadProgress = 0;

  search = {
    uid: "",
    category: "",
  };

  newPostData: any = {
    title: "",
    content: "",
    category: "",
    files: [],
  };

  selectedPostIDs: any[] = [];
  categories: string[] = [];
  posts: any[] = [];

  fetchingCategories = false;
  fetching = false;
  noMorePosts = false;

  async created() {
    const cat = this.$route.params.category as any;
    if (cat != "all") this.search.category = cat;
    this.fetchPosts();
    this.fetchCategories();
    window.addEventListener("scroll", this.handleScroll);
  }

  async fetchCategories() {
    if (this.fetchingCategories) return;
    this.fetchingCategories = true;
    const snapshot = await this.categoriesCol.get();
    snapshot.docs.forEach((doc) => {
      this.categories.push(doc.id);
    });

    this.fetchingCategories = false;
  }

  onSearch() {
    console.log(this.search);
    this.posts = [];
    this.noMorePosts = false;
    this.fetchPosts();
  }

  async fetchPosts() {
    if (this.fetching) return;
    if (this.noMorePosts) return;
    this.fetching = true;

    let q = this.postsCol.limit(this.limit);
    /// category filter
    if (this.search.category)
      q = q.where("category", "==", this.search.category);
    /// uid filter
    if (this.search.uid) q = q.where("uid", "==", this.search.uid);

    q = q.orderBy("createdAt", "desc");

    if (this.posts.length) {
      q = q.startAfter(this.posts[this.posts.length - 1]["createdAt"]);
    }

    const snapshot = await q.get();
    this.fetching = false;
    console.log("Snapshot size:", snapshot.size);
    this.noMorePosts = snapshot.size < this.limit;

    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      data["id"] = docSnapshot.id;
      this.posts.push(data);
    }
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
    if (this.search.category) data.category = this.search.category;

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
      this.newPostData.files = [];
      alert("New post created!");
    } catch (e) {
      alert(e);
    }
  }

  async onImageChanged(event: any) {
    const file: File = event.target.files[0];
    const filename = this.app.getRandomString();

    const ref = this.storage.ref(this.forumPhotosFolder + "/" + filename);
    const customMeta = { uid: firebase.auth().currentUser?.uid as string };
    const task = ref.put(file, {
      customMetadata: customMeta,
    });

    /// TODO: upload progress indicator
    task.on("next", (snapshot) => {
      console.log("upload", snapshot.bytesTransferred, snapshot.totalBytes);
      console.log(
        "upload progress",
        snapshot.bytesTransferred / snapshot.totalBytes
      );
    });

    try {
      await task;
      const url = await ref.getDownloadURL();
      this.newPostData.files.push(url);
      this.app.alert("Upload success!");
    } catch (e) {
      this.app.error(e);
    }
  }

  async onClickDeleteFile(url: string) {
    console.log(url);
    url = this.app.getStorageFileFromUrl(url, this.forumPhotosFolder);

    try {
      await this.app.fileDelete(url);
      const pos = this.newPostData.files.findIndex((e: string) => e == url);
      this.newPostData.files.splice(pos, 1);

      console.log("success file deletion.");
    } catch (e) {
      console.log("error on deleting file: , ", e);
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
    alert("Selected Posts deleted!");
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
