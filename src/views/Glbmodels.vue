<template>
  <v-container class="py-0 px-0" :fluid="true">

    <v-container :fluid="true">
      <v-row>
        <v-col cols="9" md="9" sm="6">
          <v-text-field
            v-model="searchQuery"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="3" sm="6">
          <v-btn
            class="linear-gradient text-white elevation-6"
            @click="isUpload = true"
            block
            prepend-icon="mdi-upload"
            size="xl-large"
          >
            <v-card-text class="text-subtitle-1 font-weight-bold"
              >UPLOAD</v-card-text
            >
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-card flat>
      <!-- <v-data-table
        height="86vh"


        :loading="isLoading"
        :items="filteredModels"
        item-value="name"
        class="custom-table"
      >
        <template v-slot:item.Sno="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:item.Modelimage="{ item }">
          <v-img :src="item.Modelimage" width="30px" class="hover"></v-img>
        </template>


        <template v-slot:item.action="{ item }">
          <v-icon color="grey" @click="viewModel(item)">mdi-open-in-new</v-icon>
        </template>
      </v-data-table> -->

      <v-data-table
        density="compact"
        fixed-header
        height="75vh"
        :items-per-page="5"
        :items="filteredModels"
      >
        <template v-slot:item.SNO="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:item.Modelimage="{ item }">
          <v-img :src="item.Modelimage" width="30px" class="hover"></v-img>
        </template>
        <template v-slot:item.Action="{ item }">
          <v-icon color="grey" @click="viewModel(item)">mdi-open-in-new</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- Upload Dialog -->
    <v-dialog v-model="isUpload" width="1000px" persistent>

      <v-card height="600px" flat>
        <v-toolbar density="compact" color="#274e76" flat>
          <v-icon class="py-6 px-6" @click="isUpload = false">mdi-close</v-icon>
          <v-card-title>Upload Model</v-card-title>
        </v-toolbar>
        <v-card class="d-flex justify-center" flat>
          <v-card width="40%" class="px-4 py-6" flat>
            <v-form>

              <v-text-field

                variant="underlined"
                label="Enter Model Name"

                v-model="uploadModelType"
              >
              </v-text-field>
              <v-select

                v-model="uploadModelCategories"
                variant="underlined"
                label="Select Model Category"
                :items="['Living Room', 'Bed Room', 'Kitchen']"
              ></v-select>

              <v-select
                v-model="uploadVariant"
                variant="underlined"
                label="Select Variant"
                :items="['Top', 'Bottom']"
              ></v-select>


              <v-file-input
                append-icon="mdi-exclamation"
                accept=".glb"
                label="Add Model"
                variant="underlined"
                v-model="file"

                @change="modelReceived(file)"

              ></v-file-input>
              <v-row class="mt-6">
                <v-col>
                  <v-btn color="#274E76" block class="mr-3" @click="postModel"
                    >Upload
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn @click="isUpload = false" block>Back</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <v-card

            ref="captureDiv"

            width="60%"
            flat
            class="d-flex flex-column align-center my-3 mr-2"
          >
            <gltfViewer ref="gltfViewerComponent" style="height: 550px" />
          </v-card>
        </v-card>
      </v-card>
    </v-dialog>
    <!-- view Dialog -->


    <v-dialog v-model="isView" persistent max-width="1000px" height="550px">
      <v-card rounded="0" flat>
        <!-- LOADING -->
        <v-card
          v-if="isSaveChange"
          class="d-flex align-center justify-center"
          style="
            position: absolute;
            z-index: 10;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(0px);
            background: rgba(0, 0, 0, 0.3);
          "
        >
          <v-progress-circular
            :size="50"
            :width="4"
            color="white"
            indeterminate
          ></v-progress-circular>

        </v-card>
        <v-toolbar density="compact" color="#274E76">
          <v-icon @click="closeView" class="px-5">mdi-close</v-icon>

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

              <v-row>
                <v-col>
                  <v-text-field
                    v-model="variantType"
                    label="Variant"
                    variant="underlined"
                    density="compact"
                    :readonly="!isEdit"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="isEdit">
                <v-col>
                  <!-- <v-btn

                    variant="outlined"
                    @click="triggerFileInput"
                    color="#274E76"
                    block
                  >
                    Update GLTF File

                  </v-btn> -->
                  <v-file-input
                    label="Select File"
                    accept=".glb"
                    v-model="selectedFile"
                    @change="modelReceived(selectedFile)"
                  >
                  </v-file-input>
                  <input ref="updateFileInput" type="file" class="d-none" />

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
                  <v-btn v-if="isEdit" color="#274E76" block @click="saveModel">
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


    <!-- Error snackbar -->
    <v-snackbar v-model="isUploadError">
      {{ uploadErrorText }}
      <template v-slot:actions>
        <v-btn color="pink" variant="text" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>


    <!-- <div style="width: 400px;height: 400px;background-color: green;" ref="captureDiv">green </div> -->

  </v-container>
</template>

<script>
import gltfViewer from "@/components/gltfViewer.vue";
import { mapState } from "vuex";
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
      variantType: "",
      isSaveChange: false,

      uploadModelType: "",

      uploadVariant: "",

      uploadModelCategories: "",
      isUpload: false,

      displayModel: [],
      searchQuery: "",
      file: null,
      isUploadError: false,
      uploadErrorText: "",
      isEdit: false,
      selectedFile: null,
      modelId: undefined,
      categoriesList: ["Living Room", "Bed Room"],

    };
  },
  computed: {
    ...mapState(["modelimg"]),
    filteredModels() {
      
      const query = this.searchQuery.toLowerCase();
      return this.displayModel
        .filter((model) => {
          return (
            model.modelType.toLowerCase().includes(query) ||
            model.category.toLowerCase().includes(query)
          );
        })
        .map(({ __v, filePath,modelImg, ...rest }) => ({
          SNO: true,
          ...rest,
          Action: true,
        }));
    },
  },

  methods: {

    async getModel() {
      
      this.displayModel = [];
      this.isLoading = true;
      try {
        const response = await this.$axios.get(
          `${import.meta.env.VITE_API_LINK}/glb/getglbloaders`
        );

        if (response.status == 200) {


          this.displayModel = response.data;

          this.isLoading = false;

        }
      } catch (err) {
        console.log(err);
      }
    },
    modelReceived(file) {
      const objectURL = URL.createObjectURL(file);
      this.$refs.gltfViewerComponent.gltf(objectURL);
    },

    async postModel() {

      this.isLoading = true;      
      if (
        !this.file ||
        !this.uploadModelCategories ||
        !this.uploadModelType ||
        !this.uploadVariant
      ) {

        this.uploadErrorText = "All fields are required.";
        this.isUploadError = true;
        return;
      }

      const formData = new FormData();
      formData.append("category", this.uploadModelCategories);
      formData.append("modelType", this.uploadModelType);
      formData.append("file", this.file);

      formData.append("variant", this.uploadVariant);
      formData.append("modelImg", this.modelimg);

      try {

        const response = await this.$axios.post(
          `${import.meta.env.VITE_API_LINK}/glb/glbloaders`,


          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 201) {
          this.isLoading = false;
          this.isUpload = false;
          await this.getModel();
        }
      } catch (err) {
        this.uploadErrorText = "Failed to upload model.";
        this.isUploadError = true;
        console.error(err);
      }
    },
    async saveModel() {
      if (!this.modelId) {
        console.error("Model ID is required");
        return;
      }
      try {

        this.isSaveChange = true;

        const formData = new FormData();
        formData.append("modelType", this.modelType);
        formData.append("category", this.modelCategory);

        if (this.selectedFile) {
          formData.append("file", this.selectedFile);
        }

        const response = await this.$axios.put(
          `${import.meta.env.VITE_API_LINK}/glb/updateglb/${this.modelId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.status === 200) {

          this.isSaveChange = false;

          this.isEdit = false;
          this.selectedFile = null;
          this.isView = false;
          await this.getModel();
        }
      } catch (err) {
        console.error("Failed to update model:", err);
      }
    },
    cancelEdit() {
      this.isEdit = false;
      this.selectedFile = null;
    },
    closeView() {
      this.isView = false;
      this.isEdit = false;
    },
    viewModel(viewFile) {
      this.isView = true;

      const selectedModel = this.displayModel.find(

        (model) => model._id === viewFile._id
      );

      if (selectedModel) {
        // this.modelId = selectedModel._id;
        this.modelType = selectedModel.modelType;
        this.modelCategory = selectedModel.category;


        this.variantType = selectedModel.variant;



        this.$nextTick(() => {
          if (this.$refs.gltfViewerComponent) {
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
.linear-gradient {
  background: linear-gradient(13deg, #0c2539, #1d4f72, #0c2539);
}

.active {
  color: #274e76;
  border-bottom: 2px solid #274e76;
}
.hover:hover {
  transform: scale(3);
  height: 150px;
}
.linear-gradient {
  background: linear-gradient(13deg, #0c2539, #1d4f72, #0c2539);
}
</style>

