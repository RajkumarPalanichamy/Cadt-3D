import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import Loginpage from "@/views/Loginpage.vue";
import Glbmodels from "@/views/Glbmodels.vue";
import Home from "@/views/Home.vue";
import Texture from "@/views/Texture.vue";
import Profile from "@/views/Profile.vue";
import Createproject from "@/views/Createproject.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Loginpage",
      component: Loginpage,
    },
    {
      path: "/homeview",
      name: "Homeview",
      component: HomeView,
      children: [
        {
          path: "home",
          name: "home",
          component: Home,
        },
        {
          path: "glbmodels",
          name: "Glbmodels",
          component: Glbmodels,
        },
        {
          path: "myprofile",
          name: "Profile",
          component: Profile,
        },
        {
          path: "textures",
          name: "texture",
          component: Texture,
        },
      ],
    },
    {
      path: "/createproject",
      name: "createproject",
      component: Createproject,
    },
  ],
});

export default router;
