<template>
  <v-card>
    <v-card flat>
      <v-toolbar density="compact" color="#274e76" flat>
        <v-icon @click="back" size="1.5em">mdi-chevron-left </v-icon>

        <v-card-text>
          <v-icon>mdi mdi-cube</v-icon>
          BLUE 3D</v-card-text
        >

        <v-spacer></v-spacer>
        <v-card-text>Door</v-card-text>
      </v-toolbar>
    </v-card>
    <v-card class="d-flex" height="100vh">
      <!-- Scene Container -->
      <v-card width="70%">
        <ThreeScene />
      </v-card>
      <v-card width="30%">
        <v-card-subtitle>Properties</v-card-subtitle>
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
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>
