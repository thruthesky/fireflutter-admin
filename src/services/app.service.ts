import store from "@/store/index";

import firebase from "firebase/app";
import "firebase/functions";

import { USER_NOT_EXISTS } from "@/services/definitions";

export class AppService {
  get loggedIn(): boolean {
    // console.log("store.state.user: ", store.state.user);
    return store.state.user.uid !== void 0;
  }
  get notLoggedIn(): boolean {
    return !this.loggedIn;
  }
  get isAdmin(): boolean {
    return store.state.userData.isAdmin;
  }
  get uid() {
    return store.state.user.uid;
  }

  /**
   * Returns an object of user data
   */
  get user() {
    return {
      uid: this.uid
    };
  }

  async fileDelete(url: string) {
    const func = firebase
      .app()
      .functions("asia-northeast3")
      .httpsCallable("fileDelete");

    await func(url);
  }
  /**
   * Delete the user(s)
   *
   * An exception will be thrown if there is error.
   *
   * @param uid a string or a string list of user uid
   */
  async userDelete(uid: string | string[]) {
    const userDelete = firebase
      .app()
      .functions("asia-northeast3")
      .httpsCallable("userDelete");

    try {
      await userDelete(uid);
    } catch (e) {
      console.log(e.code, e.message, e.details);
      if (e.message == USER_NOT_EXISTS) {
        // continue deleting user data and public data.
        // user data may exists without user account.
      } else {
        throw e;
      }
    }

    try {
      const userDataDelete = firebase
        .app()
        .functions("asia-northeast3")
        .httpsCallable("userDataDelete");
      await userDataDelete(uid);
    } catch (e) {
      // ignore user data document delete since (somehow) the user may not have one
      console.log(e);
    }
    try {
      const userPublicDataDelete = firebase
        .app()
        .functions("asia-northeast3")
        .httpsCallable("userPublicDataDelete");
      await userPublicDataDelete(uid);
    } catch (e) {
      // ignore user data document delete since (somehow) the user may not have one
      console.log(e);
    }
  }
  error(e: any) {
    if (e.code && e.message) {
      alert(`${e.code}: ${e.message}`);
    } else {
      alert(e);
    }
  }
  alert(message: string) {
    alert(message);
  }
}
