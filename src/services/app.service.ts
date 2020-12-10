import store from "@/store/index";
export class AppService {
  get loggedIn(): boolean {
    // console.log("store.state.user: ", store.state.user);
    return store.state.user.uid !== void 0;
  }
  get notLoggedIn(): boolean {
    return this.loggedIn;
  }
  get isAdmin(): boolean {
    return store.state.userData.isAdmin;
  }
}
