<template>
  <section class="search-posts pt-5">
    <h1>Search Posts</h1>
    <form @submit.prevent="onSubmit">
      <div>
        <input v-model="keyword" />
      </div>
      <button class="form-submit" type="submit">submit</button>
    </form>
  </section>
</template>
<script lang="ts">
import { AppService } from "@/services/app.service";
import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import algoliasearch from "algoliasearch";

export default class SearchPosts extends Vue {
  keyword = "";

  client: any;
  index: any;

  created() {
    this.client = algoliasearch(
      "W42X6RIXO5",
      "962a64f527cc761542f6042e522b6023"
    );
    this.index = this.client.initIndex("Dev");
  }
  onSubmit() {
    console.log("keword: ", this.keyword);

    const requestOptions = {
      headers: { "X-Algolia-UserToken": "user123" }
    };

    this.index.search(this.keyword, requestOptions).then((re: any) => {
      console.log(re.hits);
    });
  }
}
</script>
