<template>
  <div class="post">
    Post ID: {{ post.id }} | Category: {{ post.category }} <br />
    <div class="meta">
      <img v-if="post.photoURL" :src="post.photoURL" :alt="post.photoURL" />
      <div>
        <b>Owner:</b> {{ post.displayName ?? "No Display Name" }} | <b>UID:</b>
        {{ post.uid }} <br />

        <div v-if="!inEdit">
          <b>Title</b>: {{ post.title ?? "No title" }}, <b>Content</b>:
          {{ post.content }} <br />
          Files {{ post.files?.length }}
        </div>
        <div v-if="inEdit">
          <p>
            Title:
            <input type="text" v-model="editData.title" />
            Content:
            <input type="text" v-model="editData.content" />
          </p>
          <button type="button" @click="inEdit = false">CANCEL</button>
          <button type="button" @click="onSave()">SAVE</button>
        </div>
      </div>
    </div>
    <br />
    <div v-if="!inEdit">
      <button type="button" @click="inEdit = true">EDIT</button>
      <button type="button" @click="onDelete()">DELETE</button>
    </div>
    <hr />
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";

@Options({
  props: ["post"],
  emits: ["on-deleted"],
})
export default class PostComponent extends Vue {
  postsCol = firebase.firestore().collection("posts");
  post!: any;

  editData: any;

  inEdit = false;

  created() {
    this.editData = this.post;
  }

  async onSave() {
    console.log(this.editData);
    try {
      await this.postsCol.doc(this.post.id).set(this.editData, { merge: true });
      Object.assign(this.post, this.editData);
      this.inEdit = false;
      alert("Post Updated!");
    } catch (e) {
      alert(e);
    }
  }

  async onDelete() {
    try {
      await this.postsCol.doc(this.post.id).delete();
      this.$emit("on-deleted", this.post.id);
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
      width: 75px;
      height: 75px;
    }
  }
}
</style>
