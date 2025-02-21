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
    <v-container :fluid="true" class="px-0 py-0" style="height: 100vh">
      <v-toolbar
        style="position: sticky; z-index: 1; top: 0px"
        :color="selectedModels.length > 0 ? 'black' : 'white'"
      >
        <v-card-title class="text-subtitle-2">{{ title }}</v-card-title>
        <v-spacer> </v-spacer>

        <v-dialog v-model="isAddShop" max-width="800px">
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              v-if="selectedModels.length > 0"
              @click="isAddShop = true"
              variant="outlined"
              color="white"
              >Add to Web
            </v-btn>
          </template>
          <v-card height="200px">
            <v-toolbar class="px-2" color="#274E76" density="compact">
              <v-icon @click="isAddShop = false">mdi-close</v-icon>
              <v-card-title class="text-subtitle-1"
                >{{ selectedModelsCount }} MODELS SELECTED</v-card-title
              >
            </v-toolbar>
            <v-card-title>Are You sure ?</v-card-title>
            <v-card-subtitle
              >Do you want to display the selected model in your application .
              If ' YES' click 'CONFIRM' button at the end</v-card-subtitle
            >
            <v-card-actions class="mt-4">
              <v-btn @click="postShopProject">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-card-title class="text-subtitle-2" v-if="selectedModels.length > 0">
          {{ selectedModelsCount }}</v-card-title
        >
      </v-toolbar>

      <!-- Displaying Models card-->
      <v-item-group multiple>
        <v-container v-if="isModels" flat :fluid="true" class="px-0 py-0">
          <v-overlay v-model="isLoadingModels"></v-overlay>
          <v-container :fluid="true" class="px-0 py-0">
            <v-row no-gutters>
              <v-col
                class="ga-14 d-flex flex-wrap scrollable-container py-4"
                :cols="firstCol"
                style="height: 90vh; overflow: scroll"
              >
                <v-card
                  v-for="(model, index) in modelData"
                  :key="index"
                  :color="selectedModels.includes(index) ? '#274E76' : ''"
                  class="px-2 pt-2 flex-grow-1 blur"
                  style="border-radius: 8px"
                  width="250px"
                  height="250px"
                  flat
                  @click="handleCardClick(index, model)"
                >
                  <v-scroll-y-transition>
                    <div class="text-h6">
                      {{ selectedModels.includes(index) ? "" : "" }}
                    </div>
                  </v-scroll-y-transition>
                  <v-container
                    height="70%"
                    class="px-0 py-0"
                    v-if="selectedModels.includes(index) ? false : true"
                  >
                    <v-img src="/public/images/model_display.jpg" cover></v-img>
                    <v-card-text class="py-2 text-subtitle-1 text-capitalize">{{
                      model.projectName
                    }}</v-card-text>
                  </v-container>
                </v-card>
              </v-col>
              <v-col
                cols="1"
                class="d-flex justify-end"
                @click="firstCol = firstCol === 11 ? 7 : 11"
              >
                <div
                  class="d-flex align-center justify-center"
                  style="height: 100%; width: 44px; background-color: #c9c7c7"
                >
                  <p v-if="firstCol == 11" class="element text-subtitle-1">
                    Click to expand
                    <span class="mdi mdi-format-horizontal-align-center"></span>
                  </p>
                  <p v-else class="element text-subtitle-1">
                    Click to close
                    <span class="mdi mdi-format-horizontal-align-center"></span>
                  </p>
                </div>
              </v-col>
              <v-col
                md="4"
                style="height: 90vh"
                class="scrollable-container border"
              >
                <v-card-title class="text-center"
                  >Displaying Model</v-card-title
                >
                <v-row
                  style="background-color: #e8e8e8"
                  class="mt-2 py-2"
                  no-gutters
                >
                  <v-col class="font-weight-bold text-center">Sno</v-col>

                  <v-col class="font-weight-bold">Project Name</v-col>
                  <v-col class="font-weight-bold text-center">Actions</v-col>
                </v-row>
                <v-row
                  v-for="(model, index) in displayingShopProject"
                  :key="index"
                  no-gutters
                  :class="{
                    'even-row': index % 2 === 0,
                    'odd-row': index % 2 !== 0,
                  }"
                >
                  <v-col class="text-center">{{ index + 1 }}</v-col>
                  <v-col class="py-2">{{
                    model.projectName.toUpperCase()
                  }}</v-col>
                  <v-col class="text-center">
                    <span
                      @click="deleteProject(model)"
                      class="mdi mdi-delete-outline text-red text-h6"
                    ></span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-item-group>

      <!-- Add Image card -->
      <v-card
        rounded="0"
        flat
        v-if="isCreated"
        style="overflow: auto; height: 100vh"
      >
        <!-- carousel -->
        <v-carousel show-arrows="hover" cycle hide-delimiter-background>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet height="100%">
              <v-img cover :src="slide.imageUrl"></v-img>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>

        <v-card class="mt-5 d-flex ga-10 flex-wrap pb-10" stt>
          <v-sheet v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide.imageUrl" cover></v-img>
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
          <v-dialog v-model="isAddImage" max-width="1000px" persistent>
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                size="x-large"
                v-bind="activatorProps"
                icon="mdi-plus"
                color="#274E76"
              ></v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="#274E76" density="compact">
                  <v-icon class="ml-2" @click="isAddImage = false"
                    >mdi-close</v-icon
                  >
                  <v-card-title class="text-subtitle-1"
                    >Upload Image</v-card-title
                  >
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
            </template>
          </v-dialog>
        </v-col>
      </v-row>
    </v-container>

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
import Cookies from "js-cookie";
import VueJwtDecode from "vue-jwt-decode";
export default {
  data: () => ({
    isAddShop: false,
    items: [],
    userItems: [{ text: "Carosuel Image", icon: "mdi-image-multiple-outline" }],
    adminItems: [
      { text: "Carosuel Image", icon: "mdi-image-multiple-outline" },
      { text: "Available Models", icon: "mdi-view-day" },
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
    slides: null,
    isModels: false,
    modelData: [],
    selectedModels: [],
    buttonText: null,
    imgFile: null,
    imgTitle: null,
    description: null,
    shopProject: [],
    displayingShopProject: null,
    firstCol: 11,
  }),
  computed: {
    selectedModelsCount() {
      return this.selectedModels.length;
    },
  },
  methods: {
    sideBarData(value) {
      this.title = value.toUpperCase();
      if (value == "Carosuel Image") {
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
    handleCardClick(index, model) {
      if (this.selectedModels.includes(index)) {
        this.selectedModels = this.selectedModels.filter((i) => i !== index);
      } else {
        this.shopProject.push(model);
        this.selectedModels.push(index);
      }
    },
    async getUserSavedModels() {
      try {
        const data = Cookies.get("jwtToken");
        const userName = VueJwtDecode.decode(data);

        const response = await this.$axios.get(
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

        const response = await this.$axios.get(
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
      if (this.slides.length >= 3) {
        return;
      }
      const sendingData = new FormData();
      sendingData.append("heading", this.title);
      sendingData.append("description", this.description);
      sendingData.append("imageUrl", this.imgFile[0]);
      try {
        const response = await this.$axios.post(
          `${import.meta.env.VITE_API_LINK}/coursal/postCoursal`,
          sendingData
        );
      } catch (err) {
        console.log("Uploading Error in Image", err);
      }
    },

    async getImage() {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/coursal/getCoursalData`
        );
        if (response.status == 200) {
          this.slides = response.data.coursalData;
        }
      } catch (err) {
        console.log("Error in Getting Image data", err);
      }
    },

    async postShopProject() {
      const cleanedProjects = this.shopProject.map(
        ({ createdAt, updatedAt, __v, ...rest }) => rest
      );
      try {
        const response = await this.$axios.post(
          `${import.meta.env.VITE_API_LINK}/shop/postData`, // Updated endpoint
          cleanedProjects
        );

        if (response.status == 200) {
          this.isAddShop = false;
          this.selectedModels = [];
        }
      } catch (err) {
        console.log("Failed to sent Data", err);
      }
    },

    async getShopProject() {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/shop/getShopData`
        );

        if (response.status == 200) {
          this.displayingShopProject = response.data.projects;
        }
      } catch (err) {
        console.log("Failed to get Data", err);
      }
    },

    async deleteProject(projectId) {
      try {
        const response = await this.$axios.delete(
          `http://localhost:4000/shop/deleteProject/${projectId._id}`
        );
        this.displayingShopProject = this.displayingShopProject.filter(
          (project) => project._id !== projectId
        );
      } catch (error) {
        console.error("Error deleting project", error);
        alert("Failed to delete project");
      }
    },
  },
  mounted() {
    this.getShopProject();
    this.getImage();
    this.title = "CAROSUEL IMAGE";
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

.text-capitalize {
  text-transform: capitalize;
}
.blur {
  box-shadow: 0px 0px 30px 10px rgba(218, 218, 218, 0.3);
}
.scrollable-container {
  overflow: auto;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #ffffff;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background: #ffffff;
}

.even-row {
  background-color: #fefcfc;
}

.odd-row {
  background-color: #e8e8e8;
}
.element {
  writing-mode: vertical-rl;
}
</style>
