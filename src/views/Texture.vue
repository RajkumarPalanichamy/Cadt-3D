<template>
  <v-container class="py-0 px-0" :fluid="true">
    <v-container class="py-0 px-0" :fluid="true">
      <v-card height="100vh" flat>
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
          :items="filteredTextures"
          density="compact"
          item-value="name"
          :loading="isLoading"
        >
          <!-- Search Bar -->
          <template v-slot:top>
            <v-row dense style="height: 44px; border-bottom: 1px solid #e4e4e4">
              <v-spacer class="search_bg_color"></v-spacer>
              <v-col class="search_bg_color">
                <v-text-field
                  density="compact"
                  v-model="searchQuery"
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
          <template v-slot:item.Textureimage="{ item }">
            <v-img :src="item.Textureimage" width="30px" class="hover"></v-img>
          </template>
          <template v-slot:item.view="{ item }">
            <v-icon color="grey" @click="viewTexture(item)">mdi-eye-outline</v-icon>
          </template>
          <template v-slot:item.edit="{ item }">
            <v-icon
              color="blue"
              @click="startEdit(item)"
            >
              mdi-pencil-outline
            </v-icon>
          </template>
        </v-data-table-virtual>
      </v-card>
    </v-container>

    <!-- Upload Dialog -->
    <v-dialog v-model="isUpload" width="1000px">
      <v-card height="550px">
        <v-toolbar density="compact" color="#274e76" flat>
          <v-icon class="py-6 px-6" @click="isUpload = false">mdi-close</v-icon>
          <v-card-title>Upload Texture</v-card-title>
        </v-toolbar>
        <v-card class="d-flex justify-center mt-16" flat>
          <v-card width="50%" class="px-6 py-2" flat>
            <v-form>
              <v-text-field
                v-model="uploadTextureName"
                label="Enter Texture Name"
                variant="underlined"
                hint="eg:Living Room,Bed Room..."
                class="mb-6 mt-6"
              ></v-text-field>
              <v-text-field
                v-model="uploadTextureType"
                label="Enter Texture Type"
                hint="eg:Window,Door,Table..."
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
            width="60%"
            flat
            class="d-flex flex-column align-center my-3 mr-2"
          >
            <gltfViewer ref="gltfViewerComponent" style="height: 550px" />
          </v-card>
        </v-card>
      </v-card>
    </v-dialog>

    <!-- Edit Dialog -->
    <v-dialog v-model="isEdit" max-width="1000px">
      <v-card rounded="0" flat>
        <v-toolbar density="compact" color="#274E76">
          <v-icon @click="isEdit = false" class="px-5">mdi-close</v-icon>
          <v-card-title>Edit Material</v-card-title>
        </v-toolbar>
        <v-card class="d-flex" flat>
          <v-card width="70%" flat rounded="0" class="px-3 py-3">
            <gltfViewer ref="gltfViewerComponent" style="height: 480px" />
          </v-card>
          <v-card width="30%" flat class="pl-4 px-4 pt-10 mt-16">
            <v-form>
              <v-row>
                <v-col>
                  <v-text-field
                    variant="underlined"
                    v-model="editTextureName"
                    label="Texture Name"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="editTextureType"
                    label="Texture Type"
                    variant="underlined"
                    density="compact"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <input
                    ref="editFileInput"
                    type="file"
                    class="d-none"
                    @change="handleEditFileUpload"
                  />
                  <v-btn
                    variant="outlined"
                    @click="triggerEditFileInput"
                    color="#274E76"
                    block
                  >
                    Upload New File
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="#274E76" block @click="saveEditedTexture">Save</v-btn>
                </v-col>
                <v-col>
                  <v-btn variant="outlined" color="#274E76" block @click="isEdit = false">Cancel</v-btn>
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
      isEdit: false,
      isLoading: true,
      textureName: "",
      textureType: "",
      searchQuery: "",
      filteredTextures: [],
      textureData: [],
      userSavedTextures: [],
      file: "",
      editFile: null,
      uploadTextureName: "",
      uploadTextureType: "",
      editTextureName: "",
      editTextureType: "",
      uploadOverlay: false,
      viewTextureDetails: {},
    };
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
      if (response.status === 200) {
        this.userSavedTextures = response.data;
        this.isLoading = false;
        response.data.forEach((texture) => {
          const textureObj = {
            Sno: true,
            Textureimage: texture.textures[0].url,
            _id: texture._id,
            TextureName: texture.name,
            TextureType: texture.type,
            view: true,
            edit: true,
          };
          this.textureData.push(textureObj);
        });
      }
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
    startEdit(item) {
      this.isEdit = true;
      this.editTextureName = item.TextureName;
      this.editTextureType = item.TextureType;
    },
    handleEditFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.editFile = file;
      }
    },
    async saveEditedTexture() {
      if (!this.editTextureName || !this.editTextureType) {
        alert("Please fill all the fields.");
        return;
      }

      const formData = new FormData();
      formData.append("name", this.editTextureName);
      formData.append("type", this.editTextureType);
      if (this.editFile) {
        formData.append("Texturesfiles", this.editFile);
      }

      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_LINK}/texture/editTexture`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        if (response.status === 200) {
          alert("Texture updated successfully!");
          this.isEdit = false;
          this.getTextures();
        }
      } catch (error) {
        alert("Failed to update texture.");
      }
    },
    triggerEditFileInput() {
      this.$refs.editFileInput.click();
    },
    viewTexture(item) {
      this.viewTextureDetails = item;
      this.isView = true;
    },

  },
  mounted() {
    this.getTextures();
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
