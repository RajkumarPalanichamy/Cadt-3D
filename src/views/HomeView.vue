<template>
  <v-card rounded="0">
    <!-- Toolbar -->
    <v-toolbar density="compact" color="#274e76" flat>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
      <v-card-title>
        <v-icon>mdi mdi-cube-outline</v-icon>
        BLUE 3D
      </v-card-title>
      <v-spacer></v-spacer>
      <v-menu>
  <template v-slot:activator="{ props }">
    <v-btn icon v-bind="props">
      <v-icon color="white">mdi-dots-vertical</v-icon>
    </v-btn>
  </template>
  <v-list width="200px">
    <v-list-item
      v-for="(item, i) in hoverOptions"
      :key="i"
      @click="hoverValue(item.text)"
      color="primary"
    >
      <template v-slot:prepend>
        <v-icon :icon="item.icon"></v-icon>
      </template>
      <v-list-item-title>{{ item.text }}</v-list-item-title>
    </v-list-item>
  </v-list>
</v-menu>

    </v-toolbar>

    <!-- Main Content -->
    <v-card class="d-flex" height="93vh" rounded="0">
      <v-layout>
        <!-- Navigation Drawer -->
        <v-navigation-drawer
          v-model="drawer"
          class="custom-drawer"
          :permanent="!isSmallScreen"
          :temporary="isSmallScreen"
          :width="240"
          color="#F6F6F6"
        >
          <v-list>
            <v-list-subheader class="my-5"
              >{{ role }} DASHBOARD</v-list-subheader
            >
            <v-list-item
              v-for="(item, i) in displaySidebarData"
              :key="i"
              :value="item"
              color="primary"
              @click="sideBar(item.text)"
              class="hover"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
          <!-- <v-img
            src="/public/images/3d.png"
            max-height="100%"
            max-width="400"
          ></v-img> -->
        </v-navigation-drawer>

        <!-- Main Section -->
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
      hoverOptions: [
        { text: "Profile", icon: "mdi-account-arrow-right-outline" },
        { text: "Logout", icon: "mdi-logout" },
      ],
      userData: [
        { text: "Home", icon: "mdi-home-account" },
        { text: "My Profile", icon: "mdi-account" },
        { text: "Glb Models", icon: "mdi-table-furniture" },
        { text: "Textures", icon: "mdi-texture" },
        { text: "Web", icon: "mdi-web" },
        { text: "Studio3D", icon: "mdi-cube" },
      ],
      adminData: [
        { text: "Home", icon: "mdi-home-account" },
        { text: "My Profile", icon: "mdi-account" },
        { text: "Glb Models", icon: "mdi-table-furniture" },
        { text: "Textures", icon: "mdi-texture" },
        { text: "Employee", icon: "mdi-account-group-outline" },
        { text: "Web", icon: "mdi-web" },
        { text: "Studio3D", icon: "mdi-cube" },
      ],
      displaySidebarData: [],
      role: "",
      isSmallScreen: false,
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
  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.isSmallScreen = window.innerWidth <= 960;
    },
    sideBar(clickedValue) {
      if (clickedValue == "Studio3D") {
        this.$router.push(`/studio3d`);
      } else {
        const value = clickedValue.split(" ").join("").toLowerCase();
        this.$router.push(`/homeview/${value}`);
      }
    },
    hoverValue(value) {
      if (value == "Logout") {
        Cookies.remove("jwtToken");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
.custom-drawer {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("/images/3d.jpeg");
  width: 100%;
  height: 200px;
}
</style>
