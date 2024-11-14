<template>
  <v-container class="py-0 px-0 ml-0 mr-0" fluid="true">
    <v-card class="d-flex" rounded="0" flat>
      <v-card-title
        @click="showModels = true"
        :class="['pointer text-subtitle-1', { active: showModels }]"
      >
        Textures
      </v-card-title>
      <v-card-title
        @click="showModels = false"
        :class="['pointer text-subtitle-1', { active: !showModels }]"
      >
        Upload Textures
      </v-card-title>
    </v-card>

    <v-container class="mt-6 py-0 px-0 mr-0 ml-0" fluid="true">
      <v-card v-if="showModels" rounded="0" flat>
        <v-card v-if="textureData.length > 0">
          <v-data-table-virtual
            :items="textureData"
            density="compact"
            item-value="name"
          >
            <template v-slot:item.SNO="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:item.Image="{ item }">
              <v-img src="/images/login.png" width="40px" class="hover"></v-img>
            </template>
            <template v-slot:item.view="{ item }">
              <v-icon color="grey" @click="viewTexture(item)"
                >mdi-eye-outline</v-icon
              >
            </template>
          </v-data-table-virtual>
        </v-card>
        <v-card
          v-else
          class="d-flex flex-column align-center justify-center mt-16"
          height="500px"
        >
          <v-icon class="mt-5 text-h1 font-weight-regular" color="#274E76"
            >mdi-file-document-remove-outline</v-icon
          >
          <v-card-text class="mt-2" flat>No Textures Available</v-card-text>
        </v-card>
      </v-card>

      <v-card v-else class="pl-4 pr-4 d-flex" flat>
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
            <v-btn @click="showModels = true">Back</v-btn>
          </v-form>
        </v-card>

        <v-card
          width="50%"
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
    </v-container>
    <v-dialog v-model="isView" transition="dialog-top-transition" fullscreen>
      <v-card class="px-2 py-2">
        <v-icon @click="isView = false">mdi-close</v-icon>
        <v-row class="mt-2 px-0 py-0">
          <v-col cols="3">
            <v-hover v-slot="{ isHovering, props }">
              <v-img>
                <v-img src="/images/login.png" width="300px"></v-img>
              </v-img>
            </v-hover>
          </v-col>
          <v-col cols="8">
            <v-col>
              <v-text-field
                density="compact"
                variant="underlined"
                label="Texture Name"
                v-model="textureName"
                :disabled="disableInputs"
              ></v-text-field>

              <v-text-field
                density="compact"
                label="Texture Type"
                variant="underlined"
                v-model="textureType"
                :disabled="disableInputs"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex" style="width: 400px; height: 70px">
              <v-col style="background-color: green" class="mr-4"></v-col>
              <v-col style="background-color: red" class="mr-4"></v-col>
              <v-col style="background-color: yellow" class="mr-4"></v-col>
              <v-col style="background-color: blue" class="mr-4"></v-col>
              <v-col style="background-color: grey" class="mr-4"></v-col>
              <v-col style="background-color: orange" class="mr-4"></v-col>
            </v-col>
            <v-col cols="4" class="mt-2 d-flex">
              <v-btn 
              @click="edit"
              :disabled="!disableInputs"
              block>Edit</v-btn>
              <v-btn 
              class="ml-3"
              @click="cancel()"
              :disabled="disableInputs"

              block>Cancel</v-btn>
            </v-col>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "glbModels",
  data() {
    return {
      showModels: true,
      isView: false,
      textureName: "",
      textureType: "",
      disableInputs: true,
      isFocused:true,
      textureData: [
        {
          SNO: true,
          Image: true,
          Name: "Door",
          type: "Bump",
          date: "2024-01-01",
          view: true,
        },
        {
          SNO: true,
          Image: true,
          Name: "Door",
          type: "Bump",
          date: "2024-01-01",
          view: true,
        },
        {
          SNO: true,
          Image: true,
          Name: "Door",
          type: "Bump",
          date: "2024-01-01",
          view: true,
        },
        {
          SNO: true,
          Image: true,
          Name: "Door",
          type: "Bump",
          date: "2024-01-01",
          view: true,
        },
      ],
    };
  },
  methods: {
    edit(){
          this.disableInputs = false
    },
    cancel(){
      this.disableInputs = true
    },
    viewTexture(viewFile) {
      this.isView = true;
      (this.textureName = viewFile.Name), (this.textureType = viewFile.type);
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
