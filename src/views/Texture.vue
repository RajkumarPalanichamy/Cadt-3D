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
        <v-card v-if="models.length > 0">
          <!-- <v-data-table
            width="100%"
            density="compact"
            :headers="headers"
            :items="textureData"
            :items-per-page="5"
          >
          </v-data-table> -->
          <v-table density="compact">
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-left">S.No</th>
                <th class="text-left">Texture Image</th>
                <th class="text-left">Texture Name</th>
                <th class="text-left">Type</th>
                <th class="text-left">Date</th>
                <th class="text-left">View</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(texture, index) in textureData" :key="index">
                <td>
                  <v-checkbox density="" color="#274E76"></v-checkbox>
                </td>
                <td>{{ index + 1 }}</td>
                <td>
                  <v-img src="/images/login.png" width="40px" class="hover"></v-img>
                </td>
                <td>{{ texture.texturename }}</td>
                <td>{{ texture.type }}</td>
                <td>{{ texture.date }}</td>
                <td>
                  <v-icon color="grey">mdi-eye-outline</v-icon>
                </td>
              </tr>
            </tbody>
          </v-table>
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
  </v-container>
</template>

<script>
export default {
  name: "glbModels",
  data() {
    return {
      showModels: true,
      models: [""],
      textureData: [
        {
          sno: 1,
          textureimage: "Image 1",
          modelname: "Door",
          type: "Bump",
          date: "2024-01-01",
        },
        {
          sno: 2,
          textureimage: "Image 2",
          texturename: "Window",
          type: "",
          date: "2024-02-01",
        },
        {
          sno: 3,
          textureimage: "Image 3",
          texturename: "Plant",
          type: "",
          date: "2024-03-01",
        },
        {
          sno: 4,
          textureimage: "Image 4",
          texturename: "Table",
          type: "",
          date: "2024-04-01",
        },
        {
          sno: 5,
          textureimage: "Image 5",
          texturename: "All",
          type: "",
          date: "2024-05-01",
        },
        {
          sno: 6,
          textureimage: "Image 6",
          texturename: "Cupboard",
          type: "",
          date: "2024-06-01",
        },
      ],
    };
  },
  methods: {
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
.hover:hover{
    transition: all ease-in .5s;
    transform: scale(4);
}
</style>
