<template>
  <v-container fluid="true" class="py-0 px-0">
    <v-card-title class="text-h6">Employee</v-card-title>
    <v-row>
      <v-col>
        <v-card-text>Employee List</v-card-text>
      </v-col>
    </v-row>
    <v-data-table-virtual height="500px" :items="items" density="compact">
      <template v-slot:top>
        <v-row>
          <v-col cols="6">
            <v-text-field
              class="ml-2"
              variant="underlined"
              label="Search"
              clearable
              append-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col cols="5" class="text-end">
            <v-btn
              prepend-icon="mdi-plus"
              color="#274E76"
              @click="isDialog = true"
              >Add Users</v-btn
            >
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.action>
        <v-icon size="small"> mdi-delete </v-icon>
      </template>
    </v-data-table-virtual>
    <v-dialog width="600px" v-model="isDialog">
      <v-card class="pl-2 pr-2">
        <v-row class="d-flex align-center">
          <v-col>
            <v-card-title class="text-h6">Add User</v-card-title>
          </v-col>
          <v-col class="text-end">
            <v-icon @click="isDialog = false">mdi-alpha-x</v-icon>
          </v-col>
        </v-row>
        <v-divider class="mb-4"></v-divider>

        <v-form>
          <v-row class="py-0">
            <v-col class="d-flex align-center">
              <v-col cols="4"> <v-card-text>User Name</v-card-text> </v-col>
              <v-col class="py-0 px-0">
                <v-text-field
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
                <v-text-field
                  label="Role"
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="d-flex align-center">
              <v-col cols="4"> <v-card-text>Set Password</v-card-text> </v-col>
              <v-col class="py-0 px-0">
                <v-text-field
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
              <v-btn color="#274E76" prepend-icon="mdi-plus" block
                >Add User</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  name: "employeePage",
  data() {
    return {
      isDialog: false,
      items: [
        {
          userid: "",
          Name: "Ajeesh",
          Role: "Developer",
          status: "",
          action: true,
        },
        {
          userId: "",
          Name: "Ranjit",
          Role: "Developer",
          status: "",
          action: true,
        },
        {
          userid: "",
          Name: "Ajeesh",
          Role: "Developer",
          status: "",
          action: true,
        },
        {
          userId: "",
          Name: "Ranjit",
          Role: "Developer",
          status: "",
          action: true,
        },
        {
          userid: "",
          Name: "Ajeesh",
          Role: "Developer",
          status: "",
          action: true,
        },
      ],
    };
  },
};
</script>
