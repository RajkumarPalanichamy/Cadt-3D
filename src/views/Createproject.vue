<template>
  <v-card>
    <v-toolbar density="compact" color="#274e76" flat>
      <v-card-title>
        <v-icon>mdi mdi-cube</v-icon>
        BLUE 3D
      </v-card-title>
      <v-btn icon @click="back">
        <v-icon>mdi-menu-left</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-arrow-left-top</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-arrow-right-top</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn icon class="mr-16" @click="triggerCreate">
        <v-icon>mdi-video-3d</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleVisibility">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
  <v-card class="d-flex">
    <ThreeScene ref="threeSceneComponent" />
    <v-card
    
      style="top: 230px !important; right: 10px"
      class="d-flex flex-column justify-center position px-2 py-2"
    >
      <v-icon v-for="(item, index) in sideBar" :key="index" 
      @click="toggleVisibility"
      class="mt-2" size="1.3em" color="grey">{{
        item
      }}</v-icon>
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
          <v-icon class="text-error" @click="toggleVisibility"
            >mdi-window-close</v-icon
          >
        </v-col>
      </v-row>

      <v-row class="pl-2 pr-2">
        <v-col>
          <v-text-field label="Search Model" color="primary" clearable>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card-subtitle class="text-center text-primary"
            >Models </v-card-subtitle
          >
        </v-col>
        <v-col>
          <v-card-subtitle class="text-center">Categories</v-card-subtitle>
        </v-col>
      </v-row>
      <v-divider class="mt-2"></v-divider>
      <v-card height="61vh" flat class="overflow pl-2 pr-2 mb-4 grid mt-3">
        <v-card
          v-for="(model, index) in modelsList"
          :key="index"
          width="130px"
          height="170px"
          @click="selectedCategory(model)"
        >
          <v-img :src="model.modelimg"></v-img>
          <v-card-text class="text-center +">{{ model.modelname }}</v-card-text>
        </v-card>
      </v-card>
    </v-card>
  </v-card>
</template>

<script>
import ThreeScene from "@/components/threeContainer.vue";

export default {
  name: "createProject",
  components: {
    ThreeScene,
  },
  data() {
    return {
      isVisible: false,
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
      sideBar: ["mdi-magnify", "mdi-magnify"],
    };
  },
  methods: {
    back() {
      this.$router.push("/");
    },
    triggerCreate() {
      this.$refs.threeSceneComponent.create();
    },
    toggleVisibility() {
      this.isVisible = !this.isVisible;
    },
    selectedCategory(category) {
      alert(category.modelname);
    },
    async loadModels() {
      this.group = [];
      try {
        const response = await axios.get("http://localhost:3000/getfurnitures");
        response.data.forEach((eachModel) => {
          if (this.selectedModel == eachModel.modelType) {
            this.group.push(eachModel);
          }
        });
      } catch (err) {
        console.log(err);
      }
    },
    async getFurniture(modelId) {
      const loader = new GLTFLoader();
      try {
        const response = await axios.get(
          `http://localhost:3000/getfurnitures`,
          { responseType: "json" }
        );
        const models = response.data;
        let modelLink;
        models.forEach((eachModel) => {
          if (eachModel._id == modelId) {
            modelLink =
              eachModel.FurnituresImagesArraywithGltf[0].furnitureGltfLoader;
          }
        });
        loader.load(modelLink, (gltf) => {
          this.scene.add(gltf.scene);
        });
      } catch (error) {
        console.error("Error loading model:", error);
      }
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
  right: 30px;
}
</style>
