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

      <v-btn icon class="mr-16" @click="triggerCreate">
        <v-icon>{{ is3DView ? "mdi-video-2d" : "mdi-video-3d" }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="isSave = true" class="mr-4">
        <v-card-text>SAVE</v-card-text>
      </v-btn>
    </v-toolbar>
    <v-card
      class="d-flex bg-red"
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
        <!-- <v-list v-if="!isModelCard">
          <v-list-subheader class="text-blue-darken-4 m"
            >REACENT ACTIVITIES</v-list-subheader
          >
        </v-list> -->

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
          <v-card v-if="isCategories" class="grid pl-1 pb-10 pt-1 " flat>
            <v-card
              v-for="(model, index) in showCard"
              :key="index"
              width="120px"
              height="170px"
              class="border"
              @click="selectedCategory(model)"
            >
              <v-img :src="model.modelimg"  height="100px" cover></v-img>
              <v-card-text class="text-center text-blue-darken-4">{{
                model.modelname
              }}</v-card-text>
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
              <v-card class="grid">
                <v-card
                  v-for="(model, index) in availabelModels"
                  :key="index"
                  @dragstart="
                    onDragStart(
                      model.FurnituresImagesArraywithGltf[0].furnitureGltfLoader
                    )
                  "
                  :draggable="isDrag"
                  class="ma-2 pt-2"
                  outlined
                  style="cursor: grab"
                >
                  <v-img
                    draggable="false"
                    :src="model.FurnituresImagesArraywithGltf[0].furnitureImage">
                  </v-img>
                  <v-card-text class="text-center">{{
                    model.FurnituresImagesArraywithGltf[0].furnitureName
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
import axios from "axios";
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
      is3DView: false,
      isDrag: true,
      isVisible: false,
      isModel: false,
      modelList: true,
      isModelCard: false,
      categories: false,
      isCategories: true,
      isSave: false,
      showCard: [],
      clickModel: false,
      projectName: "",
      availabelModels: [],
      models: [
        { name: "Door", icon: "mdi-door" },
        { name: "Window", icon: "mdi-window-closed" },
        { name: "Table", icon: "mdi-table" },
        { name: "Sofas", icon: "mdi-sofa" },
        { name: "Beds", icon: "mdi-bed" },
        { name: "Chairs", icon: "mdi-seat" },
        { name: "Plants", icon: "mdi-flower" },
        { name: "Curtains", icon: "mdi-curtains" },
        { name: "Musical Instrument", icon: "mdi-music" },
      ],
      modelsList: [
        {
          modelname: "Living Room",
          modelimg: "/public/images/livingroom.jpg"
        },
        {
          modelname: "Kitchen",
          modelimg: "/public/images/kitchen.jpeg"
        },
        {
          modelname: "Bathroom",
          modelimg: "/public/images/Bathroom.jpeg"
        },
        {
          modelname: "Bed Room",
          modelimg: "/public/images/bedroom.jpg"
        },
        {
          modelname: "Balcony",
          modelimg: "/public/images/Balcony.jpeg"
        },
      ],
      drawList: [
        {
          modelname: "Draw",
          modelimg:  "/public/images/draw.jpg",
        },
        {
          modelname: "Square",
          modelimg:  "/public/images/square.jpg",
        },
        {
          modelname: "Lcut",
          modelimg:  "/public/images/lcut.jpg"
        },
      ],
      sideBar: [
        { icon: "mdi-draw-pen", tooltip: "Draw" },
        { icon: "mdi-table-furniture", tooltip: "Furnitures" },
      ],
    };
  },
  computed: {
    ...mapState(["triggerMethod", "loadSavedModel"]),

    totalmodel() {
      return this.availabelModels.length;
    },
  },
  watch: {
    triggerMethod(newValue) {
      console.log("newValue", newValue);

      if (newValue) {
        this.handleBackHome();
        this.$store.commit("changeTriggerMethod");
      }
    },
  },

  methods: {
    loadSaved(newValue) {
      console.log("newValue", newValue);

      this.$refs.threeSceneComponent.loadSaved(newValue);
    },
    setView(view) {
      console.log(view);
      if (view == "models") {
        (this.isModel = true), (this.isCategories = false);
      } else {
        (this.isModel = false), (this.isCategories = true);
      }
    },
    async selectedModel(selectedmodel) {
      this.availabelModels = [];
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/furniture/getfurnitures`
        );

        response.data.forEach((eachModel) => {
          if (selectedmodel == eachModel.modelType) {
            this.availabelModels.push(eachModel);
          }
          this.modelList = false;
          this.clickModel = true;
        });
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
    triggerCreate() {
      this.is3DView = !this.is3DView;
      this.$refs.threeSceneComponent.update();
    },
    toggleVisibility(selectedValue) {
      this.isVisible = true;
      if (selectedValue == "mdi-table-furniture") {
        this.isModelCard = true;
        this.categories = true;
        this.showCard = this.modelsList;
      } else {
        (this.isModelCard = true), (this.categories = false);
        this.showCard = this.drawList;
        this.isCategories = true;
        this.isModel = false;
      }
    },

    async selectedCategory(category) {
      if (category.modelname == "Draw") {
        this.isVisible = false;
        setTimeout(() => {
          this.$refs.threeSceneComponent.create();
        }, 500);
      } else {
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/default/getdefaultscene`
        );
        response.data.forEach((model) => {
          if (model.name == category.modelname) {
            this.$refs.threeSceneComponent.modelLoad(model);
          }
        });
      }
    },
    async loadModel(modelId) {
      try {
        const response = await axios.get(
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
      const draggedModel = modelLink; // The URL or path to the GLTF model
      event.dataTransfer.setData("text/plain", draggedModel);

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
      const droppedText = event.dataTransfer.getData("text/plain");
      console.log("Dropped Model:", droppedText);

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
      console.log("returing home");
      console.log("triggerMethod2", this.triggerMethod);

      this.$router.push("/homeview");
    },
  },
  mounted() {
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

</style>
