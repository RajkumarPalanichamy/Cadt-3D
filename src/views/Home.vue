<template>
  <v-container class="py-0 px-4" :fluid="true">
    <!-- Search Bar -->
      <v-text-field
        v-model="searchedValue"
        @input="searchSavedModels"
        variant="outlined"
        placeholder="Search Your Projects"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        clearable
        class="mt-6 "
      >
      </v-text-field>
    <!-- No data found message -->
    <v-card
      flat
      class="d-flex flex-column align-center justify-center mt-16"
      v-if="!isShow && filteredModels.length === 0"
    >
      <v-icon color="error" size="2em">mdi-alert-circle-outline</v-icon>
      <v-card-title>No Project found</v-card-title>
    </v-card>

    <v-overlay
      v-model="isProjectLoad"
      persistent
      class="d-flex justify-center align-center"
    >
      <v-progress-circular indeterminate :size="70" :width="5" color="#274E76">
        {{ value }}
      </v-progress-circular>
    </v-overlay>
    <!-- Displaying Cards -->
    <v-card
      height="100vh"
      class="grid-project px-2 py-2 pb-16  savedprojects overflow"
      flat
    >
      <v-card
        v-if="isShow"
        @click="createProject()"
        style="border-radius: 8px"
          width="250px"
        height="230px"
        class="hoverCard d-flex flex-column align-center pt-16 blur"
      >
        <v-icon style="font-size: 2.5em">mdi-plus</v-icon>
        <v-card-text
          class="text-subtitle-1"
          style="letter-spacing: 2px !important"
          >Create Project</v-card-text
        >
      </v-card>
      <v-card
        class="px-3 py-3 blur "
        style="border-radius: 8px"
        v-for="(model, index) in filteredModels"
        width="250px"
        height="230px"
        :key="index"
      >
        <v-container class=" px-0 py-0" height="65%" > 
          <v-img src="/public/images/model_display.jpg" cover style="border-radius: 10px;">  </v-img>
        </v-container>
        <v-row class="pt-3 d-flex align-center justify-center">
          <v-col cols="10" class="text-subtitle-2">
            <v-card-text class="py-0 px-0 text-subtitle-1 text-capitalize " style="font-weight: 550 !important;">{{
              model.projectName
            }}</v-card-text>
          </v-col>
          <v-col cols="2">
            <!-- v-menu for menu list on dots icon hover -->
            <v-menu transition="scale-transition" offset-y open-on-hover>
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props"  style="cursor: pointer"
                  >mdi-dots-vertical</v-icon
                >
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, i) in hoverOptions"
                  @click="projectOptions(item, model)"
                  :key="i"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-card-subtitle class="px-0 mt-2 font-weight-medium"> {{ model.createdAt }}</v-card-subtitle>
      </v-card>
    </v-card>
    <!-- Snack Bar -->
    <v-snackbar v-model="isSnackbar" :timeout="500">
      No Project Found
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="isSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "App",
  data: () => ({
    savedModels: [],
    isSnackbar: false,
    isProjectLoad: true,
    items: [
      { text: "Home", icon: "mdi-clock" },
      { text: "My Profile", icon: "mdi-account" },
      { text: "Glb Models", icon: "mdi-table-furniture" },
      { text: "Textures", icon: "mdi-texture" },
    ],
    hoverOptions: [
      { text: "Open", icon: "mdi-open-in-new" },
      { text: "Rename", icon: "mdi-rename" },
      { text: "Delete", icon: "mdi-delete-empty-outline" },
    ],
    dialog: false,
    searchedValue: null,
    filteredModels: [],
    isShow: true,
  }),
  created() {
    this.filteredModels = this.savedModels;
  },
  async mounted() {
    const userRole = VueJwtDecode.decode(Cookies.get("jwtToken")).role;
    if (userRole.toLowerCase() == "admin") {
      this.getAdminStoreModels();
    } else {
      this.getUserSavedModels();
    }
  },
  methods: {
    createProject() {
      this.$router.push("/createproject");
    },
    confirmDelete() {
      this.dialog = false;
    },
    searchSavedModels() {
      this.isShow = !this.searchedValue;
      if (this.searchedValue) {
        this.isShow = false;
        this.filteredModels = this.savedModels.filter((model) =>
          model.projectName
            .toLowerCase()
            .includes(this.searchedValue.toLowerCase())
        );
      } else {
        this.filteredModels = this.savedModels;
      }
    },
    async getAdminStoreModels() {
      this.isProjectLoad = true;
      try {
        const data = Cookies.get("jwtToken");

        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/dynamic/getdynamicscene`,
          {
            headers: {
              Authorization: `Bearer ${data}`,
            },
          }
        );

        if (response.status === 200) {
          this.isProjectLoad = false;
          this.savedModels = response.data;
          this.filteredModels = this.savedModels;
        }
      } catch (error) {
        this.isProjectLoad = false;
        this.isSnackbar = true;
      }
    },
    async getUserSavedModels() {
      this.isProjectLoad = true;
      try {
        const data = Cookies.get("jwtToken");
        const userName = VueJwtDecode.decode(data);

        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/dynamic/dynamicscene/${
            userName.name
          }`
        );

        if (response.status === 200) {
          this.isProjectLoad = false;
          this.savedModels = response.data.data;
          this.filteredModels = this.savedModels;
        }
      } catch (error) {
        this.isProjectLoad = false;
        this.isSnackbar = true;
      }
    },
    projectOptions(item, model) {
      if (item.text == "Open") {
        this.loadSavedModels(model);
      } else if (item.text == "Rename") {
        alert("Rename");
      } else {
        this.deleteModel(model.projectName);
      }
    },
    loadSavedModels(model) {
      // this.$router.push("/createproject");
      // ThreeScene.methods.loadSaved(model);\
      this.$store.commit("loadModel", model);
      this.$router.push("/createproject");
    },
    async deleteModel(projectname) {
      try {
        const username = VueJwtDecode.decode(Cookies.get("jwtToken")).name;
        const deleteData = {
          username: username,
          projectName: projectname,
        };

        const response = await axios.delete(
          `${import.meta.env.VITE_API_LINK} /dynamic/dynamicscene
`,
          {
            data: deleteData,
          }
        );
        if (response.status === 200) {
          this.getUserSavedModels();
        }
      } catch (error) {
        console.error("Delete Error:", error.message);
      }
    },
  },
};
</script>

<style scoped>
.grid-project {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
}
.overflow {
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: rgb(206, 206, 206) white;
}

.seemore {
  position: relative;
  left: 430px;
  cursor: pointer;
}
.hoverCard:hover {
  background-color: rgba(33, 150, 243, 0.2);
  border: 1px solid rgba(33, 150, 243, 0.6);
  transition: background-color 0.3s ease, border 0.3s ease;
}
.text-capitalize {
  text-transform: capitalize;
}
.blur {
  box-shadow: 0px 4px 10px 0px rgba(218, 218, 218, 0.989);
}
</style>
