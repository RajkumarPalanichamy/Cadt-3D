import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
import HomeView from "@/views/HomeView.vue";
import Loginpage from "@/views/Loginpage.vue";
import Glbmodels from "@/views/Glbmodels.vue";
import Home from "@/views/Home.vue";
import Texture from "@/views/Texture.vue";
import Profile from "@/views/Profile.vue";
import Createproject from "@/views/Createproject.vue";
import Employee from "@/views/Employee.vue"
import Web from "@/views/web.vue";
import Configurator from "@/components/Configurator.vue";
import studio3d from "@/components/studio3d.vue";

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
      meta: { requiresAuth: true },
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
      
        {
          path: "employee",
          name: "employee",
          component: Employee,
        },
        {
          path: "web",
          name: "web",
          component: Web,
        },
      ],
    },
    {
      path: "/createproject",
      name: "createproject",
      component: Createproject,
      // meta: { requiresAuth: true },
    },
    {
      path: "/studio3d",
      name: "studio3d-container",
      component: studio3d,
      meta: { requiresAuth: true },


    },
    {
      path: "/configurator",
      name: "configurator",
      component: Configurator,
      meta: { requiresAuth: true },

    },

  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = Cookies.get("jwtToken");
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
