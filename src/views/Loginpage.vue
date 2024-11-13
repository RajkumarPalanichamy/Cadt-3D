<template>
  <v-container fluid class="d-flex px-0 py-0" height="100vh">
    <v-card width="70%" color="black" flat rounded="0">
      <v-card-title style="position: absolute; z-index: 2" class="text-white">
        <v-icon class="text-primary">mdi mdi-cube-outline</v-icon>
        Blue 3D
      </v-card-title>
      <v-img src="./images/login.png" cover height="100vh"></v-img>
    </v-card>
    <v-card width="30%" flat class="d-flex flex-column justify-center px-4">
      <v-form v-model="isForm">
        <v-card-title class="pb-0 text-center">Welcome to Blue 3D</v-card-title>
        <v-card-subtitle class="text-center"
          >Your Admin Dashboard</v-card-subtitle
        >
        <v-card-text class="pb-0 font-weight-medium mb-1"
          >Username :</v-card-text
        >
        <v-text-field
          v-model="username"
          :rules="[rules.required]"
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
          :rules="[rules.required]"
          class="ml-3"
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          variant="outlined"
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
        ></v-text-field>
        <v-card-text class="text-red py-0" v-if="errMsg"
          >* Data Doesn't Match</v-card-text
        >
        <v-row>
          <v-col class="d-flex" cols="6">
            <v-checkbox></v-checkbox>
            <v-card-text class="ml-0 pl-0">Remember me</v-card-text>
          </v-col>
          <v-col class="text-end" cols="6">
            <v-card-text class="text-primary">Forgot Password?</v-card-text>
          </v-col>
        </v-row>
        <v-btn
          :disabled="!isForm"
          @click="handleLogin"
          block
          color="#274E76"
          :loading="isLoading"
          >Login</v-btn
        >
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  name: "loginPage",
  data() {
    return {
      rules: {
        required: (value) => !!value || "Field is required",
      },
      show1: false,
      isForm: false,
      password: "",
      username: "",
      isLoading: false,
      errMsg: false,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      // this.errors.username = null;
      // this.errors.password = null;

      // if (!this.username) {
      //   this.errors.username = "Username is required.";
      // }
      // if (!this.password) {
      //   this.errors.password = "Password is required.";
      // }

      if (this.username && this.password) {
        try {
          const response = await axios.post("http://localhost:3000/login",{
              username: this.username,
              password: this.password,}
          );
          if (response.status === 200) {
            const token = response.data.accessToken;
            if (token) {
              Cookies.set("jwtToken", token, { expires: 7 });
              await this.fetchUserFurnitures(token);
              this.$router.push("/homeview");
            } else {
              this.errors.username =
                "Login failed. Please check your credentials.";
            }
          }
        } catch (error) {
          this.isLoading = false;
          setTimeout(() => {
            this.errMsg = false;
            this.username = null;
            this.password = null;
          }, 2000);
          this.errMsg = true;
          console.error("ERROR IN POST",error);
        }
      }
    },
    async fetchUserFurnitures(token) {
      try {
        const response = await axios.get("http://localhost:3000/furnitures", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Furniture data:", response.data);
      } catch (error) {
        console.error("Error fetching furniture data:", error);
      }
    },
  },
};
</script>
