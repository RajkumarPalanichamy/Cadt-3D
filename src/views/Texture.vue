<template>
  <v-container class="py-0 px-0" :fluid="true">
    <v-container class="py-0 px-0" :fluid="true">
      <v-card color="white" flat class="d-flex align-center mx-8">
      <v-text-field
        width="70%"
        v-model="searchQuery"
        class="mt-5 mr-5"
        density="comfortable"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        label="Search"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn
        @click="isUpload = true"
        width="200px"
        prepend-icon="mdi-upload-outline"
        color="#274E76"
        size="large"
        >Upload</v-btn
      >
    </v-card>
      <v-card height="100vh" flat>
        <!-- <v-row
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
        </v-row> -->
        <v-data-table-virtual
          height="94vh"
          :items="filteredTextures"
          density="compact"
          item-value="name"
          :loading="isLoading"
        >
          <!-- Search Bar -->
         
          <template v-slot:item.Sno="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.Textureimage="{ item }">
            <v-img :src="item.Textureimage" width="30px" class="hover"></v-img>
          </template>

          <template v-slot:item.view="{ item }">
            <v-icon color="grey" @click="viewTexture(item)"
              >mdi-eye-outline</v-icon
            >
          </template>
        </v-data-table-virtual>
      </v-card>
    </v-container>
    <!-- Upload Dialog -->
    <v-dialog v-model="isUpload" width="1000px">
      <v-card height="600px" flat>
        <v-toolbar density="compact" color="#274e76" flat>
          <v-icon class="py-6 px-6" @click="isUpload = false">mdi-close</v-icon>
          <v-card-title>Upload Texture</v-card-title>
        </v-toolbar>
        <v-card class="d-flex justify-center" flat>
          <v-card width="40%" class="px-4 py-6" flat>
            <v-form>
              <v-text-field
                v-model="uploadTextureName"
                label="Enter Texture Name"
                variant="underlined"
                class="mb-6 mt-6"
              ></v-text-field>
              <v-text-field
                v-model="uploadTextureType"
                label="Enter Texture Type"
                variant="underlined"
                class="mb-6"
              ></v-text-field>
              <v-file-input
                label="Add Texture"
                variant="underlined"
                v-model="file"
                @change="textureReceived"
              ></v-file-input>
              <v-row class="mt-6">
                <v-col>
                  <v-btn color="#274E76" block class="mr-3" @click="uploadTexture"
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
                    v-model="textureName"
                    label=" Texture Name"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="textureType"
                    label="Texture Type "
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
                  <v-btn variant="outlined" color="#274E76" block>Cancel</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-card>
      </v-card>
    </v-dialog>
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
      isView: false,
      isUpload: false,
      isLoading: true,
      textureName: "",
      textureType: "",
      searchQuery: "",
      filteredTextures: [],
      textureData: [],
      userSavedTextures: [],
      file: "",
      uploadTextureName: "",
      uploadTextureType: "",
      uploadOverlay: false,
    };
  },
  async mounted() {
    this.getTextures();
  },
  computed: {
    filteredTextures() {
      if (!this.searchQuery) {
        return this.textureData;
      }
      const query = this.searchQuery.toLowerCase();
      return this.textureData.filter(
        (item) =>
          item.TextureName.toLowerCase().includes(query) ||
          item.TextureType.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    edit() {
      this.disableInputs = false;
    },
    textureReceived() {
      const objectURL = URL.createObjectURL(this.file);
      this.$refs.gltfViewerComponent.Texture(objectURL);
    },
    watchChanges() {
      if (this.file || this.uploadTextureName || this.uploadTextureType) {
        confirm("are you want to discard the chances");
        return;
      } else {
        this.isUpload = false;
      }
    },
    async getTextures() {
      this.textureData = [];
      const response = await axios.get(
        `${import.meta.env.VITE_API_LINK}/texture/getTextures`
      );

      if (response.status == 200) {
        this.userSavedTextures = response.data;
        this.isLoading = false;
        response.data.forEach((eachTexture) => {
          (this.textureName = eachTexture.name),
            (this.textureType = eachTexture.type);
          const textureObj = {
            Sno: true,
            Textureimage: eachTexture.textures[0].url,
            _id: eachTexture._id,
            TextureName: eachTexture.name,
            TextureType: eachTexture.type,
            view: true,
          };
          this.textureData.push(textureObj);
        });
      }
    },
    async uploadTexture() {
      this.uploadOverlay = true;

      if (!this.file || !this.uploadTextureName || !this.uploadTextureType) {
        console.error("Missing required fields");
        return;
      }
      const formData = new FormData();
      formData.append("name", this.uploadTextureName);
      formData.append("type", this.uploadTextureType);
      formData.append("Texturesfiles", this.file);

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_LINK}/texture/textures,
          formData`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status == "200") {
          this.isUpload = false;
          this.uploadOverlay = false;
        }
      } catch (err) {
        console.error("Upload failed:", err.response?.data || err.message);
      }
    },

    cancel() {
      this.disableInputs = true;
    },
    viewTexture(viewFile) {
      this.isView = true;
      this.textureName = viewFile.TextureName;
      this.textureType = viewFile.TextureType;
      setTimeout(() => {
        this.userSavedTextures.forEach((eachTexture) => {
          if (eachTexture._id === viewFile._id) {
            const textureLink = eachTexture.textures[0].url;
            this.$refs.gltfViewerComponent.Texture(textureLink);
          }
        });
      }, 100);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.file = file;
      }
    },
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
  /* transition: all ease-in .5s; */
  transform: scale(5);
  height: 200px;
}
.search_bg_color {
  background-color: #fafafa;
}
</style>