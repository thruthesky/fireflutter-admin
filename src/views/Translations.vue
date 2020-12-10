<template>
  <div class="page">
    <h1>Translations Page</h1>

    {{ translations }}

    <br>
    <br>
    <div class="input-group">
        <label for="newLanguange">New languange (code): </label>
        <input type="text" name="newLanguange" id="newLanguange" v-model="newLanguangeCode">
        <button @click="addNewDocument">Add Language Code</button>
    </div>

    <div v-for="(value, name) of translations" :key="name" class="item">
         <hr>
         Language Code [ {{ name }} ] : <br><br>
        
         <div v-for="(key, value) in value" :key="key">
            {{ key }} : {{ value }}
         </div>
    </div>

    <p v-show="fetchingTranslations">Loading translation list ..</p>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { proxy } from "../services/functions";
import firebase from "firebase/app";
import "firebase/firestore";

export default class Categories extends Vue {
  col = firebase.firestore().collection("translations");
  fetchingTranslations = false;

  newLanguangeCode = '';
  translations: any = {};

  async fetchTranslations() {
    this.fetchingTranslations = true;
    const res = await this.col.get();
    res.docs.forEach((doc) => {
        this.translations[doc.id] = doc.data();
    });
    this.fetchingTranslations = false;
  }

  async addNewDocument() {
    if (!this.newLanguangeCode) return;
    try {
        await this.col.doc(this.newLanguangeCode).set({});
        this.translations[this.newLanguangeCode] = {};
        this.newLanguangeCode = '';
        alert("New language code added!");
    } catch(e) {
        alert(e);
    }
  }

  created() {
    this.fetchTranslations();
  }
  onSave() {
    // console.log(proxy(this.categories));
  }
}
</script>


<style lang="scss" scoped>
.page {
    text-align: left;
}

.input-group {
    display: inline;
}

.item {
    padding: .5em;
    margin: .5em;
}
</style>