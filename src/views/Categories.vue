<template>
  <div class="list">
    <h1>This is an Categories page</h1>

    <p>Forum categories:</p>
    <div v-for="category in categories" :key="category['id']" class="item">
      ID: {{ category["id"] }} <br>
      Title: <input type="text" v-model="category['title']" /> <br>
      Description: <input type="text" v-model="category['description']" /> <br>
    </div>

    <button type="button" @click="onSave()">Save</button>

    <p v-show="fetchingCategories">Loading category list ..</p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { proxy } from "../services/functions";
import firebase from "firebase/app";
import "firebase/firestore";

export default class Categories extends Vue {
  col = firebase.firestore().collection("categories");

  categories: any[] = [];
  fetchingCategories = false;

  async fetchCategories() {
    if (this.fetchingCategories) return;
    this.fetchingCategories = true;

    const snapshot = await this.col.get();
    snapshot.docs.forEach((doc) => {
      this.categories.push(doc.data());
    });

    this.fetchingCategories = false;
  }

  created() {
    this.fetchCategories();
  }
  onSave() {
    // console.log(proxy(this.categories));
    this.categories.map((category) => {
      this.col
        .doc(category["id"])
        .update({
          title: category.title ?? "",
          description: category.description ?? ""
        });
    });
  }
}
</script>

<style lang="scss" scoped>
.list {
  text-align: left;
}

.item {
  margin-bottom: 1em;
}
</style>
