<template>
  <div class="list">
    <h2>Categories page</h2>

    <p>Forum categories:</p>

    <table class="table">
      <tr>
        <th>ID</th>
        <th>TITLE</th>
        <th>DESCRIPTION</th>
        <th>ACTIONS</th>
      </tr>
      <tr v-for="category in categories" :key="category.id">
        <td>{{ category.id }}</td>
        <td><input type="text" v-model="category.title" /></td>
        <td><input type="text" v-model="category.description" /></td>
        <td><a :href="'/admin/settings/forum/' + category.id">Settings</a></td>
      </tr>
    </table>

    <button type="button" @click="onSave()">Save</button>

    <p v-show="fetchingCategories">Loading category list ..</p>
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
      this.col.doc(category["id"]).update({
        title: category.title ?? "",
        description: category.description ?? "",
      });
    });
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  & tr > th {
    border: 1px solid black;
  }
}

input {
  width: 100%;
}
</style>
