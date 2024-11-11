<template>
  <v-container fluid class="py-0 px-0">
    <v-toolbar density="compact" color="#274e76" flat>
      <v-card-title>
        <v-icon>mdi mdi-cube</v-icon>
        BLUE 3D
      </v-card-title>
      <v-btn icon @click="backToHome">
        <v-icon>mdi-menu-left</v-icon>
      </v-btn>

      <v-btn icon @click="undo">
        <v-icon>mdi-arrow-left-top</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-arrow-right-top</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn icon class="mr-16" @click="triggerCreate">
        <v-icon>{{ is3DView ? "mdi-video-2d" : "mdi-video-3d" }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card
      class="d-flex"
      @dragover.prevent="onDragOver"
      style="cursor: pointer"
    >
      <ThreeScene ref="threeSceneComponent" />
      <V-row   
       class="mr-1"
      style="position:absolute;top: 30px !important; right: 10px;background-color:#274E76 ;border-radius: 50%;">
        <v-col>
          <v-btn-icon
         
          >
            <v-icon size="1.7em" color="white">mdi-content-save-outline</v-icon>
          </v-btn-icon>
        </v-col>
      </V-row>
      <v-card
        style="top: 230px !important; right: 10px"
        class="d-flex flex-column justify-center position px-2 py-2"
      >
        <v-icon
          v-for="(item, index) in sideBar"
          :key="index"
          @click="toggleVisibility(item)"
          class="mt-2"
          size="1.7em"
          color="grey"
          >{{ item }}</v-icon
        >
      </v-card>
      <v-card
        v-if="isVisible"
        height="85vh"
        width="300px"
        class="mr-6 pt-2 pb-2 position"
      >
        <v-row class="d-flex align-center">
          <v-col>
            <v-card-title class="text-h6">Search</v-card-title>
          </v-col>
          <v-col class="d-flex justify-end mr-6">
            <v-icon class="text-error" @click="cancel">mdi-window-close</v-icon>
          </v-col>
        </v-row>

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
        <v-list v-if="!isModelCard">
          <v-list-subheader class="text-blue-darken-4 m"
            >REACENT ACTIVITIES</v-list-subheader
          >
        </v-list>

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
          <v-card v-if="!isModel" class="grid" flat>
            <v-card
              v-for="(model, index) in showCard"
              :key="index"
              width="130px"
              height="170px"
              @click="selectedCategory(model)"
            >
              <v-img :src="model.modelimg"></v-img>
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
                  @dragstart="onDragStart(model._id)"
                  draggable="true"
                  class="ma-2 pt-2"
                  outlined
                  style="cursor: grab"
                >
                  <v-img
                    :src="model.FurnituresImagesArraywithGltf[0].furnitureImage"
                  >
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

export default {
  name: "createProject",
  components: {
    ThreeScene,
  },
  data() {
    return {
      is3DView: false,
      isVisible: false,
      isModel: false,
      modelList: true,
      isModelCard: false,
      categories: false,
      showCard: [],
      clickModel: false,
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
          modelimg: new URL("@/assets/livingroom.jpg", import.meta.url).href,
        },
        {
          modelname: "Kitchen",
          modelimg: new URL("@/assets/kitchen.jpeg", import.meta.url).href,
        },
        {
          modelname: "Bathroom",
          modelimg: new URL("@/assets/Bathroom.jpeg", import.meta.url).href,
        },
        {
          modelname: "Bed Room",
          modelimg: new URL("@/assets/bedroom.jpg", import.meta.url).href,
        },
        {
          modelname: "Balcony",
          modelimg: new URL("@/assets/Balcony.jpeg", import.meta.url).href,
        },
      ],
      drawList: [
        {
          modelname: "Draw",
          modelimg: new URL("@/assets/livingroom.jpg", import.meta.url).href,
        },
        {
          modelname: "Square",
          modelimg: new URL("@/assets/livingroom.jpg", import.meta.url).href,
        },{
        modelname: "Lcut",
          modelimg: new URL("@/assets/livingroom.jpg", import.meta.url).href,
        },


      ],
      sideBar: ["mdi-magnify", "mdi-draw-pen", "mdi-table-furniture"],
    };
  },
  methods: {
    setView(view) {
      this.isModel = view === "models" ? true : false;
    },
    async selectedModel(selectedmodel) {
      this.availabelModels = [];
      try {
        const response = await axios.get("http://localhost:3000/getfurnitures");
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
      } else if (selectedValue == "mdi-magnify") {
        this.isModelCard = false;
      } else {
        (this.isModelCard = true), (this.categories = false);
        this.showCard = this.drawList;
      }
    },

    async selectedCategory(category) {
      if(category.modelname=="Draw"){
        this.isVisible=false
        setTimeout(()=>{
          this.$refs.threeSceneComponent.create();
        }, 500);
      }
      else{
        const response = await axios.get(
          "http://localhost:3000/api/getData")
          response.data.forEach((model)=>{
if(model.name==category.modelname){
  this.$refs.threeSceneComponent.modelLoad(model);

}

          })
          
      }
    },
    async loadModel(modelId) {
      try {
        const response = await axios.get(
          "http://localhost:3000/getfurnitures",
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
    onDragStart(modelId) {
      const draggedModel = modelId;
      event.dataTransfer.setData("text/plain", draggedModel);
      this.loadModel(modelId);

    },
    onDragOver(event) {
      this.isVisible = false;
      event.preventDefault();
    },
    // onDrop(event) {
    //   const droppedText = event.dataTransfer.getData("text/plain");
    //   this.isVisible = true;
    // },
    undo() {
      this.$refs.threeSceneComponent.undoEvent();
    },
  },
  computed: {
    totalmodel() {
      return this.availabelModels.length;
    },
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
