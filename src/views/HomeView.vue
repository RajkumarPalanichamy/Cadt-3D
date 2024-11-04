<template>
  <v-card>
    <v-card flat>
      <v-toolbar density="compact" color="#274e76" flat>
        <v-card-title>
          <v-icon>mdi mdi-cube</v-icon>
          BLUE 3D
        </v-card-title>
        <!-- <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn> -->

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
        <v-card
          class="d-flex align-center justify-center pl-4 pr-4 mt-4"
          flat
          color="#F6F6F6"
        >
          <v-row>
            <v-col cols="8">
              <v-text-field
                variant="outlined"
                label="Enter Your Project Name"
                density="compact"
                prepend-inner-icon="mdi-magnify"
                clearable
              >
              </v-text-field>
            </v-col>
            <v-col cols="2" style="position: relative; right: 30px">
              <v-btn color="#274E76" size="x-large" density="compact"
                >search</v-btn
              >
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
        <v-card
          class="grid pl-4 mt-1 pr-4 pb-16"
          style="overflow-y: scroll; max-height: 100vh"
          color="#F6F6F6"
          flat
        >
          <v-card
            class="d-flex flex-column align-center justify-center"
            @click="createProject"
          >
            <v-icon color="#274e76" size="2em">mdi-plus</v-icon>
            <v-card-title>Create Project</v-card-title>
          </v-card>
          <v-hover
            v-for="(item, index) in savedModels"
            :key="index"
            v-slot="{ isHovering, props }"
          >
            <v-card
              class="d-flex flex-column align-center justify-center"
              width="250px"
              height="210px"
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
          <v-card-text @click="seeMore" class="text-center text-blue" style="cursor: pointer;">
            See More <v-icon>mdi-menu-down</v-icon>
          </v-card-text>
        </v-card>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    items: [
      { text: "Project", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" },
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
  }),
  methods: {
    createProject() {
      this.$router.push("/createproject");
    },
    confirmDelete() {
      this.dialog = false;
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
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
