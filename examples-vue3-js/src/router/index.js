import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/basic-data-fetching",
    name: "BasicDataFetching",
    component: () =>
      import(
        /* webpackChunkName: "BasicDataFetching" */ "../views/BasicDataFetching.vue"
      ),
  },
  {
    path: "/basic-data-fetching-composable",
    name: "BasicDataFetchingComposable",
    component: () =>
      import(
        /* webpackChunkName: "BasicDataFetchingComposable" */ "../views/BasicDataFetchingComposable.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
