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
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card class="d-flex" height="95vh">
      <v-card class="overflow pl-2 sidebar" width="20%">
        <v-list>
          <v-list-subheader>Dashboard</v-list-subheader>
          <v-spacer class="mt-4"></v-spacer>

          <v-list-item
            class="hover mt-2"
            v-for="(item, i) in items"
            :key="i"
            @click="sideBar(item.text)"
          >
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-row>
          <v-col>
            <v-btn
              variant="outlined"
              @click="logout"
              block
              class="mt-16"
              color="#274E76"
              >Logout</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
      <v-card width="100%" >
        <Home v-if="$route.path === '/homeview'" />
        <router-view />
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
import Home from "./Home.vue";
export default {
  name: "App",
  components: {
    Home,
  },
  data() {
    return {
      items: [
        { text: "Home", icon: "mdi-clock" },
        { text: "My Profile", icon: "mdi-account" },
        { text: "Glb Models", icon: "mdi-table-furniture" },
        { text: "Textures", icon: "mdi-texture" },
      ],
    };
  },
  methods: {
    sideBar(clickedValue) {
      const value = clickedValue.split(" ").join("").toLowerCase();
      this.$router.push(`/homeview/${value}`);
    },
    logout() {
      this.$router.push("/");
    },
  },
};
</script>
