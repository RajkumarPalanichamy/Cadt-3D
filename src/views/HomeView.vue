<template>
  <v-card>
    <v-card flat>
      <v-toolbar density="compact" color="#274e76" flat>
        <v-card-title>
          <v-icon >mdi mdi-cube</v-icon>
          BLUE 3D</v-card-title
        >
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-theme-light-dark</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card>
    <v-card class="d-flex">
      <v-card height="100vh" class="overflow pl-2" width="18%">
        <v-list>
          <v-list-subheader>Home</v-list-subheader>
          <v-spacer></v-spacer>

          <v-list-item class="hover" v-for="(item, i) in items" :key="i">
            <template v-slot:prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>

            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card width="82%" color="#F6F6F6">
        <v-card class="grid pl-4 mt-4 pr-4" color="#F6F6F6" flat>
          <v-card
            class="d-flex flex-column align-center justify-center"
            @click="createProject"
          >
            <v-icon color="#274e76" size="2em">mdi-plus</v-icon>
            <v-card-title>Create Project</v-card-title>
          </v-card>
          <v-card
            class="d-flex flex-column align-center justify-center"
            width="260px"
            height="230px"
            v-for="(item, index) in savedModels"
            :key="index"
          >
            {{ item }}
          </v-card>
        </v-card>
        <v-card-text class="d-flex justify-center mt-5"
          >See More <v-icon>mdi-menu-down</v-icon></v-card-text
        >
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
    ],
    savedModels: [" Model1", " Model2", " Model3 ", "Model 4 ", " Model 5"],
  }),
  methods: {
    createProject() {
      this.$router.push("/createproject");
    },
  },
};
</script>

<style scoped>
.overflow {
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgb(218, 218, 218) white;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.hover:hover {
  cursor: pointer;
  color: #274e76;
}
</style>
