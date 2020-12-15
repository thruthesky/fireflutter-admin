import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Admin from "../views/admin/Admin.vue";
import AdminHome from "../views/admin/AdminHome.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue")
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: "",
        component: AdminHome
      },
      {
        path: "users",
        component: () => import("../views/admin/Users.vue")
      },
      {
        path: "categories",
        name: "Categories",
        component: () => import("../views/admin/Categories.vue")
      },
      {
        path: "posts",
        name: "Posts",
        component: () => import("../views/admin/Posts.vue")
      },
      {
        path: "photos",
        name: "Photos",
        component: () => import("../views/admin/Photos.vue")
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("../views/admin/settings/Settings.vue")
      },
      {
        path: "settings/forum/:category",
        name: "CategorySettings",
        component: () => import("../views/admin/settings/CategorySettings.vue")
      },
      {
        path: "translations",
        name: "Translations",
        component: () => import("../views/admin/Translations.vue")
      },
      {
        path: "purchases",
        name: "Purchases",
        component: () => import("../views/admin/purchases/Purchases.vue")
      }
    ]
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue")
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile.vue")
  },
  {
    path: "/logout",
    name: "Logout",
    component: () => import("../views/Logout.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
