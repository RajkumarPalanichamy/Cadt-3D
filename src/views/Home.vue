<template>
  <v-container class="py-5 px-0" fluid="true">
    <!-- Search Bar -->
    <v-card class="d-flex align-center justify-center" flat>
      <v-row class="mt-1 mx-4">
        <v-col cols="8">
          <v-text-field
            v-model="searchedValue"
            @input="searchSavedModels"
            variant="outlined"
            label="Enter Your Project Name"
            density="compact"
            prepend-inner-icon="mdi-magnify"
            clearable
          >
          </v-text-field>
        </v-col>
        <v-col cols="2" style="position: relative; right: 30px">
          <v-btn color="#274E76" size="x-large" density="compact">search</v-btn>
        </v-col>
        <v-col cols="2">
          <v-select
            variant="outlined"
            label="Last Updated"
            density="compact"
          ></v-select>
        </v-col>
      </v-row>
    </v-card>
    <!-- No data found message -->
    <v-card
      flat
      class="d-flex flex-column align-center justify-center"
      v-if="!isShow && filteredModels.length === 0"
    >
      <v-icon color="error" size="2em">mdi-alert-circle-outline</v-icon>
      <v-card-title>No data found</v-card-title>
    </v-card>
    <v-overlay v-model="isProjectLoad" persistent> </v-overlay>
    <!-- Displaying Cards -->
    <v-card
      height="80vh"
      class="grid-project mt-1 px-16 py-2 savedprojects overflow"
      flat
    >
      <v-card
        v-if="isShow"
        class="d-flex flex-column pt-8 align-center"
        @click="createProject()"
        width="240px"
        height="220px"
      >
        <v-icon size="2em">mdi-plus</v-icon>
        <v-card-text class="text-">Create Project</v-card-text>
      </v-card>
      <v-card
        class="px-2 pt-2"
        v-for="(model, index) in filteredModels"
        width="240px"
        height="220px"
        :key="index"
      >
        <v-container class="bg-grey" height="75%"> </v-container>
        {{ model.projectName }}
        <v-row>
          <v-col cols="10" class="text-grey">{{ model.createdAt }}</v-col>
          <v-col cols="2">
            <!-- v-menu for menu list on dots icon hover -->
            <v-menu transition="scale-transition" offset-y open-on-hover>
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" color="grey" style="cursor: pointer"
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
import ThreeScene from "@/components/threeContainer.vue";

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
    if (userRole == "admin") {
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
          `${import.meta.env.VITE_API_LINK}/commonprojects`,
          {
            headers: {
              Authorization: `Bearer ${data}`,
            },
          }
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
    async getUserSavedModels() {
      this.isProjectLoad = true;
      try {
        const data = Cookies.get("jwtToken");
        const userName = VueJwtDecode.decode(data);

        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/dynamicscene/${userName.name}`
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
      this.$router.push("/createproject");
      ThreeScene.methods.loadSaved(model);
    },
    async deleteModel(projectname) {
      try {
        const username = VueJwtDecode.decode(Cookies.get("jwtToken")).name;
        const deleteData = {
          username: username,
          projectName: projectname,
        };

        const response = await axios.delete(
          `${import.meta.env.VITE_API_LINK}/dynamicscene`,
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
</style>
