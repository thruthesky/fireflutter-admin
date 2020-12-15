<template>
  <div class="page">
    <h1>Translations Page</h1>
    Existing Language codes : {{ languageCodes }}
    <br />
    <br />
    <div class="input-group">
      <label for="newLanguange">New languange (code): </label>
      <input type="text" name="newLanguange" v-model="newLanguangeCode" />
      <button @click="addNewLanguageCode">Add Language Code</button>
    </div>
    <br />
    <br />
    <div v-if="languageCodes.length > 0" class="input-group">
      <label for="newTranslationCode">New Translation (code): </label>
      <input
        type="text"
        name="newTranslationCode"
        v-model="newTranslationCode"
      />
      <button @click="onSave(newTranslationCode)">Add Translation Code</button>
    </div>
    <hr>
    <div v-for="(value, name) in translations" :key="name">
      <b>Code: {{ name }}</b>
      <br />
      <br />
      <div v-for="lc in languageCodes" :key="lc" style="margin: .5em;">
        {{ lc }} : <input type="text" v-model="value[lc]" />
      </div>
      <br />
      <button type="button" @click="onSave(name)">Save</button>
      <hr>
    </div>

    <p v-show="translations.length < 1">No translations yet</p>
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

  newLanguangeCode = "";
  newTranslationCode = "";

  languageCodes: string[] = [];
  translations: {
    [key: string]: {
      [key: string]: {};
    };
  } = {};

  created() {
    this.fetchTranslations();
  }

  async fetchTranslations() {
    this.fetchingTranslations = true;
    const res = await this.col.get();
    res.docs.forEach((doc) => {
      const lc = doc.id;
      this.languageCodes.push(lc);
      const data = doc.data();
      const keys = Object.keys(data);

      keys.forEach((key) => {
        if (!this.translations[key]) this.translations[key] = {};
        this.translations[key][lc] = data[key];
      });
    });
    this.fetchingTranslations = false;
  }

  async addNewLanguageCode() {
    if (!this.newLanguangeCode) return;

    const keys = Object.keys(this.translations);
    const data: any = {};
    keys.forEach((key) => {
      data[key] = "";
    });

    try {
      await this.col.doc(this.newLanguangeCode).set(data);
      this.languageCodes.push(this.newLanguangeCode);
      this.newLanguangeCode = "";
      alert("New language code added!");
    } catch (e) {
      alert(e);
    }
  }

  onSave(translationCode: string) {
    // console.log("translationCode", translationCode);

    this.languageCodes.forEach(async (lc) => {
      const data: any = {};
      if (!this.translations[translationCode]) {
        data[translationCode] = "";
      } else {
        data[translationCode] = this.translations[translationCode][lc];
      }
      // console.log(data);

      try {
        await this.col.doc(lc).set(data, { merge: true });
        if (!this.translations[translationCode]) {
          this.translations[translationCode] = {};
        }
        this.translations[translationCode][lc] = data[translationCode];
        this.newTranslationCode = "";
      } catch (e) {
        alert(e);
      }
    });
    alert("translations updated!");
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
  padding: 0.5em;
  margin: 0.5em;
}
</style>