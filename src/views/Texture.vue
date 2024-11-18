<template>
  <v-container class="py-0 px-0 ml-0 mr-0" :fluid="true">
    <v-container class="py-0 px-0 mr-0 ml-0" :fluid="true">
      <v-card>
        <v-data-table-virtual
          height="93vh"
          :items="textureData"
          density="compact"
          item-value="name"
          :loading="isLoading"
        >
          <!-- <template v-slot:top>
            <v-toolbar flat color="white" density="compact" class="py-0">
              <v-spacer></v-spacer>
              <v-text-field
                class="pt-4 mr-7"
                v-model="search"
                density="compact"
                variant="underlined"
                label="Search"
              ></v-text-field>
            </v-toolbar>
          </template> -->
          <template v-slot:item.Sno="{ index }">
            {{ index + 1 }}
          </template>
          <template v-slot:item.Textureimage="{ item }">
            <v-img :src="item.Textureimage" width="40px" class="hover"></v-img>
          </template>

          <template v-slot:item.view="{ item }">
            <v-icon color="grey" @click="viewTexture(item)"
              >mdi-eye-outline</v-icon
            >
          </template>
        </v-data-table-virtual>
        <!-- Upload Icon -->
        <v-row
          @click="isUpload = true"
          style="position: absolute; bottom: 50px; right: 80px"
        >
          <v-col>
            <v-btn
              size="x-large"
              icon="mdi-upload-outline"
              color="#274E76"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <!-- Upload Dialog -->
    <v-dialog v-model="isUpload" width="1000px">
      <v-card height="550px">
        <v-toolbar density="compact" color="#274e76" flat>
          <v-icon class="py-6 px-6" @click="isUpload = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card class="d-flex justify-center mt-16" flat>
          <v-card width="50%" class="px-6 py-2" flat>
            <v-form>
              <v-card-title>Upload Model</v-card-title>
              <v-text-field
                :focused="isFocused"
                label="Enter Model Categories"
                variant="outlined"
                hint="eg:Living Room,Bed Room..."
                class="mb-6 mt-6"
              ></v-text-field>
              <v-text-field
                label="Enter Model Name"
                hint="eg:Window,Door,Table..."
                variant="outlined"
                class="mb-6"
              ></v-text-field>
              <v-btn color="#274E76" class="mr-3">Upload</v-btn>
              <v-btn>Back</v-btn>
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
            <gltfViewer ref="gltfViewerComponent" style="height: 65vh" />
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
      textureData: [],
      allTexture: [],
    };
  },
  async mounted() {
    this.textureData = [];
    const response = await axios.get(
      `${import.meta.env.VITE_API_LINK}/getTextures`
    );

    if (response.status == 200) {
      this.allTexture = response.data;
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
  methods: {
    edit() {
      this.disableInputs = false;
    },
    cancel() {
      this.disableInputs = true;
    },
    viewTexture(viewFile) {
      this.isView = true;
      console.log(viewFile);
      
      this.textureName = viewFile.TextureName;

      this.textureType = viewFile.TextureType;
      setTimeout(() => {
        this.allTexture.forEach((eachTexture) => {
          if (eachTexture._id === viewFile._id) {
            const textureLink = eachTexture.textures[0].url;
            this.$refs.gltfViewerComponent.Texture(textureLink);
          }
        });
      }, 1000);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        console.log("File selected:", file);
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
</style>
