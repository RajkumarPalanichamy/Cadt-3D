<template>
  <v-card rounded="0">
    <v-card class="d-flex" height="100vh" rounded="0">
      <v-layout>
        <v-navigation-drawer
          v-model="drawer"
          :rail="rail"
          rail-width="80"
          permanent
          @mouseenter="rail = false"
          @mouseleave="rail = true"
        >
          <v-card rounded="0" height="100vh" class="navigation-drawer flex">
            <v-list class="mt-4">
              <v-list-item class="text-white">
                <template #prepend>
                  <v-icon color="white" style="font-size: 28px; opacity: 1"
                    >mdi-cube-outline
                  </v-icon>
                </template>
                <v-list-item-title class="font-weight-bold"
                  >BLUE 3D
                </v-list-item-title>
              </v-list-item>
            </v-list>

            <v-list>
              <v-list-item
                v-for="(icon, i) in displaySidebarData"
                :key="i"
                class="text-white mb-2 rounded-lg"
                :class="{ 'active-sidebar-item': activeItem === icon.text }"
                @click="setActiveItem(icon.text)"
              >
                <template #prepend>
                  <v-icon style="font-size: 24px; opacity: 1" color="white">{{
                    icon.icon
                  }}</v-icon>
                </template>
                <v-list-item-title>{{ icon.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-list>
              <v-list-item
              class="text-white mb-2 rounded-lg"

                v-for="(icon, i) in downListItems"
                :key="i"
                :class="{ 'active-sidebar-item': activeItem === icon.text }"
                @click="setActiveItem(icon.text)"
              >
                <template #prepend>
                  <v-icon style="font-size: 24px; opacity: 1" color="white">{{
                    icon.icon
                  }}</v-icon>
                </template>
                <v-list-item-title>{{ icon.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-navigation-drawer>
        <v-main>
          <router-view />
        </v-main>
      </v-layout>
    </v-card>
  </v-card>
</template>

<script>
import Cookies from "js-cookie";
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "App",
  data() {
    return {
      drawer: true,
      rail: true,
      activeItem: "Home",
      userData: [
        { text: "Home", icon: "mdi-home-minus-outline" },
        { text: "Glb Models", icon: "mdi-sofa-outline" },
        { text: "Textures", icon: "mdi-texture-box" },
        { text: "Web", icon: "mdi-web" },
        { text: "Studio3D", icon: "mdi-cube" },
        { text: "Configurator", icon: "mdi-texture" },

      ],
      adminData: [
        { text: "Home", icon: "mdi-home-minus-outline" },
        { text: "Glb Models", icon: "mdi-sofa-outline" },
        { text: "Textures", icon: "mdi-texture-box" },
        { text: "Employee", icon: "mdi-account-group-outline" },
        { text: "Web", icon: "mdi-web" },
        { text: "Studio3D", icon: "mdi-cube" },
        { text: "Configurator", icon: "mdi-texture" },

      ],
      downListItems: [
        { text: "My Profile", icon: "mdi-account-outline" },
        { text: "Logout", icon: "mdi-logout" },
      ],

      displaySidebarData: [],
      role: "",
    };
  },
  async mounted() {
    this.$router.push("/homeview/home");
    const data = Cookies.get("jwtToken");
    const decodedToken = VueJwtDecode.decode(data);

    this.role = decodedToken.role.toUpperCase();
    this.displaySidebarData =
      decodedToken.role == "admin" ? this.adminData : this.userData;

    this.isSmallScreen = window.innerWidth <= 960;
    window.addEventListener("resize", this.handleResize);
  },

  methods: {
    setActiveItem(itemText) {
      this.activeItem = itemText;
      this.sideBar(itemText);
    },
    sideBar(clickedValue) {
      if (clickedValue == "Studio3D") {
        this.$router.push("/studio3d");
      } 
      else if(clickedValue == "Configurator")
      {
        this.$router.push("/configurator")
      }
      else if (clickedValue == "Logout") {
        Cookies.remove("jwtToken");
        this.$router.push("/");
      } else {
        const value = clickedValue.split(" ").join("").toLowerCase();
        this.$router.push(`/homeview/${value}`);
      }
    }, 
  },
};
</script>

<style scoped>
.navigation-drawer {
  background: linear-gradient(to bottom, #0c2539, #1d4f72, #0c2539);
  display: flex;
  justify-content: space-between;
}
.active-sidebar-item {
  border-left: 4px solid #ffffff;
}
.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

</style>
