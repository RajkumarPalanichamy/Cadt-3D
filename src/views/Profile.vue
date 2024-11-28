<template>
  <v-container style="color: #f7f8fa" :fluid="true" class="px-0 py-0">
    <v-card class="d-flex" height="100vh">
      <!-- sidebar -->
      <v-container class="elevation-1 py-0 px-0" :fluid="true" width="100px">
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            color="primary"
            @click="sideBar(item.text)"
            class="text-center mt-2 px-0"
          >
            <v-icon :icon="item.icon"></v-icon>
            <v-list-item-title class="break-word">{{
              item.text
            }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>
      <!-- Main Content Area -->
      <v-container width="100%" class="py-0 px- 0" :fluid="true">
        <v-toolbar density="compact" color="white">
          <v-card-title class="mb-3">{{ selectedItem }}</v-card-title>
        </v-toolbar>
        <!-- Account Details -->
        <v-card class="py-4 pl-2 mt-6 d-flex align-center elevation-2"  v-if="isprofile">
          <v-sheet  >
            <v-img
              src="/images/Dp.jpg"
              width="200px"
              class="hover"
            ></v-img>
          </v-sheet>
          <v-sheet>
            <v-card-title class="mb-2">Account Details</v-card-title>
             <v-card-subtitle class="mt-4"
            >User Id : {{ lastUserData?.id }}</v-card-subtitle
          >
          <v-card-subtitle class="mt-4"
            >User Name : {{ lastUserData?.name }}</v-card-subtitle
          >
            

          </v-sheet>

         
        </v-card>
        <!-- Edit dialog -->
        <v-dialog
          fullscreen
          transition="dialog-bottom-transition"
          v-model="isEdit"
        >
          <v-card>
            <v-toolbar density="compact" color="#274E76" class="px-2">
              <v-icon @click="isEdit = false">mdi-close</v-icon>
              <v-card-text>Edit</v-card-text>
            </v-toolbar>
            <v-container class="px-0 py-0 d-flex" :fluid="true" width="100%">
              <v-sheet class="mr-4">
                <v-img src="/images/login.png" width="300px"></v-img>
              </v-sheet>
              <v-card width="80%" flat class="mr-4">
                <v-form>
                  <v-text-field
                    variant="underlined"
                    label="Name"
                  ></v-text-field>
                  <v-text-field
                    variant="underlined"
                    label="Email"
                  ></v-text-field>
                  <v-text-field
                    variant="underlined"
                    label="Role"
                    disabled
                  ></v-text-field>
                </v-form>
              </v-card>
            </v-container>
            <v-divider></v-divider>
          </v-card>
        </v-dialog>
        <!-- Personal Information -->
        <v-card class="mt-10 border py-4" flat v-if="isprofile">
          <v-card-title class="text-subtitle-1"
            >Personal Information</v-card-title
          >
          <v-row class="d-flex align-center py-2 px-4">
            <v-col cols="10">
              <v-card-subtitle class="my-4"
                >User Name :{{ lastUserData.name }}</v-card-subtitle
              >
              <v-card-subtitle class="mb-4">Email Address:</v-card-subtitle>
              <v-card-subtitle>Role :{{ lastUserData?.role }}</v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-btn
                prepend-icon="mdi-pencil"
                block
                color="#274E76"
                @click="isEdit = true"
                >Edit</v-btn
              >
            </v-col>
          </v-row>
        </v-card>

        <!-- Change Password -->
        <v-card class="mt-4" flat v-else>
          <v-row>
            <v-col cols="5">
              <v-card-text>Old Password</v-card-text>
              <v-text-field variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-card-text>New Password</v-card-text>
              <v-text-field variant="outlined" density="compact"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <v-col cols="5">
              <v-card-text>Confirm New Password</v-card-text>
              <v-text-field variant="outlined" density="compact"></v-text-field>
            </v-col>
            <v-col class="mt-8">
              <v-btn variant="outlined">Confirm</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import Cookies from "js-cookie";
export default {
  name: "profilePage",
  data() {
    return {
      items: [
        { text: "My Profile", icon: "mdi-account" },
        { text: "Change Password", icon: "mdi-lock" },
      ],
      isEdit: false,
      isprofile: true,
      selectedItem: "My Profile",
      lastUserData: {},
    };
  },
  methods: {
    sideBar(selectedItem) {
      this.selectedItem = selectedItem;
      this.isprofile = selectedItem === "My Profile";
    },
  },
  async mounted() {
    // getting logined user data from cookies
    const data = Cookies.get("jwtToken");
    const decodedToken = VueJwtDecode.decode(data);
    // getting all the user data from the database
    const response = await axios.get(
      `${import.meta.env.VITE_API_LINK}/auth/getclients`
    );
    response.data.forEach((eachUser) => {
      if (decodedToken.name === eachUser.username) {
        this.lastUserData = {
          name: eachUser.username,
          role: eachUser.role,
          id: eachUser._id,
        };
      }
    });
  },
};
</script>

<style scoped>
.sidebar-active {
  color: #274e76;
  font-weight: bold;
  border-left: 2px solid #274e76;
}
.break-word {
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  font-size: 10px;
}
</style>
