<template>
    <hr>
    Language Code [ <b>{{ languageCode }}</b> ] : <br><br>
    <div v-for="(value, name) of translations" :key="name" class="item">
        {{ name }} : <input type="text" name="newTransCode" v-model="translations[name]">
        <button @click="updateTranslation">Update</button>
        <br><br>
    </div>
    Add New Translation:
    <br><br>
    <div class="input-group">
        <span>
            Translation Code:
            <input type="text" name="newTransCode" v-model="newCode">
        </span>
        <span>
            Translation:
            <input type="text" name="newTranslation" v-model="newTranslation">
        </span>
        <button @click="addNewTranslation">Add</button>
    </div>
    <br><br>
</template>
 

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { proxy } from "../../services/functions";
import firebase from "firebase/app";
import "firebase/firestore";

@Options({
    props: ["translations", "languageCode"]
})
export default class TranslationForm extends Vue {
  languageCode!: string;
  translations!: any;

  newCode = '';
  newTranslation = '';

  col = firebase.firestore().collection("translations");

  created() {
      console.log(this.languageCode, this.translations);
  }

  addNewTranslation() {
      if (!this.newCode || !this.newTranslation) return;
      this.translations[this.newCode] = this.newTranslation;
      this.updateTranslation();
  }

  async updateTranslation() {
      try {
        await this.col.doc(this.languageCode).set(this.translations, { merge: true});
        alert('translations updated!');
      } catch(e) {
        alert(e);
      }
  }
}

</script>
