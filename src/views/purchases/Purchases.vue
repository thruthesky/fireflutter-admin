<template>
  <div class="purchases">
    <h1>Purchases</h1>

    <form @submit.prevent="onSubmit">
      <div class="options">
        <input type="text" v-model="form.uid" placeholder="uid" />

        <input type="text" v-model="startDate" placeholder="Start Date" />
        <input type="text" v-model="endDate" placeholder="End Date" />
      </div>
      <button>
        Search
      </button>
    </form>

    <h3>Display</h3>
    <div class="displayOptions">
      <span>
        <input
          type="checkbox"
          id="photo"
          name="photo"
          v-model="options.photo"
        />
        <label for="photo">Photo</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="phoneNumber"
          name="phoneNumber"
          v-model="options.phoneNumber"
        />
        <label for="phoneNumber">Phone Number</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="title"
          name="title"
          v-model="options.title"
        />
        <label for="title">Title</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="description"
          name="description"
          v-model="options.description"
        />
        <label for="description">Description</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="price"
          name="price"
          v-model="options.price"
        />
        <label for="price">Price</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="hashCode"
          name="hashCode"
          v-model="options.hashCode"
        />
        <label for="hashCode">Hash Code</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="purchaseID"
          name="purchaseID"
          v-model="options.purchaseID"
        />
        <label for="purchaseID">Purchase ID</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="purchasehashCode"
          name="purchasehashCode"
          v-model="options.purchasehashCode"
        />
        <label for="purchasehashCode">Purchase Hash Code</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="purchaseStatus"
          name="purchaseStatus"
          v-model="options.purchaseStatus"
        />
        <label for="purchaseStatus">Purchase Status</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="beginAt"
          name="beginAt"
          v-model="options.beginAt"
        />
        <label for="beginAt">BeginAt</label>
      </span>
      <span>
        <input
          type="checkbox"
          id="endAt"
          name="endAt"
          v-model="options.endAt"
        />
        <label for="endAt">EndAt</label>
      </span>
    </div>

    <table class="transaction">
      <tr>
        <th>id</th>
        <th>uid</th>
        <th v-if="options.photo">Photo</th>
        <th>Name</th>
        <th>Email</th>
        <th v-if="options.phoneNumber">Phone</th>
        <th>Status</th>
        <th>Product id</th>
        <th v-if="options.title">Title</th>
        <th v-if="options.description">Description</th>
        <th v-if="options.price">Price</th>
        <th v-if="options.hashCode">HashCode</th>
        <th v-if="options.purchaseID">Purchase ID</th>
        <th v-if="options.purchasehashCode">Purchase hashCode</th>
        <th v-if="options.purchaseStatus">Purchase Status</th>
        <th v-if="options.beginAt">BeginAt</th>
        <th v-if="options.endAt">EndAt</th>
      </tr>
      <tr v-for="transaction in transactions" :key="transaction.id">
        <td>{{ transaction?.id }}</td>
        <td>{{ transaction?.uid }}</td>
        <td v-if="options.photo">
          <img
            v-if="transaction.photoURL"
            :src="transaction.photoURL"
            :alt="transaction.photoURL"
          />
        </td>
        <td>{{ transaction?.displayName ?? "No Name" }}</td>
        <td>{{ transaction?.email }}</td>
        <td v-if="options.phoneNumber">{{ transaction?.phoneNumber }}</td>
        <td>{{ transaction?.status }}</td>
        <td>{{ transaction?.productDetails?.id }}</td>
        <td v-if="options.title">{{ transaction?.productDetails?.title }}</td>
        <td v-if="options.description">
          {{ transaction?.productDetails?.description }}
        </td>
        <td v-if="options.price">{{ transaction?.productDetails?.price }}</td>
        <td v-if="options.hashCode">
          {{ transaction?.productDetails?.hashCode }}
        </td>
        <td v-if="options.purchaseID">
          {{ transaction?.purchaseDetails?.productID }}
        </td>
        <td v-if="options.purchasehashCode">
          {{ transaction?.purchaseDetails?.hashCode }}
        </td>
        <td v-if="options.purchaseStatus">
          {{ transaction?.purchaseDetails?.pendingCompletePurchase }}
        </td>
        <td v-if="options.beginAt">{{ transaction.beginAtDate }}</td>
        <td v-if="options.endAt">{{ transaction.endAtDate }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import firebase from "firebase/app";
import "firebase/firestore";
import { proxy } from "@/services/functions";

@Options({
  components: {}
})
export default class Purchases extends Vue {
  col = firebase.firestore().collection("purchase");

  transactions: any[] = [];

  form = {};

  startDate = "2020/12/01";
  endDate = "2020/12/14";
  date1 = null;

  options = {
    photo: false,
    phoneNumber: false,
    title: false,
    description: false,
    price: false,
    hashCode: false,
    purchaseID: false,
    purchasehashCode: false,
    purchaseStatus: false,
    beginAt: true,
    endAt: false
  };

  async created() {
    console.log("getting purchases");
    // const got = await this.col.get();

    const beginAt = new Date("2020/12/13T23:59:59");

    const _beginAt = new firebase.firestore.Timestamp(
      Math.round(beginAt.getTime() / 1000),
      0
    );
    const endAt = new Date("2020-12-14T17:55:00");
    const _endAt = new firebase.firestore.Timestamp(
      Math.round(endAt.getTime() / 1000),
      0
    );
    const cr = this.col
      .where("uid", "==", "aUUm0vjfU6PZqPTbhyvmFiWMyxS2")
      .where("status", "==", "failure")
      .where("beginAt", ">=", _beginAt)
      .where("beginAt", "<=", _endAt);
    const got = await cr.get();
    this.prepData(got);
  }

  async onSubmit() {
    const data = proxy(this.form);
    console.log("data", data);
    // const got = await this.col.where("uid", "==", data.uid).get();

    const startAt = new Date(this.startDate).getTime();
    const endAt = new Date(this.endDate);

    console.log("Date Range\n", startAt, endAt);

    const cr = this.col.orderBy("beginAt", "desc");

    // const cr = this.col;

    // console.log(endAt.toLocaleString());

    const _endAt = new firebase.firestore.Timestamp(
      Math.round(endAt.getTime() / 1000),
      0
    );

    // console.log(_endAt);

    // console.log(new Date(_endAt.seconds * 1000).toLocaleString());

    // if (data.uid) {
    //   console.log("data.uid\n", data.uid);
    //   cr.where("uid", "==", data.uid);
    // }
    // cr.where("beginAt", ">", startAt);
    cr.where("beginAt", "<", _endAt);

    const got = await cr.get();
    console.log("got", got);
    this.prepData(got);
  }

  prepData(doc: any) {
    this.transactions = [];
    console.log(this.transactions);
    doc.docs.forEach((d: any) => {
      const data = d.data();
      // console.log(data);
      data["id"] = d.id;
      data["beginAtDate"] = data?.beginAt?.seconds
        ? new Date(data.beginAt.seconds * 1000).toLocaleString()
        : "";
      data["endAtDate"] = data?.endAt?.seconds
        ? new Date(data.endAt.seconds * 1000).toLocaleString()
        : "";
      this.transactions.push(data);
    });
  }
}
</script>

<style lang="scss" scoped>
form {
  padding-bottom: 1em;
  .options {
    margin-bottom: 2em;
  }
  button {
    padding: 0.5em 2em;
  }
}

.displayOptions {
  display: flex;
  flex-wrap: wrap;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25em 1em;
    margin-right: 1.5em;
    cursor: pointer;
    label {
      cursor: pointer;
    }
  }
}

table {
  width: 100%;
  text-align: center;
  border-spacing: 5px;
  white-space: nowrap;
  img {
    width: 50px;
    height: 50px;
  }
}
.transaction {
  margin-bottom: 1.5em;
  .meta {
    display: flex;
  }
}
</style>
