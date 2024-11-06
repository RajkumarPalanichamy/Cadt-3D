<template>
  <v-container class="py-0 px-0 ml-0 mr-0" fluid="true">
    <v-card class="d-flex" rounded="0" flat>
      <v-card-title
        @click="showModels = true"
        :class="['pointer text-subtitle-1', { active: showModels }]"
      >
        My Models
      </v-card-title>
      <v-card-title
        @click="showModels = false"
        :class="['pointer text-subtitle-1', { active: !showModels }]"
      >
        Upload Model
      </v-card-title>
    </v-card>

    <v-container class="mt-6">
      <v-card v-if="showModels" rounded="0" flat>
        <v-card v-if="models.length > 0">
          <v-card-text class="text-center">Models Available</v-card-text>
        </v-card>
        <v-card
          v-else
          class="d-flex flex-column align-center justify-center mt-16"
          height="500px"
        >
          <v-icon class="mt-5 text-h1 font-weight-regular" color="#274E76"
            >mdi-file-document-remove-outline</v-icon
          >
          <v-card-text class="mt-2" flat>No Models Available</v-card-text>
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
      models: [],
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

<style>
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
</style>
