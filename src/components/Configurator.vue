<template>
  <v-container
    :fluid="true"
    style="
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
        sans-serif;
    "
    class="px-0 py-0"
  >
    <v-row no-gutters class="elevation-1 px-6 py-6">
      <v-col class="text-h6 font-weight-thin text-indigo-darken-4">
        CONFIGURATOR
      </v-col>
      <v-col class="text-end d-flex justify-end align-center ga-3">
        <v-icon class="mdi mdi-bell-badge-outline" color="red"> </v-icon>
        <span> Help Center</span>
      </v-col>
    </v-row>
    <v-row no-gutters class="py-4">
      <v-col cols="12">
        <v-list class="d-flex justify-center py-0">
          <v-list-item
            v-for="(value, i) in listItems"
            :key="i"
            @click="navigation(value.label)"
          >
            <v-list-item-content
              :class="{
                'border-b-md': selectedItem === value.label,
                'text-black': selectedItem === value.label,
                'text-grey': selectedItem !== value.label,
              }"
              class="d-flex flex-column align-center"
              style="border-color: #0d273b !important"
            >
              <v-icon size="22">{{ value.icon }}</v-icon>
              <v-list-item-title class="mb-2">{{
                value.label
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-2">
      <v-col cols="4" class="px-4 d-flex flex-column">
        <!-- Toolbar -->
        <v-container
          density="compact"
          color="white"
          :fluid="true"
          class="px-0 py-0 mb-6"
        >
          <v-row no-gutters>
            <v-col class="font-weight-bold text-subtitle-2">{{
              selectedItem ? selectedItem.toUpperCase() : ""
            }}</v-col>
            <v-col class="text-end">
              <v-btn color="#265678" @click="postdata" disabled> Save</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-card flat v-if="selectedItem === 'Dimensions'">
          <v-form>
            <v-row no-gutters>
              <v-col cols="12">
                <label>Height</label>
                <v-number-input
                  :min="0"
                  :model-value="0"
                  control-variant="split"
                  class="my-2"
                  variant="outlined"
                  density="compact"
                >
                </v-number-input>
              </v-col>

              <v-col>
                <label for="">Width</label>
                <v-number-input
                  :min="0"
                  :model-value="0"
                  control-variant="split"
                  class="my-2"
                  variant="outlined"
                  density="compact"
                >
                </v-number-input>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
        <v-card
          flat
          v-if="
            selectedItem === 'Colors' ||
            selectedItem === 'Materials' ||
            selectedItem === 'Handel Bars'
          "
          style="height: 65vh; overflow-y: scroll"
        >
          <v-row class="ga-7 d-flex flex-grow-1" no-gutters>
            <v-col md="3" sm="5">
              <v-dialog max-width="800px" persistent v-model="isAddColor">
                <template v-slot:activator="{ props: activatorProps }">
                  <div
                    v-bind="activatorProps"
                    class="d-flex flex-column align-center justify-center border rounded-lg"
                    style="height: 80%"
                  >
                    <v-icon class="mdi mdi-plus d-block"></v-icon>
                    <v-card-title
                      class="pa-0 ma-0 text-subtitle-2 text-center font-weight-bold mt-1"
                    >
                      Add {{ selectedItem }}
                    </v-card-title>
                  </div>
                </template>
                <template v-slot:default>
                  <v-card
                    rounded="0"
                    :height="selectedItem === 'Colors' ? '450px' : '400px'"
                    class="d-flex justify-space-between"
                    flat
                  >
                    <v-container
                      :fluid="true"
                      class="px-4 py-4 text-white"
                      style="background-color: #214966"
                    >
                      <v-row no-gutters class="d-flex align-center">
                        <v-col>
                          <v-card-title class="text-subtitle-1 pa-0"
                            >ADD {{ selectedItem.toUpperCase() }}</v-card-title
                          >
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-color-picker
                      class="elevation-0"
                      v-if="selectedItem === 'Colors'"
                      rounded="0"
                      v-model:mode="mode"
                      width="100%"
                      v-model="color"
                    >
                    </v-color-picker>
                    <v-container
                      :fluid="true"
                      v-if="
                        selectedItem === 'Materials' ||
                        selectedItem === 'Handel Bars'
                      "
                    >
                      <v-row>
                        <v-col cols="5">
                          <div>
                            <img
                              :src="objectURL ? objectURL : '/images/mo.jpg'"
                              cover
                              width="250px"
                              height="200px"
                            />
                          </div>
                        </v-col>
                        <v-col cols="7">
                          <v-text-field
                            v-model="materialName"
                            variant="underlined"
                            label="Name"
                            :append-icon="
                              materialName ? '' : 'mdi mdi-exclamation'
                            "
                          >
                          </v-text-field>
                          <v-file-input
                            v-model="materialModel"
                            variant="underlined"
                            @change="imgReceived"
                            label="Upload File"
                            :append-icon="
                              materialModel ? '' : 'mdi mdi-exclamation'
                            "
                          >
                          </v-file-input>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-card-actions>
                      <v-btn
                        density="compact"
                        variant="text"
                        @click="canceldialog"
                      >
                        <span class="font-weight-medium"> cancel</span>
                      </v-btn>
                      <v-btn density="compact" variant="text" @click="postData">
                        <span class="font-weight-medium"> Save</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-col
              md="3"
              sm="5"
              class="text-center"
              v-for="(data, i) in displayData"
              :key="i"
              @click="colorChange(data)"
            >
              <v-hover v-slot:default="{ isHovering, props }">
                <div v-bind="props">
                  <div
                    class="rounded-lg mb-1 position-relative"
                    style="height: 80px"
                    :style="
                      data?.colorCode
                        ? { backgroundColor: data.colorCode }
                        : {
                            backgroundImage: `url(${data.imgUrl})`,
                            backgroundSize: 'cover',
                          }
                    "
                  >
                    <!-- Dustbin icon appears only when hovered -->
                    <v-icon
                      v-if="isHovering"
                      class="position-absolute"
                      style="top: 5px; right: 5px; cursor: pointer; color: red"
                      @click.stop="deleteItem(data)"
                    >
                      mdi-delete
                    </v-icon>
                  </div>
                  <v-card-title class="pa-0 ma-0 text-subtitle-2">
                    {{ data.name }}
                  </v-card-title>
                  <v-card-title
                    class="ma-0 pa-0 text-subtitle-2 text-grey-lighten-1"
                  >
                    {{ data.code }}
                  </v-card-title>
                </div>
              </v-hover>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="8">
        <div
          ref="threeContainer"
          style="height: 75vh"
          class="three-container"
        ></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Configurator from "../Three/configurator.js";
import namer from "color-namer";
export default {
  data() {
    return {
      threeContainer: null,
      displayData: null,
      threeScene: null,
      isAddColor: false,
      materialName: "",
      materialModel: null,
      selectedItem: "Colors",
      color: null,
      objectURL: null,
      mode: "hexa",
      listItems: [
        {
          label: "Colors",
          icon: "mdi mdi-palette-outline",
        },
        {
          label: "Dimensions",
          icon: "mdi-checkbox-multiple-blank-outline",
        },
        {
          label: "Materials",
          icon: "mdi mdi-door",
        },
        {
          label: "Handel Bars",
          icon: "mdi-chart-donut",
        },
      ],
      colors: [],
      materials: [],
      handlebars: [{ name: "MatOne", Material: "/images/ceil.jpeg" }],
    };
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new Configurator(this.threeContainer);
    this.getData();
    this.getColor();
  },
  methods: {
    addColor() {
      let colorName = namer(this.color).pantone[0].name;
      console.log(typeof this.color);

      this.$axios
        .post(`${import.meta.env.VITE_API_LINK}/configurator/postColor`, {
          name: colorName,
          colorCode: this.color,
        })
        .then((response) => {
          console.log("Color saved:", response.data);
        })
        .catch((error) => {
          console.error("Error saving color:", error);
        });

      this.isAddColor = false;
      this.color = "";
    },
    async getColor() {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/configurator/getColor`
        );
        if (response.status) {
          this.colors = response.data.colorData;
          this.displayData = this.colors
        }
      } catch (err) {
        console.log(err);
      }
    },
    imgReceived() {
      this.objectURL = URL.createObjectURL(this.materialModel);
    },
    canceldialog() {
      this.isAddColor = false;
      (this.color = ""), (this.objectURL = "");
      (this.materialModel = ""), (this.materialName = "");
    },
    colorChange(color) {
      let type = "color";
      this.threeScene.door(color.code, type);
    },
    async postData() {
      if (this.color) {
        this.addColor();
      }
      const sendingData = new FormData();
      sendingData.append("name", this.materialName);
      sendingData.append("imgUrl", this.materialModel);

      try {
        const response = await this.$axios.post(
          `${import.meta.env.VITE_API_LINK}/configurator/postMaterial`,
          sendingData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status) {
          this.isAddColor = false;
          this.getData();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async getData() {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/configurator/getMaterial`
        );
        if (response.status) {
          this.materials = response.data.configData;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async deleteItem(data) {
      try {
        const response = await this.$axios.delete(
          `${import.meta.env.VITE_API_LINK}/configurator/texture/${data._id}`
        );
        if (response.status === 200) {
          this.getData();
        }
      } catch (err) {
        console.log(err);
      }
    },
    MaterialChange(texturePath) {
      let type = "material";
      this.threeScene.door(texturePath, type);
    },
    navigation(value) {
      if (value) {
        this.selectedItem = value;
      }
      if (this.selectedItem === "Colors") {
        this.displayData = this.colors;
      } else if (this.selectedItem === "Materials") {
        this.displayData = this.materials;
      } else {
        this.displayData = this.handlebars;
      }
    },
  },
};
</script>
