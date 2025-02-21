<template>
  <v-container
    :fluid="true"
    class="px-6 py-8"
    height="100vh"
    style="background-color: #f2f2f2"
  >
    <v-card class="d-flex border rounded-xl" flat>
      <!-- sidebar -->
      <v-container
        class="elevation1 py-0 px-0 border"
        :fluid="true"
        width="20%"
        height="91vh"
      >
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :class="{ 'active-sidebar-item': activeItem === item.text }"
            @click="setActiveItem(item.text)"
            class="text-center mb-2 sidebar "
          >
            <template #prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>

      <!-- Main Content Area -->
      <v-container width="100%" class="px-4 py-4" :fluid="true">
        <v-card flat class="d-flex align-center" v-if="isprofile">
          <v-sheet class="d-flex flex-column align-center">
            <v-card-subtitle class="text-subtitle-1"
              >Profile Picture</v-card-subtitle
            >
            <v-img
              src="/images/Dp.jpg"
              width="200px"
              class="hover"
              style="border-radius: 50%"
            ></v-img>
          </v-sheet>
          <v-sheet class="text-end" width="80%">
            <v-btn
              prepend-icon="mdi-pencil"
              color="#11324B"
              @click="editDetails"
            >
              Edit Profile
            </v-btn>
          </v-sheet>
          <!-- <v-sheet>
            <v-card-title class="mb-2 text-capitalize">{{ lastUserData?.name }}</v-card-title>
            <v-card-subtitle class="mb-2 text-capitalize">{{
              lastUserData?.role
            }}</v-card-subtitle>

            <v-card-subtitle class="mb-2">{{
              lastUserData?.id
            }}</v-card-subtitle>
          </v-sheet> -->
        </v-card>

        <!-- Personal Information -->
        <v-card class="py-6 px-10" flat v-if="isprofile">
          <v-row>
            <v-col cols="5">
              <v-card-subtitle class="mb-2 px-0 text-subtitle-2 text-black"
                >User Id</v-card-subtitle
              >
              <v-text-field
                disabled="isDisabled"
                v-model="lastUserData.id"
                variant="outlined"
                :density="compact"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-card-subtitle class="mb-2 px-0 text-subtitle-2 text-black"
                >User Name</v-card-subtitle
              >
              <v-text-field
                :disabled="isDisabled"
                variant="outlined"
                density="compact"
                v-model="lastUserData.name"
              ></v-text-field>
            </v-col>
            <v-col cols="5">
              <v-card-subtitle class="mb-2 px-0 text-subtitle-2 text-black"
                >User Role</v-card-subtitle
              >
              <v-text-field
                disabled="isDisabled"
                v-model="lastUserData.role"
                variant="outlined"
                density="compact"
                rounded="lg"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="d-flex align-center">
            <v-col cols="10">
              <v-card-subtitle class="mb-2 px-0 text-subtitle-2 text-black"
                >Email</v-card-subtitle
              >
              <v-text-field
                :disabled="isDisabled"
                v-model="lastUserData.email"
                variant="outlined"
                density="compact"
                rounded="lg"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn :disabled="enableSaveBtn" color="#1A3A52"
                >Save Changes</v-btn
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
              <v-btn variant="outlined" class="linear-gradient">Confirm</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
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
      activeItem: "My Profile",
      isprofile: true,
      lastUserData: {},
      isDisabled: true,
      enableSaveBtn: true,
    };
  },
  methods: {
    setActiveItem(itemText) {
      this.activeItem = itemText;
      this.sideBar(itemText);
    },
    sideBar(selectedItem) {
      this.selectedItem = selectedItem;
      this.isprofile = selectedItem === "My Profile";
    },
    editDetails() {
      this.isDisabled = false;
    },
  },
  async mounted() {
    const data = Cookies.get("jwtToken");
    const decodedToken = VueJwtDecode.decode(data);
    
    const response = await this.$axios.get(
      `${import.meta.env.VITE_API_LINK}/auth/getclients`
    );
    response.data.forEach((eachUser) => {
      if (decodedToken.name === eachUser.username) {
        this.lastUserData = {
          name: eachUser.username,
          role: eachUser.role,
          id: eachUser._id,
          email: eachUser.email ?? "N/A",
        };
      }
    });
  },
  watch: {
    "lastUserData.name": function (newVal, oldVal) {
      this.enableSaveBtn = false;
    },
    "lastUserData.email": function (newVal, oldVal) {},
  },
};
</script>

<style scoped>
.linear-gradient {
  color: white;
  background: linear-gradient(90deg, #0c2539, #1d4f72, #0c2539);
}
.active-sidebar-item {
  border-left: 4px solid #1a3b53;
}
.sidebar:hover {
  color: #1a3b53;
}
</style>
