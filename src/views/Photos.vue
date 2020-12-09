<template>
  <div>
    <h1>This is an Photos page</h1>
  </div>

  <div v-for="url in urls" :key="url" >
    <img :src="url" alt="url" class="image">
  </div>
</template>

<script lang="ts">

import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import 'firebase/storage'

export default class Posts extends Vue {
  storageRef = firebase.storage().ref();

  urls: string[] = [];

  async created() {
    const res = await this.storageRef.child('forum-photos').listAll();

    console.log('Forum photos count: ', res.items.length);
    res.items.forEach(async item => {
        const downloadURL = await item.getDownloadURL();
        this.urls.push(downloadURL);
    })
  }
}
</script>

<style lang="scss" scoped>
.image {
  width: 100%;
}
</style>