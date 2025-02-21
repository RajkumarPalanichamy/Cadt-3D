<template>
  <v-container :fluid="true" class="py-0 px-0">
    <v-toolbar density="compact" color="#274e76" flat>
      <v-card-title>
        <v-icon>mdi mdi-cube-outline</v-icon>
        BLUE 3D
      </v-card-title>
      <v-btn icon @click="backToHome">
        <v-tooltip activator="parent" location="top">Exit</v-tooltip>
        <v-icon>mdi-menu-left</v-icon>
      </v-btn>

      <v-btn icon @click="undo">
        <v-tooltip activator="parent" location="top">undo</v-tooltip>
        <v-icon>mdi-arrow-left-top</v-icon>
      </v-btn>

      <v-btn icon>
        <v-tooltip activator="parent" location="top">Redo</v-tooltip>
        <v-icon>mdi-arrow-right-top</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn-toggle
        density="compact"
        v-model="view"
        rounded
        class="mr-16 center-toggle"
      >
        <v-btn
          class="switch-button"
          :class="{ active: view === '2D' }"
          :disabled="view === '2D'"
          @click="triggerCreate('2D')"
        >
          2D
        </v-btn>
        <v-btn
          class="switch-button"
          :class="{ active: view === '3D' }"
          :disabled="view === '3D'"
          @click="triggerCreate('3D')"
        >
          3D
        </v-btn>
      </v-btn-toggle>

      <v-spacer></v-spacer>
      <v-btn icon @click="isSave = true">
        <v-card-text>SAVE</v-card-text>
      </v-btn>
    </v-toolbar>
    <!-- Threee Container -->
    <v-card
      class="d-flex"
      @dragover.prevent="onDragOver"
      @drop="onDrop"
      style="cursor: pointer"
      height="93vh"
    >
      <ThreeScene ref="threeSceneComponent" />
      <!-- Save Btn Dialog -->
      <v-dialog v-model="isSave" activator="#activator-target" max-width="450">
        <v-card
          class="px-4"
          prepend-icon="mdi-bullseye-arrow"
          title="Enter Your Project Name ?"
        >
          <v-text-field
            class="mt-4 mb-4"
            v-model="projectName"
            variant="outlined"
            hint="Enter Your Project Name"
            label="Project Name"
            :rules="[rules.required]"
          ></v-text-field>
          <template v-slot:actions>
            <v-spacer></v-spacer>
            <v-btn @click="saveFile(projectName)" color="#274E76">
              Save Project
            </v-btn>
            <v-btn @click="isSave = false" color="red"> Don't Save </v-btn>
          </template>
        </v-card>
      </v-dialog>
      <!-- icon card-model -->
      <v-btn
        icon
        v-if="showModelIcon"
        v-for="(icon, index) in IconForModel"
        :key="index"
        size="3em"
        :style="getIconStyle(index)"
        v-tooltip="icon.text"
        @click="clickedIcon(icon.text)"
        class="position-absolute btn-hover"
      >
        <v-icon>{{ icon.icon }}</v-icon>
      </v-btn>
      <!-- Sidebar -->
      <v-card
        color="#F6F6F6"
        style="top: 230px !important; right: 10px"
        class="d-flex flex-column justify-center position px-2 py-2 border-md"
      >
        <v-icon
          v-for="(item, index) in sideBar"
          :key="index"
          @click="toggleVisibility(item.icon)"
          class="mt-2"
          size="1.7em"
          :v-tooltip="item.tooltip ? item.tooltip : ''"
        >
          {{ item.icon }}
        </v-icon>
      </v-card>
      <!-- Texture Card -->
      <v-card
        v-if="textureCard"
        height="85vh"
        width="300px"
        class="mr-6 pb-2 position"
      >
        <v-toolbar class="px-2" density="compact" color="#274E76">
          <v-card-title>Texture</v-card-title>
          <v-spacer></v-spacer>
          <v-icon @click="textureCard = false">mdi-close</v-icon>
        </v-toolbar>
        <!-- LOader Before texture Loading -->
        <v-card
          height="100%"
          v-if="isTextureLoader"
          class="d-flex flex-column justify-center align-center mt-16 pt-16"
        >
          <v-progress-circular indeterminate> </v-progress-circular>
          <v-card-text class="text-subtitle-2">
            Please Wait , It will take some time
          </v-card-text>
        </v-card>

        <v-icon v-if="!textureCategoryCard" @click="textureCategoryCard = true"
          >mdi-arrow-left</v-icon
        >
        <v-card
          height="75vh"
          class="overflow px-2 py-2 mt-4"
          flat
          style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px"
        >
          <v-card
            v-if="textureCategoryCard"
            v-for="(texture, i) in textureCategories"
            :key="i"
            @click="selectedTextureCategory(texture.type.toLowerCase())"
            height="150px"
            class="elevation-4"
          >
            <v-img cover height="100px" :src="texture.image"></v-img>
            <v-card-text class="text-center text-subtitle-2">
              {{ texture.type }}</v-card-text
            >
          </v-card>

          <v-card
            v-if="!textureCategoryCard"
            height="100px"
            v-for="(texture, i) in textureData"
            :key="i"
          >
            <v-img cover height="100%" :src="texture.textures[0].url" />
          </v-card>
        </v-card>
      </v-card>

      <!-- Texture Details Card -->
      <v-card
        v-if="textureDetailsSection && !textureCard"
        height="85vh"
        width="300px"
        class="mr-6 position elevation-4"
      >
        <v-toolbar color="#274E76" class="px-2" density="compact">
          <v-card-text class="text-subtitle-1 font-weight-bold px-0"
            >Wall</v-card-text
          >
          <v-icon @click="textureDetailsSection = false">mdi-close</v-icon>
        </v-toolbar>

        <v-expansion-panels
          class="border-md"
          flat
          v-model="panel"
          :readonly="readonly"
          multiple
        >
          <v-expansion-panel>
            <v-expansion-panel-title
              class="font-weight-bold text-subtitle-2 py-0"
              >Basic</v-expansion-panel-title
            >
            <v-expansion-panel-text>
              <v-row class="mt-1">
                <v-col class="d-flex justify-space-between align-center py-0">
                  <v-card-text class="py-0 px-0">Width:</v-card-text>
                </v-col>
                <v-col class="py-0"
                  ><v-number-input
                    variant="outlined"
                    density="compact"
                    hide-details
                    control-variant="stacked"
                  ></v-number-input
                ></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-space-between align-center py-0">
                  <v-card-text class="py-0 px-0">Height:</v-card-text>
                </v-col>
                <v-col class="py-2"
                  ><v-number-input
                    variant="outlined"
                    density="compact"
                    hide-details
                    control-variant="stacked"
                  ></v-number-input
                ></v-col>
              </v-row>
              <v-row>
                <v-col class="d-flex justify-space-between align-center py-0">
                  <v-card-text class="py-0 px-0">Thickness:</v-card-text>
                </v-col>
                <v-col class="py-1"
                  ><v-number-input
                    variant="outlined"
                    density="compact"
                    control-variant="stacked"
                  ></v-number-input
                ></v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>

      <v-card
        v-if="isVisible"
        height="85vh"
        width="300px"
        class="mr-6 pt-2 pb-2 position"
      >
        <v-toolbar
          color="white"
          class="mb-6"
          density="compact"
          style="border-radius: 6px"
        >
          <v-card-title class="text-h6">Search</v-card-title>
          <v-spacer></v-spacer>
          <v-icon class="pr-3" @click="cancel">mdi-window-close</v-icon>
        </v-toolbar>
        <v-row class="pl-2 pr-2">
          <v-col>
            <v-text-field
              rounded
              variant="outlined"
              label="Search Models"
              density="compact"
              append-inner-icon="mdi-magnify"
              clearable
              color="#274E76"
            />
          </v-col>
        </v-row>

        <!-- model card -->
        <v-card
          height="62vh"
          flat
          class="overflow pl-2 pr-2 mb-4"
          v-if="isModelCard"
        >
          <v-row class="pb-2" v-if="categories">
            <v-col>
              <v-card-subtitle
                @click="setView('categories')"
                class="text-center cursor-pointer"
                :class="{ 'text-blue-darken-4': !isModel }"
                >Categories</v-card-subtitle
              >
            </v-col>
            <v-col>
              <v-card-subtitle
                @click="setView('models')"
                class="text-center cursor-pointer"
                :class="{ 'text-blue-darken-4': isModel }"
                >Models</v-card-subtitle
              >
            </v-col>
          </v-row>
          <v-divider class="mb-2"></v-divider>
          <v-card v-if="isCategories" class="grid pl-1 pb-10 pt-1" flat>
            <v-card
              v-for="(model, index) in showCard"
              :key="index"
              width="120px"
              height="170px"
              class="border"
              @click="selectedCategory(model)"
            >
              <v-img :src="model.modelimg" height="100px" cover></v-img>
              <v-card-text class="text-center text-blue-darken-4">{{
                model.modelname
              }}</v-card-text>
            </v-card>
          </v-card>
          <!-- inside model Categories -->
          <v-card v-if="categorySelected" flat>
            <v-icon
              @click="
                (isCategories = true),
                  (categories = true),
                  (categorySelected = false)
              "
              >mdi-arrow-left</v-icon
            >
            <v-card class="grid py-2 px-4" flat width="100%">
              <v-card
                v-for="(model, i) in modelInSelectedCategory"
                :key="i"
                class="text-center px-2 py-4 elevation-4"
              >
                {{ model.modelType }}</v-card
              >
            </v-card>
          </v-card>
          <v-card v-if="isModel" flat>
            <v-list v-if="modelList">
              <v-list-subheader class="text-blue-darken-4">
                Available Models Are</v-list-subheader
              >
              <v-list-item-group>
                <v-list-item
                  v-for="(item, index) in models"
                  :key="index"
                  class="mb-1 ml-4 mr-4 models"
                  @click="selectedModel(item.name)"
                >
                  <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                  </template>
                  <v-list-item-title class="ml-6">
                    {{ item.name }}</v-list-item-title
                  >
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <!-- model Display -->
            <v-card v-if="clickModel">
              <v-card-text
                ><v-icon @click="back()" class="mr-2 text-red"
                  >mdi-arrow-left</v-icon
                >
                {{ totalmodel }} Model Available</v-card-text
              >
              <v-card density="compact" flat>
                <v-card
                  v-for="(model, index) in availabelModels"
                  :key="index"
                  @dragstart="onDragStart(model)"
                  draggable="true"
                  class="ma-2 elevation-2"
                  outlined
                  style="cursor: grab"
                >

                  <v-img
                    draggable="false"
                    :src="model.FurnituresImagesArraywithGltf[0].furnitureImage">
                  </v-img>

                  <v-card-text class="text-center">{{
                    model.modelType
                  }}</v-card-text>
                </v-card>
              </v-card>
            </v-card>
          </v-card>
        </v-card>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import ThreeScene from "@/components/threeContainer.vue";
import Cookies from "js-cookie";
import VueJwtDecode from "vue-jwt-decode";
import { mapState } from "vuex";
export default {
  name: "createProject",
  components: {
    ThreeScene,
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "Field is required",
      },
      showModelIcon: false,
      panel: [0],
      readonly: false,

      textureCard: false,
      textureCategoryCard: true,
      textureDetailsSection: false,
      textureData: [],
      isTextureLoader: false,

      view: "2D",
      isVisible: false,

      isModel: false,
      modelList: true,
      isModelCard: false,

      categories: false,
      isCategories: true,
      categorySelected: false,
      modelInSelectedCategory: [],

      isSave: false,
      showCard: [],
      clickModel: false,
      projectName: "",
      availabelModels: [],

      models: [
        // { name: "Door", icon: "mdi-door" },
        // { name: "Window", icon: "mdi-window-closed" },
        // { name: "Table", icon: "mdi-table" },
        // { name: "Sofas", icon: "mdi-sofa" },
        // { name: "Beds", icon: "mdi-bed" },
        // { name: "Chairs", icon: "mdi-seat" },
        // { name: "Plants", icon: "mdi-flower" },
        // { name: "Curtains", icon: "mdi-curtains" },
        // { name: "Musical Instrument", icon: "mdi-music" },
      ],
      modelsList: [
        {
          modelname: "Living Room",
          modelimg: "/public/images/livingroom.jpg",
        },
        {
          modelname: "Kitchen",
          modelimg: "/images/kitchen.jpeg",
        },

        {
          modelname: "Bed Room",
          modelimg: "/images/bedroom.jpg",
        },
      ],
      drawList: [
        {
          modelname: "Draw",
          modelimg: "/images/draw.jpg",
        },
        {
          modelname: "Square",
          modelimg: "/images/square.jpg",
        },
        {
          modelname: "Lcut",
          modelimg: "/images/lcut.jpg",
        },
      ],
      sideBar: [
        { icon: "mdi-draw-pen", tooltip: "Draw" },
        { icon: "mdi-table-furniture", tooltip: "Furnitures" },
      ],
      IconForModel: [
        { icon: "mdi-format-paint", text: "Texture" },
        { icon: "mdi-delete", text: "Delete" },
        { icon: "mdi-ray-vertex", text: "Vertices" },
        { icon: "mdi-rotate-right-variant", text: "Rotate" },
      ],
      iconPosition: [],
      textureCategories: [
        { type: "INDOOR", image: "/images/indoor.jpg" },
        { type: "OUTDOOR", image: "/images/outdoor.webp" },
      ],
    };
  },
  computed: {
    ...mapState(["triggerMethod", "loadSavedModel", "wallValue"]),

    totalmodel() {
      return this.availabelModels.length;
    },
  },
  watch: {
    triggerMethod(newValue) {
      if (newValue) {
        this.handleBackHome();
        this.$store.commit("changeTriggerMethod");
      }
    },
    wallValue(newValue) {
      if (newValue) {
        this.newValue = newValue;
        this.addingIcons(newValue);
        this.$store.commit("revertWall", false);
      }
    },
  },

  methods: {
    addingIcons(event) {
      // window.addEventListener("click", (event) => {
      console.log("EVENETEE", event);

      this.textureDetailsSection = true;
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.iconPosition = [
        { x: x - 70, y: y - 50 },
        { x: x + 70, y: y - 50 },
        { x: x, y: y - 100 },
        { x: x, y: y + 50 },
      ];
      this.showModelIcon = true;
      // });3
    },
    getIconStyle(index) {
      const position = this.iconPosition[index];
      if (position) {
        return {
          left: `${position.x}px`,
          top: `${position.y}px`,
        };
      }
      return {};
    },
    clickedIcon(text) {
      this.isModel =
        this.isModelCard =
        this.isCategories =
        this.categories =
          false;
      this.isVisible = false;

      if (text == "Texture") {
        this.textureCard = true;
      } else {
        this.textureCard = false;
      }
    },
    selectedTextureCategory(category) {
      this.textureCategoryCard = false;
      this.isTextureLoader = true;
      if (category == "indoor") {
        console.log("te");

        this.getTextures();
      } else {
        this.getTextures();
      }
    },
    async getTextures() {
      const response = await this.$axios.get(
        `${import.meta.env.VITE_API_LINK}/texture/getTextures`
      );

      if (response.status == 200) {
        this.isTextureLoader = false;
        this.textureData = response.data;
      }
    },
    loadSaved(newValue) {
      this.$refs.threeSceneComponent.loadSaved(newValue);
    },
    setView(view) {
      if (view == "models") {
        this.isModel = true;
        this.isCategories = false;
        this.categorySelected = false;
      } else {
        this.isModel = false;
        this.isCategories = true;
      }
    },
    async selectedModel(selectedmodel) {
      this.availabelModels = [];
      this.clickModel = true;
      this.modelList = false;
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
        );
        console.log("selecetdModel", response.data);

        response.data.forEach((eachModel) => {
          if (selectedmodel == eachModel.modelType) {
            this.availabelModels.push(eachModel);
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getModel() {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
        );
        if (response.status == "200") {
          response.data.forEach((eachModel) => {
            if (
              eachModel.modelType &&
              !this.models.some((model) => model.name === eachModel.modelType)
            ) {
              this.models.push({
                name: eachModel.modelType,
                icon: "mdi-help-box",
              });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    backToHome() {
      this.$router.push("/homeview");
    },
    back() {
      this.modelList = true;
      this.clickModel = false;
    },
    cancel() {
      this.isVisible = false;
    },
    triggerCreate(selectedView) {
      if (this.view === selectedView) {
        return;
      }
      this.view = selectedView;
      this.$refs.threeSceneComponent.update();
    },
    toggleVisibility(selectedValue) {
      this.isVisible = true;
      if (selectedValue == "mdi-table-furniture") {
        this.setView("categories");
        this.isModelCard = true;
        this.categories = true;
        this.showCard = this.modelsList;
      } else {
        (this.isModelCard = true), (this.categories = false);
        this.showCard = this.drawList;
        this.categorySelected = false;
        this.isCategories = true;
        this.isModel = false;
      }
    },

    async selectedCategory(category) {
      const selectedCategory = category.modelname
        .split(" ")
        .join("")
        .toLowerCase();

      if (
        selectedCategory === "livingroom" ||
        selectedCategory === "bedroom" ||
        selectedCategory === "kitchen"
      ) {
        this.modelInSelectedCategory = [];
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
        );
        if (response.status == "200") {
          this.categorySelected = true;
          this.isCategories = false;
          this.categories = false;

          response.data.forEach((model) => {
            if (
              selectedCategory ==
              model.category.split(" ").join("").toLowerCase()
            ) {
              this.modelInSelectedCategory.push(model);
            }
          });
        }
      } else {
        if (category.modelname == "Draw") {
          this.isVisible = false;
          setTimeout(() => {
            this.$refs.threeSceneComponent.create();
          }, 500);
        } else {
          const response = await this.$axios.get(
            `${import.meta.env.VITE_API_LINK}/default/getdefaultscene`
          );
          response.data.forEach((model) => {
            if (model.name == category.modelname) {
              this.$refs.threeSceneComponent.modelLoad(model);
            }
          });
        }
      }
    },
    async loadModel(modelId) {
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/furniture/getfurnitures`,

          {
            responseType: "json",
          }
        );

        const models = response.data;
        let modelLink;
        models.forEach((eachModel) => {
          if (eachModel._id == modelId) {
            modelLink =
              eachModel.FurnituresImagesArraywithGltf[0].furnitureGltfLoader;
          }
        });
        this.$refs.threeSceneComponent.gltfLoader(modelLink);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    },
    onDragStart(modelLink) {
      
      const draggedModel = JSON.stringify(modelLink);
      event.dataTransfer.setData("modelData", draggedModel);

      const dragStartEvent = new CustomEvent("model-drag-start", {
        detail: { droppedText: draggedModel, mouse: { x: 0, y: 0 } },
      });
      window.dispatchEvent(dragStartEvent);
    },

    onDragOver(event) {
      this.isVisible = false;
      event.preventDefault();

      // Calculate mouse position
      const mouse = {
        x: (event.clientX / event.target.clientWidth) * 2 - 1,
        y: -(event.clientY / event.target.clientHeight) * 2 + 1,
      };

      // Dispatch the model-drag-move event to update placeholder position
      const dragMoveEvent = new CustomEvent("model-drag-move", {
        detail: { mouse },
      });
      window.dispatchEvent(dragMoveEvent);
    },

    onDrop(event) {
      const droppedText = JSON.parse(event.dataTransfer.getData("modelData"));
      this.isVisible = true;

      // Calculate mouse position
      const mouse = {
        x: (event.clientX / event.target.clientWidth) * 2 - 1,
        y: -(event.clientY / event.target.clientHeight) * 2 + 1,
      };

      // Dispatch the model-drop event with model link and position
      const dropEvent = new CustomEvent("model-drop", {
        detail: { droppedText, mouse },
      });
      window.dispatchEvent(dropEvent);
    },

    undo() {
      this.$refs.threeSceneComponent.undoEvent();
    },
    saveFile(projectname) {
      const data = Cookies.get("jwtToken");
      const userName = VueJwtDecode.decode(data);
      this.$refs.threeSceneComponent.saveFile(projectname, userName.name);
    },

    handleBackHome() {
      this.$router.push("/homeview");
    },
  },
  mounted() {
    this.getModel();
    if (this.loadSavedModel) {
      this.loadSaved(this.loadSavedModel);
    }
  },
  beforeUnmount() {
    this.$store.commit("cancelModel");
  },
};
</script>

<style scoped>
.overflow {
  overflow-y: scroll;
  scrollbar-width: thin;
  scrollbar-color: #386b9e white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
.position {
  z-index: 2;
  position: absolute;
  top: 20px;
  right: 60px;
}
.cursor-pointer {
  cursor: pointer;
}
.models:hover {
  color: #274e76;
}
.btn-hover:hover {
  color: blue;
}
.position-texture {
  z-index: 1;
  position: absolute;
  top: 50px;
  right: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #274e76;
}

.switch-button {
  background-color: #f0f0f0;
  color: black;
  font-weight: bold;
  justify-content: center;
}

.switch-button.active {
  background-color: #274e76;
  color: white;
}

.v-btn-toggle {
  border: 1px solid #ddd;
  border-radius: 25px;
  background-color: #f9f9f9;
}
.center-toggle {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
