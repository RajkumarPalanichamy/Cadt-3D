<template>
  <v-container class="py-0 px-0" :fluid="true">
    <v-container class="px-0 py-0" :fluid="true">
      <v-card flat height="100vh">
        <v-row
          @click="isUpload = true"
          style="position: absolute; bottom: 100px; right: 80px"
        >
          <v-col>
            <v-btn
              size="x-large"
              icon="mdi-upload-outline"
              color="#274E76"
            ></v-btn>
          </v-col>
        </v-row>
        <v-data-table-virtual
          height="94vh"
          :loading="isLoading"
          :items="displayModel"
          density="compact"
          item-value="name"
        >
          <template v-slot:top>
            <v-row dense style="height: 44px; border-bottom: 1px solid #e4e4e4">
              <v-spacer class="search_bg_colo"></v-spacer>
              <v-col class="search_bg_colo">
                <v-text-field
                  density="compact"
                  class="mt-1"
                  style="height: 0px"
                  variant="plain"
                  prepend-icon="mdi-magnify"
                  placeholder="Search"
                ></v-text-field>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item.Sno="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.Modelimage="{ item }">
            <v-img :src="item.Modelimage" width="30px" class="hover"></v-img>
          </template>

          <template v-slot:item.view="{ item }">
            <v-icon color="grey" @click="viewModel(item)"
              >mdi-eye-outline</v-icon
            >
          </template>
        </v-data-table-virtual>
      </v-card>
      <!-- Upload Dialog -->
      <v-dialog v-model="isUpload" width="1000px">
        <v-card height="550px" flat>
          <v-toolbar density="compact" color="#274e76" flat>
            <v-icon class="py-6 px-6" @click="isUpload = false"
              >mdi-close</v-icon
            >
            <v-card-title>Upload Model</v-card-title>
          </v-toolbar>
          <v-card class="d-flex justify-center mt-16" flat>
            <v-card width="50%" class="px-6 py-2" flat>
              <v-form>
                <v-text-field
                  v-model="uploadModelCategories"
                  label="Enter Model Categories"
                  variant="outlined"
                  hint="eg:Living Room,Bed Room..."
                  class="mb-6 mt-6"
                ></v-text-field>
                <v-text-field
                  v-model="uploadModelType"
                  label="Enter Model Type"
                  hint="eg:Window,Door,Table..."
                  variant="outlined"
                  class="mb-6"
                ></v-text-field>
                <v-btn color="#274E76" class="mr-3" @click="postModel"
                  >Upload</v-btn
                >
                <v-btn @click="showModels = true">Back</v-btn>
              </v-form>
            </v-card>
            <v-card
              width="45%"
              flat
              class="d-flex flex-column align-center px-4"
              style="border: 2px dotted grey"
            >
              <v-icon
                style="font-size: 100px"
                @click="triggerFileInput"
                class="mt-16 mb-4"
                color="#274E76"
                >mdi-cloud-upload-outline</v-icon
              >
              <v-card-title>Click the Icon to Upload File</v-card-title>
              <input
                ref="fileInput"
                type="file"
                class="d-none"
                @change="handleFileUpload"
              />
            </v-card>
          </v-card>
        </v-card>
      </v-dialog>
      <!-- view Dialog -->
      <v-dialog v-model="isView" max-width="1000px" height="550px">
        <v-card rounded="0" flat>
          <v-toolbar density="compact" color="#274E76">
            <v-icon @click="isView = false" class="px-5">mdi-close</v-icon>
          </v-toolbar>
          <v-card class="d-flex" height="100vh" flat>
            <v-card width="70%" flat rounded="0" class="px-3 py-3">
              <gltfViewer ref="gltfViewerComponent" style="height: 480px" />
            </v-card>
            <v-card width="30%" flat class="pl-4 px-4 pt-10 mt-16">
              <v-form>
                <v-row>
                  <v-col>
                    <v-text-field
                      variant="underlined"
                      v-model="modelType"
                      label="Model Type"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="modelCategory"
                      label="Model Category"
                      variant="underlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col>
                    <v-btn color="#274E76" block>Edit</v-btn>
                  </v-col>
                  <v-col>
                    <v-btn variant="outlined" color="#274E76" block
                      >Cancel</v-btn
                    >
                  </v-col>
                </v-row>
              </v-form>
            </v-card>
          </v-card>
        </v-card>
      </v-dialog>
    </v-container>
  </v-container>
</template>

<script>
import axios from "axios";
import gltfViewer from "@/components/gltfViewer.vue";
export default {
  name: "glbModels",
  components: {
    gltfViewer,
  },
  data() {
    return {
      isLoading: false,
      showModels: true,
      isView: false,
      modelType: "",
      modelCategory: "",
      uploadModelType: "",
      uploadModelCategories: "",
      isUpload: false,
      allModel: [],
      displayModel: [],
      file: "",
    };
  },

  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
      }
    },
    async getModel() {
      this.displayModel = [];
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/getFurnitures`
        );
        if (response.status == 200) {
          this.allModel = response.data;
          this.isLoading = false;
          response.data.forEach((eachModel) => {
            const modelObj = {
              Sno: true,
              Modelimage:
                eachModel.FurnituresImagesArraywithGltf[0].furnitureImage,
              _id: eachModel._id,
              "Model Type": eachModel.modelType,
              categories: eachModel.category,
              view: true,
            };
            this.displayModel.push(modelObj);
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async postModel() {
      const formData = new FormData();
      formData.append("glbUrl", this.file);
      formData.append("category", this.uploadModelCategories);
      formData.append("modelType", this.uploadModelType);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_LINK}/glbloaders`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Model uploaded:", response.data);
        this.isUpload = false;
      } catch (err) {
        console.error("Failed to upload model:", err);
      }
    },
    viewModel(viewFile) {
      this.isView = true;
      setTimeout(() => {
        this.allModel.forEach((eachModel) => {
          if (eachModel._id == viewFile._id) {
            this.modelType = eachModel.modelType;
            this.modelCategory = eachModel.category;
            const modelLink =
              eachModel.FurnituresImagesArraywithGltf[0].furnitureGltfLoader;
            this.$refs.gltfViewerComponent.gltf(modelLink);
          }
        });
      }, 1000);
    },
  },
  async mounted() {
    this.getModel();
  },
};
</script>

<style scoped>
.d-none {
  display: none;
}
.pointer {
  cursor: pointer;
}
.active {
  color: #274e76;
  border-bottom: 2px solid #274e76;
}
.hover:hover {
  transform: scale(3);
  height: 200px;
}
</style>
