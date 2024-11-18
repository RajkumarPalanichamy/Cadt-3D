<template>
  <v-container :fluid="true" class="py-0 px-0">
    <v-data-table-virtual
      class="mt-2"
      height="500px"
      :items="filteredUsers"
      density="compact"
      :loading="isLoading"
    >
      <template v-slot:top>
        <v-row>
          <v-col cols="6">
            <v-text-field
              class="ml-2"
              variant="underlined"
              label="Search By Name"
              v-model="searchText"
              clearable
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="5" class="text-end">
            <v-btn
              prepend-icon="mdi-plus"
              color="#274E76"
              @click="isDialog = true"
              >Add Users</v-btn
            >
          </v-col> -->
        </v-row>
        <v-row
          @click="isUpload = true"
          style="position: absolute; bottom: 50px; right: 80px"
        >
          <v-col>
            <v-btn
              @click="isDialog = true"
              size="x-large"
              icon="mdi-plus"
              color="#274E76"
            ></v-btn>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.SNO="{ index }">
        {{ index + 1 }}
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon size="small" @click="deleteAlert(item['User Id'])">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table-virtual>
    <v-dialog width="600px" v-model="isDialog">
      <v-card class="pl-2 pr-2">
        <v-row class="d-flex align-center">
          <v-col>
            <v-card-title class="text-h6">Add User</v-card-title>
          </v-col>
          <v-col class="text-end">
            <v-icon @click="isDialog = false">mdi-close</v-icon>
          </v-col>
        </v-row>
        <v-divider class="mb-4"></v-divider>

        <v-form>
          <v-row class="py-0">
            <v-col class="d-flex align-center">
              <v-col cols="4"> <v-card-text>User Name</v-card-text> </v-col>
              <v-col class="py-0 px-0">
                <v-text-field
                  v-model="username"
                  density="compact"
                  variant="outlined"
                  label="Name"
                ></v-text-field>
              </v-col>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="d-flex align-center">
              <v-col cols="4"> <v-card-text>User Role</v-card-text> </v-col>
              <v-col class="py-0 px-0">
                <v-select
                  v-model="role"
                  label="Role"
                  density="compact"
                  variant="outlined"
                  :items="['user', 'admin']"
                ></v-select>
              </v-col>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="d-flex align-center">
              <v-col cols="4"> <v-card-text>Set Password</v-card-text> </v-col>
              <v-col class="py-0 px-0">
                <v-text-field
                  v-model="password"
                  label="Set Password"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-col>
          </v-row>
          <v-divider class="mb-4"></v-divider>
          <v-row>
            <v-col>
              <v-btn
                block
                color="#274E76"
                variant="outlined"
                @click="isDialog = false"
                >Cancel</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                color="#274E76"
                prepend-icon="mdi-plus"
                block
                @click="addUser"
                >Add User</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- Success Dialogi -->
    <v-dialog v-model="isSuccess" max-width="450">
      <v-card class="text-center">
        <v-card-title>Success</v-card-title>
        <v-row class="icon mt-4">
          <v-col> <v-icon size="2em" color="white">mdi-check</v-icon> </v-col>
        </v-row>
        <v-card-text class="mt-4">
          User Data added successfully to the data base.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Back" @click="isSuccess = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- delete confirm dialog -->
    <v-dialog v-model="isDelete" max-width="450px">
      <v-card title="Are You Sure ?" class="text-center">
        <v-row class="icon mt-4" style="background-color: red">
          <v-col>
            <v-icon size="2em" color="white">mdi-delete-alert-outline</v-icon>
          </v-col>
        </v-row>
        <v-card-text class="mt-4">
          Are you sure , you want to delete this user from your database
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Confirm Delete" @click="deleteUser()"></v-btn>

          <v-btn text="Close" @click="isDelete = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import axios from "axios";
export default {
  name: "employeePage",
  data() {
    return {
      isLoading: false,
      isDialog: false,
      userDetails: [],
      username: "",
      password: "",
      role: "",
      isSuccess: false,
      isDelete: false,
      userId: null,
      searchText: "",
    };
  },
  methods: {
    async getUserDetails() {
      this.userDetails = [];
      try {
        this.isLoading = true;
        const user = await axios.get(
          `${import.meta.env.VITE_API_LINK}/clients`
        );
        if (user.status == "200") {
          this.isLoading = false;
          user.data.forEach((eachUser) => {
            if (eachUser.role == "user") {
              const displayObject = {
                SNO: true,
                "User Id": eachUser._id,
                "User Name": eachUser.username,
                Role: eachUser.role,
                action: true,
              };
              this.userDetails.push(displayObject);
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    },
    async addUser() {
      const newUserDetails = {
        username: this.username,
        password: this.password,
        role: this.role,
      };
      try {
        this.isDialog = false;
        const user = await axios.post(
          `${import.meta.env.VITE_API_LINK}/register`,
          newUserDetails
        );
        if (user.status == "200") {
          (this.isSuccess = true), this.getUserDetails();
        }
      } catch (err) {
        console.log(err);
      }
    },
    deleteAlert(id) {
      this.isDelete = true;
      this.userId = id;
    },
    async deleteUser() {
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_LINK}/clients/${this.userId}`
        );

        if (response.status == "200") {
          this.getUserDetails();
          this.isDelete = false;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  computed: {
    filteredUsers() {
      if (!this.searchText) return this.userDetails;
      const lowerSearchText = this.searchText.toLowerCase();
      return this.userDetails.filter((user) =>
        user["User Name"].toLowerCase().includes(lowerSearchText)
      );
    },
  },
  mounted() {
    this.getUserDetails();
  },
};
</script>

<style scoped>
.icon {
  background-color: green;
  width: fit-content;
  border-radius: 50%;
  position: relative;
  left: 200px;
}
</style>
