<template>
  <v-container style="color: #f7f8fa" fluid="true">
    <v-card-title class="text-black">User Details</v-card-title>
    <v-card class="d-flex" height="80vh" >
      <v-container class="elevation-1 py-0 px-0" fluid width="20%">
        <v-list>
          <v-spacer class="mt-4"></v-spacer>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :class="{ 'sidebar-active': selectedItem === item.text }"
            @click="sideBar(item.text)"
          >
            <v-list-item-title class="pl-5">{{ item.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-container>

      <!-- Main Content Area -->
      <v-container width="80%">
        <!-- Account Details -->
        <v-card-title class="mb-3">{{ selectedItem }}</v-card-title>

        <v-card class="py-4 pl-2 border " flat v-if="isprofile">
          <v-row class="d-flex align-center">
            <v-col cols="3">
              <v-img
                src="/images/profile.jpg"
                width="200px"
                class="hover"
              ></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title>Account Details</v-card-title>
              <v-card-subtitle class="mt-2">User Id : 123</v-card-subtitle>
              <v-card-subtitle class="mt-2"
                >User Name : S.M.Ajeesh</v-card-subtitle
              >
            </v-col>
          </v-row>
        </v-card>

        <!-- Personal Information -->
        <v-card class="mt-10 border py-4" flat v-if="isprofile">
          <v-card-title class="text-subtitle-1"
            >Personal Information</v-card-title
          >
          <v-row class="d-flex align-center py-4">
            <v-col cols="10">
              <v-card-subtitle class="my-2">User Name :</v-card-subtitle>
              <v-card-subtitle class="mb-2">Email Address:</v-card-subtitle>
              <v-card-subtitle>Role :</v-card-subtitle>
            </v-col>
            <v-col cols="2">
              <v-btn prepend-icon="mdi-pencil">Edit</v-btn>
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
export default {
  name: "profilePage",
  data() {
    return {
      items: [
        { text: "My Profile", icon: "mdi-account" },
        { text: "Change Password", icon: "mdi-lock" },
      ],
      isprofile: true,
      selectedItem: "My Profile",
    };
  },
  methods: {
    sideBar(selectedItem) {
      this.selectedItem = selectedItem;
      this.isprofile = selectedItem === "My Profile";
    },
  },
};
</script>

<style scoped>
.sidebar-active {
  color: #274e76;
  font-weight: bold;
  border-left: 2px solid #274e76;
}
</style>
