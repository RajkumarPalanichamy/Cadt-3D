<template>
  <v-container fluid class="d-flex px-0 py-0" height="100vh">
    <v-card width="70%" color="black" flat rounded="0">
      <v-card-title style="position: absolute; z-index: 2" class="text-white">
        <v-icon class="text-primary">mdi mdi-cube-outline</v-icon>
        Blue 3D</v-card-title
      >
      <v-img src="./images/login.png" cover height="100vh"></v-img>
    </v-card>
    <v-card width="30%" flat class="d-flex flex-column justify-center px-4">
      <v-form>
        <v-card-title class="pb-0 text-center">Welcome to Blue 3D</v-card-title>
        <v-card-subtitle class="text-center"
          >Your Admin Dashboard</v-card-subtitle
        >
        <v-card-text class="pb-0 font-weight-medium mb-1"
          >Username :</v-card-text
        >
        <v-text-field
          variant="outlined"
          density="compact"
          class="ml-3"
          append-inner-icon="mdi-account"
        ></v-text-field>
        <v-card-text class="pb-0 font-weight-medium mb-1"
          >Password :</v-card-text
        >

        <v-text-field
          v-model="password"
          density="compact"
          class="ml-3"
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          variant="outlined"
          :rules="[rules.required, rules.min]"
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
        ></v-text-field>
        <v-row>
          <v-col class="d-flex" cols="6">
            <v-checkbox></v-checkbox>
            <v-card-text class="ml-0 pl-0">Remember me </v-card-text>
          </v-col>
          <v-col class="text-end" cols="6">
            <v-card-text class="text-primary">Forgot Password ?</v-card-text>
          </v-col>
        </v-row>
        <v-btn @click="home" block color="#274E76">Login</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "loginPage",
  data() {
    return {
      show1: false,
      show2: true,
      password: "",
      rules: {
        required: (value) => !!value || "Required.",
        min: (v) => v.length >= 8 || "Min 8 characters",
        emailMatch: () => `The email and password you entered don't match`,
      },
    };
  },

  methods: {
    home() {
      this.$router.push("/homeview");
    },
  },
};
</script>
