<template>
  <div class="list">
    <h1>This is an Categories page</h1>

    <p>Forum categories:</p>
    <p v-for="category in categories" :key="category['id']">
      {{ category['id'] }}
    </p>

    <p v-show="fetchingCategories"> Loading category list .. </p>
  </div>
</template>


<script lang="ts">
import { Vue } from "vue-class-component";
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
}
</script>

<style lang="scss" scoped>
.list {
  text-align: left;
}
</style>