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
            @click="selectedItem = value.label"
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
            <v-col>{{ selectedItem.toUpperCase() }}</v-col>
            <v-col class="text-end">
              <v-btn color="#265678" disabled> Save</v-btn>
            </v-col>
          </v-row>
        </v-container>

        <v-card
          flat
          v-if="selectedItem === 'Materials'"
          class="mt-6"
          style="height: 65vh; overflow-y: scroll"
        >
          <v-row class="ga-4" no-gutters>
            <v-col
              md="3"
              sm="5"
              class="text-center"
              v-for="(material, i) in materials"
              :key="i"
              @click="MaterialChange(material.Material)"
            >
              <v-img cover style="height: 75px" :src="material.Material" />
              <v-card-title class="pa-0 ma-0 text-subtitle-1">{{
                material.name
              }}</v-card-title>
            </v-col>
          </v-row>
                 </v-card>

          <v-card
          flat
          v-if="selectedItem === 'Swing'"
          class="mt-6"
          style="height: 65vh; overflow-y: scroll"
        >
          <v-row class="ga-4" no-gutters>
            <v-col
              md="3"
              sm="5"
              class="text-center"
              v-for="(swing, i) in swings"
              :key="i"
              @click="swingDetails(swing)"
            >
            <!-- <v-img cover style="height: 75px" :src="material.Material" /> -->
              <v-card-title class="pa-0 ma-0 text-subtitle-1">{{
                swing.name
              }}</v-card-title>
            </v-col>
          </v-row>
                 </v-card>

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
          v-if="selectedItem === 'Colors'"
          style="height: 65vh; overflow-y: scroll"
        >
          <v-row class="ga-7 d-flex flex-grow-1" no-gutters>
            <v-col md="3" sm="5">
              <v-dialog max-width="500" v-model="isAddColor">
                <template v-slot:activator="{ props: activatorProps }">
                  <div
                    v-bind="activatorProps"
                    class="d-flex align-center justify-center border rounded-lg"
                    style="height: 70%"
                  >
                    <v-icon class="mdi mdi-plus"></v-icon>
                  </div>
                </template>
                <template v-slot:default>
                  <v-card rounded="0">
                    <v-container :fluid="true" class="px-0 py-0">
                      <v-row no-gutters class="d-flex align-center">
                        <v-col>
                          <v-icon
                            @click="(isAddColor = false), (color = '')"
                            class="mdi mdi-close"
                          ></v-icon>
                        </v-col>
                        <v-col class="text-end">
                          <v-btn
                            variant=""
                            @click="addColor"
                            :disabled="color ? false : true"
                          >
                            Add
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                    <v-color-picker
                      rounded="0"
                      v-model:mode="mode"
                      width="100%"
                      v-model="color"
                    >
                    </v-color-picker>
                  </v-card>
                </template>
              </v-dialog>

              <v-card-title class="pa-0 ma-0 text-subtitle-1 text-center">
                Add Color
              </v-card-title>
            </v-col>
            <v-col
              md="3"
              sm="5"
              class="text-center"
              v-for="(color, i) in colors"
              :key="i"
              @click="colorChange(color)"
            >
              <div
                class="rounded-lg"
                style="height: 75px"
                :style="color ? { backgroundColor: color.code } : {}"
              ></div>
              <v-card-title class="pa-0 ma-0 text-subtitle-1">{{
                color.name
              }}</v-card-title>
              <v-card-title
                class="ma-0 pa-0 text-subtitle-2 text-grey-lighten-1"
                >{{ color.code }}</v-card-title
              >
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
      threeScene: null,
      isAddColor: false,
      color: null,
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
        {
          label: "Swing",
          icon: "mdi-chart-donut",

        }
      ],
      selectedItem: "Colors",
      colors: [
        { name: "Dodger Blue", code: "#1E90FF" },
        { name: "Classic Green", code: "#008000" },
        { name: "Gray ", code: "#808080" },
        { name: "Beige ", code: "#F5F5DC" },
        { name: "Cyan", code: "#00FFFF" },
        { name: "Saddle Brown", code: "#8B4513 " },
        { name: "Olive Green ", code: "#6B8E23" },
        { name: "Terracotta ", code: "#E2725B" },
      ],
      selectedItem: "Materials",
      materials: [
        { name: "MatOne", Material: "/images/ceil.jpeg" },
        { name: "MatTwo", Material: "/images/floor.jpg" },
        { name: "MatThree", Material: "/images/floor2.jpg" },
        { name: "MatFour", Material: "/images/floor3.jpeg" },
        { name: "MatFive", Material: "/images/f.jpg" },
        { name: "MatSix", Material: "/images/f2.jpg" },
        { name: "MatSeven", Material: "/images/wall.jpg" },
        { name: "MatEight", Material: "/images/wood.jpg" },
      ],
      swings:[{name:'Outwards'},{name:'Inwards'}]
    };
  },
  mounted() {
    this.threeContainer = this.$refs.threeContainer;
    this.threeScene = new Configurator(this.threeContainer);
  },
  methods: {
    addColor() {
      let colorName = namer(this.color).pantone[0].name;
      this.colors.push({ name: colorName, code: this.color });
      this.isAddColor = false;
      this.color = "";
    },
    colorChange(color) {
      let type = "color";
      this.threeScene.door(color.code, type);
    },

    MaterialChange(texturePath) {
      let type = "material";
      this.threeScene.door(texturePath, type);
    },
    doorHeight() {
      console.log(this.height);
    },
    swingDetails(swing){
      let type = "swing";

this.threeScene.door(swing, type);


    }
  },
};
</script>