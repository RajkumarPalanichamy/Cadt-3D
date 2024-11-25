<template>
  <v-container :fluid="true" class="px-0 py-0 d-flex">
    <!-- Sidebar-container -->
    <v-container :fluid="true" class="px-0 py-0 border" width="100px">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          :class="{ 'active-sidebar': title === item.text.toUpperCase() }"
          @click="sideBarData(item.text)"
          class="text-center mt-2 px-0"
        >
          <v-icon :icon="item.icon"></v-icon>
          <v-list-item-title class="break-word">{{
            item.text
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-container>
    <!-- content-container -->
    <v-container
      style="height: 100vh; overflow: scroll"
      :fluid="true"
      class="px-0 py-0"
    >
      <v-toolbar
        density="compact"
        :color="selectedModels.length > 0 ? 'black' : 'white'"
      >
        <v-card-title class="text-subtitle-2">{{ title }}</v-card-title>
        <v-spacer> </v-spacer>
        <v-btn v-if="selectedModels.length > 0" color="whilte"
          >Add to Web</v-btn
        >
        <v-card-title class="text-subtitle-2" v-if="selectedModels.length > 0">
          {{ selectedModelsCount }}</v-card-title
        >
      </v-toolbar>
      <!-- DIsplaying Models card-->
      <v-item-group multiple>
        <v-container
          v-if="isModels"
          flat
          rounded="0"
          class="pl-10 grid"
          :fluid="true"
        >
          <v-card
            v-for="(model, index) in modelData"
            :key="index"
            :color="selectedModels.includes(index) ? '#274E76' : ''"
            class="px-2 pt-2 elevation-4"
            style="border-radius: 8px"
            width="240px"
            height="220px"
            @click="() => handleCardClick(index)"
          >
            <v-scroll-y-transition>
              <div class="text-h3 flex-grow-1 text-center">
                {{ selectedModels.includes(index) ? "Selected" : "" }}
              </div>
            </v-scroll-y-transition>
            <v-container class="bg-grey" height="80%"> 
              <v-img></v-img>
            </v-container>
            <v-card-text class="py-1 px-0 text-subtitle-1">{{
              model.projectName
            }}</v-card-text>
          </v-card>
        </v-container>
      </v-item-group>

      <!-- Add Image card -->
      <v-card rounded="0" flat v-if="isCreated">
        <!-- carousel -->
        <v-carousel show-arrows="hover" cycle hide-delimiter-background>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet height="100%">
              <v-img cover src="/images/car_1.jpg"></v-img>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
        <v-card class="mt-5 grid pb-10">
          <v-sheet v-for="(image, i) in imageData" :key="i">
            <v-img src="/images/car_1.jpg" cover></v-img>
            <v-spacer></v-spacer>
            <v-row class="d-flex align-center">
              <v-col cols="10"> <v-card-text>Image Name</v-card-text> </v-col>
              <v-col cols="2">
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
          </v-sheet>
        </v-card>
      </v-card>
      <!-- add button -->
      <v-row
        v-if="!isModels"
        @click="isAddImage = true"
        style="position: absolute; bottom: 100px; right: 80px"
      >
        <v-col>
          <v-btn size="x-large" icon="mdi-plus" color="#274E76"></v-btn>
        </v-col>
      </v-row>
    </v-container>
    <!-- Add Image Dialog -->
    <v-dialog v-model="isAddImage" max-width="1000px" persistent>
      <v-card height="490px">
        <v-toolbar color="#274E76" density="compact">
          <v-icon class="ml-2" @click="isAddImage = false">mdi-close</v-icon>
          <v-card-title class="text-subtitle-1">Upload Image</v-card-title>
        </v-toolbar>
        <v-container class="d-flex" :fluid="true">
          <v-img
            src="/images/login.png"
            cover
            height="150px"
            class="mr-6"
          ></v-img>
          <v-card width="70%" flat class="pb-10">
            <v-text-field variant="underlined" placeholder="Image Name">
            </v-text-field>
            <v-textarea variant="underlined" placeholder="Image Description">
            </v-textarea>
            <v-file-input
              label="File input"
              counter
              variant="underlined"
              multiple
              show-size
            ></v-file-input>
            <v-row class="mt-4">
              <v-col>
                <v-btn color="#274E76" @click="uploadImage" block
                  >Upload Image</v-btn
                >
              </v-col>
              <v-col> <v-btn block>Cancel</v-btn> </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-card>
    </v-dialog>
    <!-- image Snackbar -->
    <v-snackbar v-model="imageSnackbar" :timeout="2000">
      {{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="blue" variant="text" @click="snackbar = false">
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
  data: () => ({
    items: [
      { text: "Add Image", icon: "mdi-image-multiple-outline" },
      { text: "Displaying Models", icon: "mdi-view-day" },
    ],
    hoverOptions: [
      { text: "Edit", icon: "mdi-rename" },
      { text: "Delete", icon: "mdi-delete-empty-outline" },
    ],
    imageData: ["", "", "", "", "", "", ""],
    title: "",
    imageSnackbar: false,
    snackbarText: "",
    isAddImage: false,
    isCreated: true,
    slides: ["", "", "", ""],
    isModels: false,
    modelData: [],
    selectedModels: [],
  }),
  computed: {
    selectedModelsCount() {
      return this.selectedModels.length;
    },
  },
  methods: {
    sideBarData(value) {
      this.title = value.toUpperCase();
      if (value == "Add Image") {
        this.isCreated = true;
        this.isModels = false;
        this.selectedModels = [];
      } else {
        this.isModels = true;
        this.isCreated = false;
        const userRole = VueJwtDecode.decode(Cookies.get("jwtToken")).role;
        if (userRole == "admin") {
          this.getAdminStoreModels();
        } else {
          this.getUserSavedModels();
        }
      }
    },
    handleCardClick(index) {
      if (this.selectedModels.includes(index)) {
        this.selectedModels = this.selectedModels.filter((i) => i !== index);
      } else {
        this.selectedModels.push(index);
      }
    },
    async getUserSavedModels() {
      try {
        const data = Cookies.get("jwtToken");
        const userName = VueJwtDecode.decode(data);

        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/dynamicscene/${userName.name}`
        );

        if (response.status === 200) {
          this.modelData = response.data.data;
          console.log(this.modelData);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAdminStoreModels() {
      this.isProjectLoad = true;
      try {
        const data = Cookies.get("jwtToken");

        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/getdynamicscene`,
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
    uploadImage() {
      this.imageSnackbar = true;
      this.isAddImage = false;
      this.snackbarText = "Image Uploaded Successfully";
    },
  },
  mounted() {
    this.displayData = this.imageData;
    this.title = "ADD IMAGE";
  },
};
</script>
<style scoped>
.break-word {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  font-size: 10px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
</style>
