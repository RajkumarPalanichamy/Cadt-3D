<template>
  <v-container :fluid="true">
    <v-row>
      <v-col md="7" sm="6" xs="6">
        <v-img
          src="./images/login.png"
          cover
          class="rounded-xl"
          height="95vh"
        ></v-img>
      </v-col>
      <v-col md="5" sm="6" xs="6" class="d-flex align-center justify-center">
        <v-card flat class="px-2">
          <v-row no-gutters>
            <v-col>
              <v-icon
                style="font-size: 70px"
                class="rotate-animation"
                color="#274E76"
                >mdi-cube-outline</v-icon
              >
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <v-card-title class="px-0 text-h5 font-weight-bold"
                >Get Started Now</v-card-title
              >
              <v-card-text class="px-0 text-subtitle-2 font-weight-medium"
                >Enter your credentials to access your account</v-card-text
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6" lg="6">
              <v-btn
                block
                class="font-weight-bolder border rounded-lg elevation-0"
              >
                <v-icon class="mr-2 text-orange">mdi-google</v-icon>
                <v-card-title class="text-body-2 font-weight-medium">
                  Log in with Google</v-card-title
                >
              </v-btn>
            </v-col>
            <v-col cols="12" md="6" lg="6">
              <v-btn class="border rounded-lg elevation-0" block>
                <v-icon class="mr-2 text-blue">mdi-facebook</v-icon>
                <v-card-title class="text-body-2 font-weight-medium">
                  Log in with Facebook</v-card-title
                >
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-subtitle class="text-no-wrap"
                >___________________________________________or___________________________________________</v-card-subtitle
              >
            </v-col>
          </v-row>
          <v-row class="d-flex flex-column py-6" no-gutters>
            <v-col>
              <v-form v-model="isForm">
                <v-card-text class="py-0 mb-2 text-subtitle-2 font-weight-bold">
                  Name
                </v-card-text>
                <v-text-field
                  v-model="username"
                  rounded="lg"
                  :rules="[rules.required]"
                  variant="outlined"
                  density="compact"
                  class="ml-3"
                >
                </v-text-field>
                <v-card-text class="py-0 mb-2 text-subtitle-2 font-weight-bold"
                  >Password
                </v-card-text>
                <v-text-field
                  v-model="password"
                  density="compact"
                  rounded="lg"
                  :rules="[rules.required]"
                  class="ml-3"
                  :append-inner-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  variant="outlined"
                  :type="show1 ? 'text' : 'password'"
                  @click:append-inner="show1 = !show1"
                >
                </v-text-field>
                <v-card-text class="text-red py-0" v-if="errMsg"
                  >* Data Doesn't Match</v-card-text
                >
              </v-form>
            </v-col>
            <v-col>
              <v-row class="d-flex align-center" no-gutters>
                <v-col class="d-flex">
                  <v-checkbox
                    v-model="remember"
                    label="Remember me"
                    density="compact"
                  ></v-checkbox>
                </v-col>
                <v-col class="py-0">
                  <v-dialog persistent fullscreen v-model="forgotPassword">
                    <template v-slot:activator="{ props: activatorProps }">
                      <v-card-text
                        v-bind="activatorProps"
                        @click="forgotPassword = true"
                        class="text-primary text-end px-0 font-weight-bold cursor-pointer"
                        >Forgot Password?</v-card-text
                      >
                    </template>
                    <template v-slot:default="{ isActive }">
                      <v-card class="d-flex align-center pt-16">
                        <v-icon style="font-size: 50px" color="blue"
                          >mdi-lock-reset</v-icon
                        >
                        <v-card
                          class="d-flex flex-column px-4 py-4"
                          flat
                          min-width="450px"
                        >
                          <v-card-title class="text-center"
                            >Forgot Password</v-card-title
                          >
                          <v-card-text class="text-center"
                            >No Worries , we'll send you reset
                            instruction</v-card-text
                          >
                          <v-card-text class="px-0 py-1"> Email</v-card-text>
                          <v-text-field
                            variant="outlined"
                            placeholder="Enter your Email"
                          >
                          </v-text-field>
                          <v-btn color="#1B3D56">Reset Password</v-btn>
                          <v-card-text
                            @click="forgotPassword = false"
                            class="text-center mt-2 cursor-pointer"
                          >
                            <v-icon>mdi-arrow-left</v-icon>
                            Back to Log in
                          </v-card-text>
                        </v-card>
                      </v-card>
                    </template>
                  </v-dialog>
                </v-col>
              </v-row>
            </v-col>
            <v-col>
              <v-btn
                :disabled="!isForm"
                @click="handleLogin"
                block
                class="py-5"
                color="#274E76"
                :loading="isLoading"
                >Login
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Cookies from "js-cookie";
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
      remember: null,
      isLoading: false,
      errMsg: false,
      forgotPassword: false,
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      if (this.username && this.password) {
        try {
          const response = await this.$axios.post(
            `${import.meta.env.VITE_API_LINK}/auth/login`,
            {
              username: this.username,
              password: this.password,
            }
          );

          if (response.status === 200) {
            const token = response.data.accessToken;
            if (token) {
              if (this.remember) {
                Cookies.set("jwtToken", token, { expires: 7 });
              } else {
                Cookies.set("jwtToken", token, { expires: 1 });
              }
              // await this.fetchUserFurnitures(token);
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
@keyframes rotateCube {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.font-600 {
  font-weight: 600;
}

.rotate-animation {
  animation: rotateCube 5s ease infinite;
}
</style>
