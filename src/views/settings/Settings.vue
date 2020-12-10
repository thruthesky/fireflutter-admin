<template>
  <div class="settings">
    <h1>
      Forum Settings
    </h1>

    <router-link to="/settings/forum/forum">Edit Global Settings</router-link>
    <br>
    <br>
    <div v-for="category of categories" :key="category.id" class="item">
      ID: {{ category.id }} <br>
      <router-link :to="'/settings/forum/' + category.id">Edit Settings</router-link>
    </div>

    <p v-show="fetchingCategories"> Fetching other category settings ... </p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { proxy } from "../../services/functions";
import firebase from "firebase/app";
import "firebase/firestore";

export default class Categories extends Vue {
  col = firebase.firestore().collection("categories");

  categories: any[] = [];
  fetchingCategories = false;

  async fetchCategories() {
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
.settings {
  text-align: left;
  padding: .5em;
}

.item {
  margin-bottom: 1em;
}
</style>