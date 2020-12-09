<template>
  <div>
    <h1>This is an Photos page</h1>
  </div>

  <h3>Image count: {{ imageCount }}</h3>
  <div v-for="url in urls" :key="url" class="image-holder">
    {{ url }}
    <img :src="url" alt="url" class="image">
    <hr>
  </div>

  <p v-if="loadingPhotos"> Loading photos ... </p>
  <p v-if="nextPageToken == null"> No more photos ... </p>
</template>

<script lang="ts">

import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import 'firebase/storage'

export default class Posts extends Vue {
  storageRef = firebase.storage().ref();
  forumPhotos = this.storageRef.child('forum-photos');

  /// if `null`, means the server returned all possible images.
  /// can also be used to check if no more photos.
  nextPageToken: any = '';
  urls: string[] = [];
  imageCount = 0;

  loadingPhotos = false;

  async fetchImages() {
    if (this.loadingPhotos) return;

    /// next page token is an empty string by default.
    /// once we fetch more images and the result length is less than the maxResults
    /// result.nextPageToken will contain a null value.
    if (this.nextPageToken == null) return;
    this.loadingPhotos = true;

    const res = await this.forumPhotos.list({ maxResults: 20, pageToken: this.nextPageToken});

    this.nextPageToken = res.nextPageToken;
    console.log("next page token :", this.nextPageToken);

    this.imageCount += res.items.length;
    console.log("image count: ", this.imageCount);

    res.items.forEach(async item => {
        const downloadURL = await item.getDownloadURL();
        this.urls.push(downloadURL);
    })
    this.loadingPhotos = false;
  }

  created() {
    this.fetchImages();
    window.addEventListener("scroll", this.handleScroll);
  }
  
  handleScroll(e: any) {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 200;

    if (bottomOfWindow) {
      this.fetchImages();
    }
  }
}
</script>

<style lang="scss" scoped>
.image-holder {
  margin-bottom: 1em;
}

.image {
  width: 100%;
}
</style>