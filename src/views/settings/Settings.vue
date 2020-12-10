<template>
  <div class="about">
    <h1>This is an Settings page</h1>
    <div>
      Forum Settings
    </div>

    <div>
      <router-link to="/settings/forum/forum">Global Settings</router-link>
      <span v-for="category of categories" :key="category.id">
        <router-link :to="'/settings/forum/' + category.id">{{
          category.id
        }}</router-link>
      </span>
    </div>
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
    const snapshot = await this.col.get();
    snapshot.docs.forEach((doc) => {
      this.categories.push(doc.data());
    });
  }

  created() {
    this.fetchCategories();
  }
  onSave() {
    // firebase.firestore().collection('settings').doc('category.id').set({...}, {merge: true});
    // console.log(proxy(this.categories));
    // this.categories.map((category) => {
    //   this.col
    //     .doc(category["id"])
    //     .update({
    //       title: category.title ?? "",
    //       description: category.description ?? ""
    //     });
    // });
  }
}
</script>
