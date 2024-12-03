<template>
  <v-container class="py-0 px-0" :fluid="true">
    <v-container class="px-0 py-0" :fluid="true">
      <v-card flat height="100vh">
        <!-- Upload Button -->
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

        <!-- Models Table -->
        <v-data-table-virtual
          height="94vh"
          :loading="isLoading"
          :items="filteredModels"
          density="compact"
          item-value="name"
        >
          <template v-slot:top>
            <v-row dense style="height: 44px; border-bottom: 1px solid #e4e4e4">
              <v-spacer class="search_bg_colo"></v-spacer>
              <v-col class="search_bg_colo">
                <v-text-field
                  v-model="searchQuery"
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

          <!-- Data Table Templates -->
          <template v-slot:item.Sno="{ index }">
            {{ index + 1 }}
          </template>

          <template v-slot:item.view="{ item }">
            <v-icon color="grey" @click="viewModel(item)">mdi-eye-outline</v-icon>
          </template>
        </v-data-table-virtual>
      </v-card>


      <!-- Upload Dialog -->
      <v-dialog v-model="isUpload" width="1000px">
        <v-card height="550px" flat>
          <v-toolbar density="compact" color="#274e76" flat>
            <v-icon class="py-6 px-6" @click="isUpload = false">mdi-close</v-icon>
            <v-card-title>Upload Model</v-card-title>
          </v-toolbar>
          <v-card class="d-flex justify-center mt-16" flat>
            <v-card width="50%" class="px-6 py-2" flat>
              <v-form>
                <v-text-field
                  v-model="uploadModelCategories"
                  label="Enter Model Categories"
                  variant="outlined"
                  hint="e.g., Living Room, Bed Room"
                  class="mb-6 mt-6"
                ></v-text-field>
                <v-text-field
                  v-model="uploadModelType"
                  label="Enter Model Type"
                  hint="e.g., Window, Door, Table"
                  variant="outlined"
                  class="mb-6"
                ></v-text-field>
                <v-btn color="#274E76" class="mr-3" @click="postModel">Upload</v-btn>
                <v-btn @click="isUpload = false">Back</v-btn>
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
                @click="triggerFileInput1"
                class="mt-16 mb-4"
                color="#274E76"
              >
                mdi-cloud-upload-outline
              </v-icon>
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

      <!-- View Dialog -->
      <v-dialog v-model="isView" max-width="1000px" height="550px">
    <v-card rounded="0" flat>
      <v-toolbar density="compact" color="#274E76">
        <v-icon @click="isView = false" class="px-5">mdi-close</v-icon>
      </v-toolbar>
      <v-card class="d-flex" height="100vh" flat>
        <v-card width="70%" flat rounded="0" class="px-3 py-3">
          <!-- GLTF Viewer -->
          <gltfViewer ref="gltfViewerComponent" style="height: 480px" />
        </v-card>
        <v-card width="30%" flat class="pl-4 px-4 pt-10 mt-16">
          <!-- Model Details -->
          <v-form>
            <v-row>
              <v-col>
                <v-text-field
                  variant="underlined"
                  v-model="modelType"
                  label="Model Type"
                  density="compact"
                  :readonly="!isEdit"
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
                  :readonly="!isEdit"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row v-if="isEdit">
              <v-col>
                <v-btn
                  variant="outlined"
                  @click="triggerFileInput"
                  color="#274E76"
                  block
                >
                  Update GLTF File
                </v-btn>
                <input
                  ref="updateFileInput"
                  type="file"
                  class="d-none"
                  @change="handleUpdateFile"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  v-if="!isEdit"
                  color="#274E76"
                  block
                  @click="isEdit = true"
                >
                  Edit
                </v-btn>
                <v-btn
                  v-if="isEdit"
                  color="#274E76"
                  block
                  @click="saveModel"
                >
                  Save
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  v-if="isEdit"
                  variant="outlined"
                  color="#274E76"
                  block
                  @click="cancelEdit"
                >
                  Cancel
                </v-btn>
                <v-btn
                  v-if="!isEdit"
                  variant="outlined"
                  color="#274E76"
                  block
                  @click="isView = false"
                >
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-card>
    </v-card>
  </v-dialog>


      <!-- Error Snackbar -->
      <v-snackbar v-model="isUploadError">
        {{ uploadErrorText }}
        <template v-slot:actions>
          <v-btn color="pink" variant="text" @click="isUploadError = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
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
      isLoading: true,
      isView: false,
      modelType: "",
      modelCategory: "",
      uploadModelType: "",
      uploadModelCategories: "",
      isUpload: false,
      allModel: [],
      displayModel: [],
      searchQuery: "",
      file: null,
      isUploadError: false,
      uploadErrorText: "",
      isEdit: false,
      selectedFile: null,
      modelId: undefined,
    };
  },
  computed: {
    filteredModels() {
      const query = this.searchQuery.toLowerCase();
      return this.displayModel.filter(
        (model) =>
          model["Model Type"].toLowerCase().includes(query) ||
          model.categories.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    triggerFileInput1() {
      this.$refs.fileInput.click();
    },
    triggerFileInput() {
      this.$refs.updateFileInput.click();
    },
    handleUpdateFile(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
      }
    },
    async getModel() {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
        );
        if (response.status === 200) {
          this.isLoading = false
          this.allModel = response.data;
          this.displayModel = response.data.map((eachModel) => ({
            Sno: true,
            _id: eachModel._id,
            "Model Type": eachModel.modelType,
            categories: eachModel.category,
            view: true,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch models:", err);
      } finally {
        this.isLoading = false;
      }
    },
    modelReceived() {
      const objectURL = URL.createObjectURL(this.file);
      this.$refs.gltfViewerComponent.gltf(objectURL);
    },
    async postModel() {
      this.isLoading = true;
      if (!this.file || !this.uploadModelCategories || !this.uploadModelType) {
        this.uploadErrorText = "All fields are required.";
        this.isUploadError = true;
        return;
      }

      const formData = new FormData();
      formData.append("category", this.uploadModelCategories);
      formData.append("modelType", this.uploadModelType);
      formData.append("file", this.file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_LINK}/glb/glbloaders`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 201) {
          this.isLoading = false
          this.isUpload = false;
          await this.getModel(); // Refresh models
        }
      } catch (err) {
        this.uploadErrorText = "Failed to upload model.";
        this.isUploadError = true;
        console.error(err);
      }
    },
    async saveModel() {
      if (!this.isEdit) return;

      try {
        this.isLoading = true
        const formData = new FormData();
        formData.append("modelType", this.modelType);
        formData.append("category", this.modelCategory);

        if (this.selectedFile) {
          formData.append("file", this.selectedFile);
        }

        const response = await axios.put(
          `${import.meta.env.VITE_API_LINK}/glb/updateglb/${this.modelId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {
          this.isLoading = false
          this.isEdit = false;
          this.selectedFile = null;
          this.isView = false;
          await this.getModel(); // Refresh models
        }
      } catch (err) {
        console.error("Failed to update model:", err);
      }
    },
    cancelEdit() {
      this.isEdit = false;
      this.selectedFile = null;
    },
    viewModel(viewFile) {
      const selectedModel = this.allModel.find(
        (model) => model._id === viewFile._id
      );

      if (selectedModel) {
        this.modelId = selectedModel._id;
        this.modelType = selectedModel.modelType;
        this.modelCategory = selectedModel.category;
        this.isView = true;

     
        this.$nextTick(() => {
          if (this.$refs.gltfViewerComponent) {
            console.log(selectedModel)
            this.$refs.gltfViewerComponent.gltf(selectedModel.filePath);
          }
        });
      } else {
        console.error("Model not found for viewing.");
      }
    },
  },
  created() {
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
  height: 150px;
}



</style>
