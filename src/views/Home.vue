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
      class="grid-project mt-1 px-8 py-2 savedprojects overflow"
      flat
    >
      <v-card
        class="d-flex flex-column align-center justify-center"
        @click="createProject"
        width="230px"
        v-if="isShow"
      >
        <v-icon color="#274e76" size="2em">mdi-plus</v-icon>
        <v-card-title>Create Project</v-card-title>
      </v-card>
      <v-hover
        v-for="(item, index) in filteredModels"
        :key="index"
        v-slot="{ isHovering, props }"
      >
        <v-card
          class="d-flex flex-column align-center justify-center"
          width="230px"
          height="210px"
          elevation="3"
          v-bind="props"
        >
          <v-card-text v-if="!isHovering">{{ item }}</v-card-text>

          <v-expand-transition>
            <v-card
              v-if="isHovering"
              class="d-flex justify-center align-center transition-fast-in-fast-out bg-grey-lighten-4 v-card--reveal text-h3"
              style="height: 100%; width: 100%"
            >
              <v-btn
                class="mr-3"
                color="success"
                text="Edit"
                size="small"
                prepend-icon="mdi-pencil"
              >
              </v-btn>
              <v-btn
                color="error"
                outlined
                @click="dialog = true"
                size="small"
                text="Delete"
                prepend-icon="mdi-trash-can-outline"
              >
              </v-btn>

              <v-dialog v-model="dialog" max-width="340">
                <v-card>
                  <v-card-title>Confirm Delete</v-card-title>
                  <v-card-text>
                    Are you sure you want to delete this project?
                  </v-card-text>
                  <v-card-actions>
                    <v-btn text @click="dialog = false">Cancel</v-btn>
                    <v-btn color="error" text @click="confirmDelete">
                      Delete
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-hover>
      <v-card-text @click="seeMore" class="text-center text-blue seemore">
        See More <v-icon>mdi-menu-down</v-icon>
      </v-card-text>
    </v-card>
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
      "Model1",
      "Model2",
      "Model3",
      "Model4",
      "Model5",
      "Model 6",
      "MOdel 7",
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
        this.filteredModels = this.savedModels.filter((model) =>
          model.toLowerCase().includes(this.searchedValue.toLowerCase())
        );
      } else {
        this.filteredModels = this.savedModels;
      }
    },
    seeMore() {
      const length = this.savedModels.length;
      console.log(length);

      for (let i = length; i < length + 20; i++) {
        this.savedModels.push(`Model ${i}`);
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
