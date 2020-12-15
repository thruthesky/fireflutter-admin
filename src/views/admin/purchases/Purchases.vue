<template>
  <div class="purchases">
    <h1>Purchases</h1>
    <form @submit.prevent="onSubmit">
      <div class="queryOptions">
        <span
          >uid<input type="text" v-model="form.uid" placeholder="uid"
        /></span>
        <span>
          Status
          <select name="status" id="status" v-model="form.status">
            <option value="">Select Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failure">Failure</option>
          </select>
        </span>
        <span>
          Product
          <select name="productList" id="productList" v-model="form.productID">
            <option value="">Select Product</option>
            <option value="lucky_box">Lucky Box</option>
            <option value="jewelry_box">Jewelry Box</option>
            <option value="diamond_box">Diamon Box</option>
          </select>
        </span>
        <span>
          Date Start
          <input type="text" v-model="startDate" placeholder="Start Date" />
        </span>
        <span>
          Date End
          <input type="text" v-model="endDate" placeholder="End Date" />
        </span>
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
          id="purchaseID"
          name="purchaseID"
          v-model="options.purchaseID"
        />
        <label for="purchaseID">Purchase ID</label>
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
        <th v-if="options.purchaseID">Purchase ID</th>
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
        <td v-if="options.purchaseID">
          {{ transaction?.purchaseDetails?.productID }}
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

  form = {
    status: "",
    productID: ""
  };

  d = new Date();
  sd = new Date(this.d.getFullYear(), this.d.getMonth(), this.d.getDate() - 10);
  startDate = `${this.sd.getFullYear()}/${this.sd.getMonth() + 1}/${this.add0(
    this.sd.getDate()
  )}`;
  endDate = `${this.d.getFullYear()}/${this.d.getMonth() +
    1}/${this.d.getDate()}`;

  options = {
    photo: false,
    phoneNumber: false,
    title: false,
    description: false,
    price: false,
    purchaseID: false,
    purchaseStatus: false,
    beginAt: true,
    endAt: false
  };

  created() {
    console.log("created");
    this.search();
  }

  add0(num: number) {
    if (num >= 10) return num;
    return "0" + num;
  }

  async search() {
    console.log("getting purchases");
    const data = proxy(this.form);

    const dAt = new Date(this.startDate);
    console.log(dAt);
    const beginAt = new Date(dAt.getFullYear(), dAt.getMonth(), dAt.getDate());
    const _beginAt = new firebase.firestore.Timestamp(
      Math.round(beginAt.getTime() / 1000),
      0
    );
    const eAt = new Date(this.endDate);
    console.log(eAt);
    const endAt = new Date(
      eAt.getFullYear(),
      eAt.getMonth(),
      eAt.getDate() + 1
    );
    console.log(endAt);
    const _endAt = new firebase.firestore.Timestamp(
      Math.round(endAt.getTime() / 1000),
      0
    );

    let q = this.col
      .where("beginAt", ">=", _beginAt)
      .where("beginAt", "<=", _endAt);

    if (data.uid) {
      q = q.where("uid", "==", data.uid);
    }
    if (data.status) {
      q = q.where("status", "==", data.status);
    }
    if (data.productID) {
      q = q.where("productDetails.id", "==", data.productID);
    }
    const got = await q.get();
    this.prepData(got);
  }

  async onSubmit() {
    this.search();
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
  .queryOptions {
    display: flex;
    padding-bottom: 1em;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25em 1em;
      margin-right: 1.5em;
      cursor: pointer;
    }
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
