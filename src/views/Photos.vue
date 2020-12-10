<template>

  <p>Active Path : {{ activePath }}</p>

  <button v-for="path in paths" :key="path" @click="onClickChangeFolder(path)">
    {{ path }}
  </button>

  <p>Image Count {{ imageCounts[activePath] }} </p>

  <div class="grid">
    <div v-for="url of urls[activePath]" :key="url" class="image-holder">
      <!-- {{ url }} -->
      <img :src="url" :alt="url" class="image">
    </div>
  </div>
</template>

<script lang="ts">

import { Vue } from "vue-class-component";
import firebase from "firebase/app";
import 'firebase/storage'

export default class Posts extends Vue {
  storageRef = firebase.storage().ref();
  paths = ['forum-photos', 'user-profile-photos'];
  activePath = '';

  nextPageTokens: any = {
    'forum-photos': '',
    'user-profile-photos': '',
  }
  imageCounts: any = {
    'forum-photos': 0,
    'user-profile-photos': 0,
  }
  urls: any = {
    'forum-photos': [],
    'user-profile-photos': [],
  }

  loadingPhotos = false;

  onClickChangeFolder(path: string) {
    this.activePath = path;
    if (!this.urls[path].length) {
      this.fetchImages(path);
    }
  }

  async fetchImages(path: string) {
    this.activePath = path;
    console.log('path', path);

    if (this.loadingPhotos) return;
    if (this.nextPageTokens[path] == null) return;

    this.loadingPhotos = true;

    const listRef = this.storageRef.child(path);
    const res = await listRef.list({ maxResults: 20, pageToken: this.nextPageTokens[path] });

    this.nextPageTokens[path] = res.nextPageToken;
    console.log("next page token :", this.nextPageTokens[path]);

    this.imageCounts[path] += res.items.length;
    console.log("image count: ", this.imageCounts[path]);

    res.items.forEach(async item => {
        const downloadURL = await item.getDownloadURL();
        this.urls[path].push(downloadURL);
    })
    this.loadingPhotos = false;
  }

  created() {
    this.fetchImages(this.paths[0]);
    window.addEventListener("scroll", this.handleScroll);
  }
  
  handleScroll(e: any) {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >
      document.documentElement.offsetHeight - 200;

    if (bottomOfWindow) {
      this.fetchImages(this.activePath);
    }
  }
}
</script>

<style lang="scss" scoped>
.image-holder {
  box-sizing: border-box;
  padding: .25em;
}


@media screen and (min-width: 1200px) {
   .image-holder {
      width: 10%;
   }
}

@media screen and (max-width: 1200px) {
   .image-holder {
      width: 25%;
   }
}

@media screen and (max-width: 900px) {
   .image-holder {
      width: 33%;
   }
}

@media screen and (max-width: 500px) {
   .image-holder {
      flex: 50%;
   }
}

.image {
  width: 100%;
}

.grid {
   display: flex;
   flex-wrap: wrap;
   padding: 0 4px;
}
</style>