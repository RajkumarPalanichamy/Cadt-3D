<template>
  <v-container :fluid="true" class="px-0 py-0 d-flex" height="100vh">
    <!-- Sidebar-container -->
    <v-container :fluid="true" class="px-0 py-0 border" width="90px">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          color="primary"
          variant="plain"
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
        <v-btn color="#274E76" @click="isPreview = true">Preview</v-btn>
      </v-toolbar>
      <v-card class="px-4 mt-4 grid pb-10" rounded="0" flat>
        <v-sheet class="ml-16 pl-10" :height="200" :width="100">
          <v-btn icon="mdi-plus" size="x-large" class="mt-16"></v-btn>
        </v-sheet>
        <v-sheet
          v-for="(data, index) in displayData"
          :key="index"
          :width="250"
          :height="200"
          class="elevation-2 px-2 py-1"
        >
          <v-img src="/images/login.png" cover height="80%"></v-img>
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
        </v-toolbar>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    items: [
      { text: "Add Image", icon: "mdi-image-multiple-outline" },
      { text: "Created Models", icon: "mdi-view-day" },
    ],
    imageData: ["", "", "", "", ""],
    createdModelData: [],
    title: "",
    displayData: [],
    isPreview: false,
  }),
  methods: {
    sideBarData(value) {
      this.title = value.toUpperCase();
      if (value == "Add Image") {
        this.displayData = this.imageData;
      } else {
        this.displayData = this.createdModelData;
      }
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
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}
</style>
