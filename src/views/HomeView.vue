<template>
  <v-card rounded="0">
    <v-toolbar density="compact" color="#274e76" flat>
      <v-card-title>
        <v-icon>mdi mdi-cube-outline</v-icon>
        BLUE 3D
      </v-card-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-menu open-on-hover>
          <template v-slot:activator="{ props }">
            <v-icon v-bind="props" color="white">mdi-dots-vertical</v-icon>
          </template>
          <v-list width="200px">
            <v-list-item
              @click="hoverValue(item.text)"
              v-for="(item, i) in hoverOptions"
              :key="i"
            >
              <template v-slot:prepend>
                <v-icon :icon="item.icon"></v-icon>
              </template>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-toolbar>
    <v-card class="d-flex" height="93vh">
      <v-card class="overflow pl-2 sidebar" width="20%">
        <v-list>
          <v-list-subheader class="mt-4">{{ role }} DASHBOARD</v-list-subheader>
          <v-spacer class="mt-4"></v-spacer>

          <v-list-item
            class="hover mt-2"
            v-for="(item, i) in displaySidebarData"
            :key="i"
            @click="sideBar(item.text)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <!-- <v-row>
          <v-col>
            <v-btn
              variant="outlined"
              @click="logout"
              block
              class="mt-16"
              color="#274E76"
            >
              Logout<v-icon class="ml-2">mdi-logout</v-icon></v-btn
            >
          </v-col>
        </v-row> -->
      </v-card>
      <v-card width="100%">
        <router-view />
      </v-card>
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
      hoverOptions: [
        { text: "Profile", icon: "mdi-account-arrow-right-outline" },
        { text: "Logout", icon: "mdi-logout" },
      ],
      userData: [
        { text: "Home", icon: "mdi-home-minus-outline" },
        { text: "My Profile", icon: "mdi-account" },
        { text: "Glb Models", icon: "mdi-table-furniture" },
        { text: "Textures", icon: "mdi-texture" },
      ],
      adminData: [
        { text: "Home", icon: "mdi-home-minus-outline" },
        { text: "My Profile", icon: "mdi-account-outline" },
        { text: "Glb Models", icon: "mdi-table-furniture" },
        { text: "Textures", icon: "mdi-texture" },
        { text: "Employee", icon: "mdi-account-group-outline" },
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
  },
  methods: {
    sideBar(clickedValue) {
      const value = clickedValue.split(" ").join("").toLowerCase();
      this.$router.push(`/homeview/${value}`);
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
/* .hover {
  color: #274e76;
  border-left: 2px solid #274e76;
} */
.hover:hover {
  color: #274e76;
  border-left: 2px solid #274e76;
}
</style>
