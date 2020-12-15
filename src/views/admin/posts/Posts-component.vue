<template>
  <div class="post">
    Post ID: {{ post.id }} | Category: {{ post.category }} <br />
    <div class="meta">
      <img v-if="post.photoURL" :src="post.photoURL" :alt="post.photoURL" />
      <div>
        <b>Title</b>: {{ post.title ?? "No title" }}, <b>Content</b>:
        {{ post.content }} <br />
        Owner: {{ post.displayName ?? "No Display Name" }} <br />
        Files {{ post.files?.length }}
      </div>
    </div>
    <div class="content">Owner UID: {{ post.uid }} <br /></div>
    <button type="button" @click="onDelete()">DELETE</button>
    <hr />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";

@Options({
  props: ["post"]
})
export default class PostComponent extends Vue {
  postsCol = firebase.firestore().collection("posts");
  post!: any;

  inEdit = false;

  created() {
    console.log("post component");
  }

  onSave() {
    console.log(this.post);
  }

  async onDelete() {
    console.log("delete", this.post.id);

    try {
      await this.postsCol.doc(this.post.id).delete();
      alert("post deleted!");
    } catch (e) {
      console.log(e);
      alert(e);
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
