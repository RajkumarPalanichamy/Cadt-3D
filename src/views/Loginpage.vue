<template>
  <v-container :fluid="true" class="d-flex px-4 py-4" height="100vh">
    <v-card width="60%" flat rounded="0">
      <v-card-title
        style="position: absolute; z-index: 2; top: 10px"
        class="text-white"
      >
      </v-card-title>
      <v-img
        src="./images/login.png"
        cover
        height="100vh"
        style="border-radius: 20px"
      ></v-img>
    </v-card>
    <v-card width="40%" flat class="d-flex flex-column px-6">
      <v-sheet class="mb-3">
        <v-icon style="font-size: 100px" class="mb-6" color="#274E76"
          >mdi-cube-outline</v-icon
        >
        <v-card-title class="px-0">Get Started Now</v-card-title>
        <v-card-text class="px-0 mt-2"
          >Enter your credentials to access your account</v-card-text
        >
      </v-sheet>
      <v-sheet>
        <v-row>
          <v-col>
            <v-btn variant="outlined" block class="font-weight-bold btn-class">
              <v-icon class="mr-2 text-orange">mdi-google</v-icon>
              Log in with Google
            </v-btn></v-col
          >
          <v-col>
            <v-btn variant="outlined" block>
              <v-icon class="mr-2 text-blue">mdi-facebook</v-icon>
              Log in with Facebook
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>

      <v-sheet class="d-flex align-center justify-center mt-8">
        <v-card-subtitle class="px-0">
          _________________________________</v-card-subtitle
        >
        <v-card-text class="text-center">OR</v-card-text>
        <v-card-subtitle>_________________________________</v-card-subtitle>
      </v-sheet>

      <v-form v-model="isForm" class="mt-8">
        <v-text-field
          v-model="username"
          label="Username"
          :rules="[rules.required]"
          variant="outlined"
          density="compact"
          class="ml-3"
        >
        </v-text-field>

        <v-text-field
          v-model="password"
          label="password"
          density="compact"
          :rules="[rules.required]"
          class="ml-3 mt-5 "
          :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          variant="outlined"
          :type="show1 ? 'text' : 'password'"
          @click:append-inner="show1 = !show1"
        >
        </v-text-field>
        <v-card-text class="text-red py-0" v-if="errMsg"
          >* Data Doesn't Match</v-card-text
        >
        <!-- <v-sheet>
          <v-row class="d-flex "> -->
            <!-- <v-col class="d-flexpx-0 py-0" cols="6">
              <v-checkbox ></v-checkbox>
              <v-card-text class="ml-0 ">Remember me</v-card-text>
            </v-col> -->
            <!-- <v-col class="text-end px-0 pt-0" cols="12"> -->
            <!-- </v-col>
          </v-row>
        </v-sheet> -->
        <v-card-text class="text-primary text-end px-0 py-0 mb-4">Forgot Password?</v-card-text>


        <v-btn
          :disabled="!isForm"
          @click="handleLogin"
          block
          class="py-5"
          color="#274E76"
          :loading="isLoading"
          >Login
        </v-btn>
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
      if (this.username && this.password) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_LINK}/auth/login`,
            {
              username: this.username,
              password: this.password,
            }
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
          console.error("ERROR IN POST", error);
        }
      }
    },
    async fetchUserFurnitures(token) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_LINK}/furniture/furnitures`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Furniture data:", response.data);
      } catch (error) {
        console.error("Error fetching furniture data:", error);
      }
    },
  },
  mounted() {
    const cookies = Cookies.get("jwtToken");
    if (cookies) {
      this.$router.push("homeview/home");
    }
  },
};
</script>

<style scoped>
.btn-class {
  font-weight: 900 !important;
}
</style>
