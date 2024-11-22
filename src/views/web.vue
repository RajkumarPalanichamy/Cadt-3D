<template>
  <v-container :fluid="true" class="px-0 py-0 d-flex" height="100vh">
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
    <v-container :fluid="true" class="px-0 py-0" height="100vh">
      <v-toolbar density="compact" class="bg-white">
        <v-card-title class="text-subtitle-2">{{ title }}</v-card-title>
        <v-spacer> </v-spacer>
        <v-btn color="#274E76" @click="isPreview = true" v-if="isCreated"
          >Preview
        </v-btn>
      </v-toolbar>
      <v-card class="px-4 mt-8 grid pb-10" rounded="0" flat>
        <v-sheet class="ml-16 pl-10 d-flex align-center" v-if="isCreated">
          <v-btn
            @click="isAddImage = true"
            icon="mdi-plus"
            size="x-large"
            
            color="#274E76"
          ></v-btn>
        </v-sheet>
        <v-sheet
          v-for="(data, index) in displayData"
          :key="index"
          class="elevation-2"
        >
          <v-img src="/images/login.png" cover height="75%"></v-img>
        </v-sheet>
      </v-card>
    </v-container>
    <!-- Preview Dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      fullscreen
      v-model="isPreview"
    >
      <v-card>
        <v-toolbar color="#274E76" class="px-2">
          <v-icon @click="isPreview = false">mdi-close</v-icon>
          <v-card-text class="text-subtitle-2">PREVIEW</v-card-text>
        </v-toolbar>
        <v-carousel
          height="700px"
          show-arrows="hover"
          cycle
          hide-delimiter-background
        >
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-sheet height="100%">
              <v-img src="/images/login.png" cover height="100%"></v-img>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-card>
    </v-dialog>
    <!-- Add Image Dialog -->
    <v-dialog v-model="isAddImage" max-width="1000px" persistent>
      <v-card height="420px">
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
            <v-text-field variant="underlined" placeholder="Image Name">
            </v-text-field>
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
export default {
  data: () => ({
    items: [
      { text: "Add Image", icon: "mdi-image-multiple-outline" },
      { text: "Displaying Models", icon: "mdi-view-day" },
    ],
    imageData: ["", "", "", "", ""],
    createdModelData: ["model 1"],
    title: "",
    imageSnackbar: false,
    snackbarText: "",
    displayData: [],
    isAddImage: false,
    isPreview: false,
    isCreated: true,
    slides: ["", "", "", ""],
  }),
  methods: {
    sideBarData(value) {
      this.title = value.toUpperCase();
      if (value == "Add Image") {
        this.displayData = this.imageData;
        this.isCreated = true;
      } else {
        this.isCreated = false;
        this.displayData = this.createdModelData;
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
  gap: 30px;
}
</style>
