<template>
  <v-container class="py-5 px-0" fluid="true">
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
    <v-card
      height="80vh"
      class="grid-project mt-1 px-16 py-2 savedprojects overflow"
      flat
    >
      <v-card
        v-if="isShow"
        class="d-flex flex-column pt-8 align-center"
        @click="createProject()"
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
        {{ model }}
        <v-row>
          <v-col cols="10" class="text-grey">11-12-2004 ,17.56</v-col>
          <v-col cols="2">
            <!-- v-menu for menu list on dots icon hover -->
            <v-menu transition="scale-transition" offset-y open-on-hover>
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props" color="grey" style="cursor: pointer;">mdi-dots-vertical</v-icon>
              </template>
              <v-list>
                <v-list-item v-for="(item, i) in hoverOptions" :key="i">
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

    <!-- <v-card-text @click="seeMore" class="text-center">
      See More <v-icon>mdi-menu-down</v-icon>
    </v-card-text> -->
  </v-container>
</template>
\
<script>
export default {
  name: "App",
  data: () => ({
    items: [
      { text: "Home", icon: "mdi-clock" },
      { text: "My Profile", icon: "mdi-account" },
      { text: "Glb Models", icon: "mdi-table-furniture" },
      { text: "Textures", icon: "mdi-texture" },
      
    ],
    savedModels: [
      "Model Name 1",
      "Model Name 2",
      "Model Name 3",
      "Model Name 4",
      "Model Name 5",
      "Model Name 6",
      "Model Name 6",
      "Model Name 1",
      "Model Name 2",
      "Model Name 3",
      "Model Name 4",
      "Model Name 5",
      "Model Name 6",
      "Model Name 6",
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
          model.toLowerCase().includes(this.searchedValue.toLowerCase())
        );
      } else {
        this.filteredModels = this.savedModels;
      }
    },
    // seeMore() {
    //   const length = this.savedModels.length;
    //   console.log(length);

    //   for (let i = length; i < length + 20; i++) {
    //     this.savedModels.push(`Model ${i}`);
    //   }
    // },
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
