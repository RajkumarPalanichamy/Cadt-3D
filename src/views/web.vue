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
        style="position: sticky; z-index: 1; top: 0px"
        density="compact"
        :color="selectedModels.length > 0 ? 'black' : 'white'"
      >
        <v-card-title class="text-subtitle-2">{{ title }}</v-card-title>
        <v-spacer> </v-spacer>
        <v-btn
          v-if="selectedModels.length > 0"
          @click="isAddShop = true"
          color="whilte"
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
          <v-overlay v-model="isLoadingModels"></v-overlay>
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
              <div class="text-h6">
                {{ selectedModels.includes(index) ? "Selected" : "" }}
              </div>
            </v-scroll-y-transition>
            <v-container height="70%" class="px-0 py-0">
              <v-img src="/public/images/model_display.jpg"></v-img>
            </v-container>
            <v-card-text class="py-2 text-subtitle-1 text-capitalize">{{
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
      <v-card height="580px">
        <v-toolbar color="#274E76" density="compact">
          <v-icon class="ml-2" @click="isAddImage = false">mdi-close</v-icon>
          <v-card-title class="text-subtitle-1">Upload Image</v-card-title>
        </v-toolbar>
        <v-container class="d-flex" :fluid="true">
          <v-img
            src="/images/login.png"
            height="150px"
            width="150px"
            class="mr-6"
          ></v-img>
          <v-card width="70%" flat class="pb-10">
            <v-text-field
              variant="underlined"
              placeholder="Title"
              v-model="imgTitle"
            >
            </v-text-field>
            <v-textarea
              variant="underlined"
              placeholder="Description"
              v-model="description"
            >
            </v-textarea>
            <v-text-field
              variant="underlined"
              placeholder="Button Text"
              v-model="buttonText"
            >
            </v-text-field>
            <v-file-input
              label="File input"
              counter
              variant="underlined"
              multiple
              v-model="imgFile"
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
    <!-- Add To Shop -->
    <v-dialog v-model="isAddShop" max-width="800px">
      <v-card height="200px">
        <v-toolbar class="px-2" color="#274E76" density="compact">
          <v-icon @click="isAddShop = false">mdi-close</v-icon>
          <v-card-title class="text-subtitle-1"
            >{{ selectedModelsCount }} MODELS SELECTED</v-card-title
          >
        </v-toolbar>
        <v-card-title>Are You sure ?</v-card-title>
        <v-card-subtitle
          >Do you want to display the selected model in your application . If '
          YES' click 'CONFIRM' button at the end</v-card-subtitle
        >
        <v-card-actions class="mt-4">
          <v-btn @click="isAddShop = false">Confirm</v-btn>
        </v-card-actions>
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
    isAddShop: false,
    items: [],
    userItems: [{ text: "Add Image", icon: "mdi-image-multiple-outline" }],
    adminItems: [
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
    buttonText: null,
    imgFile: null,
    imgTitle: null,
    description: null,
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
        const userRole = VueJwtDecode.decode(
          Cookies.get("jwtToken")
        ).role.toLowerCase();

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
          `${import.meta.env.VITE_API_LINK}/dynamic/dynamicscene/${
            userName.name
          }`
        );

        if (response.status === 200) {
          this.modelData = response.data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getAdminStoreModels() {
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
          this.modelData = response.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async uploadImage() {
      const sendingData = new FormData();
      sendingData.append("heading", this.title);
      sendingData.append("description", this.description);
      sendingData.append("button", this.buttonText);
      sendingData.append("image", this.imgFile);
         console.log("Image FILE",this.imgFile);
         
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_LINK}/coursal/postCoursalData`,
          sendingData
        );
        console.log(response);

        // this.imageSnackbar = true;
        // this.isAddImage = false;
        // this.snackbarText = "Image Uploaded Successfully";
      } catch (err) {
        console.log("Uploading Error in Image", err);
      }
    },
  },
  mounted() {
    this.title = "ADD IMAGE";
    const userRole = VueJwtDecode.decode(
      Cookies.get("jwtToken")
    ).role.toLowerCase();
    if (userRole == "admin") {
      this.items = this.adminItems;
    } else {
      this.items = this.userItems;
    }
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
.text-capitalize {
  text-transform: capitalize;
}
</style>
