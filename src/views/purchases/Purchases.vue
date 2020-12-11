<template>
  <div class="purchases">
    <h1>Purchases</h1>

    <form @submit.prevent="onSubmit">
      <input type="text" v-model="form.uid" />
      <button>
        Search
      </button>
    </form>

      <div v-for="transaction in transactions" :key="transaction.id" class="transaction">
        Purchase ID: {{ transaction.id }} <br />
        <div class="meta">
          <!-- <img v-if="transaction.photoURL" :src="transaction.photoURL" :alt="transaction.photoURL"> -->
          <div @click="transaction.more = !transaction.more">
            Name : {{ transaction?.displayName ?? 'No Display Name' }} <br />          
            Email: {{ transaction?.email }} <br />
            Phone number: {{ transaction?.phoneNumber }} <br />
            Status: {{ transaction?.status }} <br />
            Product id: {{ transaction?.productDetails?.id }} <br />
            Title: {{ transaction?.productDetails?.title }} <br />
            <div v-show="transaction.more">
            Description: {{ transaction?.productDetails?.description }} <br />
            Price: {{ transaction?.productDetails?.price }} <br />
            HashCode: {{ transaction?.productDetails?.hashCode }} <br />
            Purchase ID: {{ transaction?.purchaseDetails?.productID }} <br />
            Purchase hashCode: {{ transaction?.purchaseDetails?.hashCode }} <br />
            Purchase pendingCompletePurchase: {{ transaction?.purchaseDetails?.pendingCompletePurchase }} <br />
            Owner UID: {{ transaction.uid }} <br />
            </div>
            Date: {{ transaction.date }}
          </div>
        </div>
        <div class="content">
      </div>
      <hr>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";

import firebase from "firebase/app";
import "firebase/firestore";
import { proxy } from "@/services/functions";
export default class Purchases extends Vue {
  col = firebase.firestore().collection("purchase");

  
  transactions: any[] = [];

  form = {};

  async created() {
    console.log("getting purchases");
    const got = await this.col.get();
    this.prepData(got);
  }

  async onSubmit() {
    const data = proxy(this.form);
    console.log(data);
    if(!data.uid) alert('Please input User Uid');
    const got = await this.col.where("uid", "==", data.uid).get();
    this.prepData(got);
  }

  prepData(doc: any) {
    this.transactions = [];
    doc.docs.forEach((d: any) => {
    const data = d.data()
      console.log(data);
      data["id"] = d.id;
      data["more"] = false;
      data["date"] = new Date(1478708162000).toLocaleString();
      this.transactions.push(data);
    });
  }
}
</script>

<style lang="scss" scoped>
.transaction {
  margin-bottom: 1.5em;

  .meta {
    display: flex;

    img {
      width: 50px;
      height: 50px;
    }
  }
}
</style>

