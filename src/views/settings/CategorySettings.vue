<template>
  <div class="about">
    <h1>Forum Setting: {{ "category.id" }}</h1>

    <div>
      Like: enable, disable
    </div>
    <div>
      Dislike: enable, disable
    </div>
    <div>
      No of posts per each fetch: [ 20 ]
    </div>

    <button>Submit</button>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { proxy } from "../../services/functions";
import firebase from "firebase/app";
import "firebase/firestore";

export default class CategorySettings extends Vue {
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
  // onSave() {
  //   console.log(proxy(this.categories));
  //   this.categories.map((category) => {
  //     this.col
  //       .doc(category["id"])
  //       .update({
  //         title: category.title ?? "",
  //         description: category.description ?? ""
  //       });
  //   });
  // }
}
</script>
