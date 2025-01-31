<template>
    <v-card>
      <!-- Confirmation Dialog for Delete -->
      <v-dialog v-model="confirmDeleteDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete this user? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Dialog for creating/updating users -->
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-form @submit.prevent="handleSaveUser">
            <v-card-title>{{ isUpdating ? "Update User" : "Add User" }}</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="userForm.name"
                label="User Name"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="userForm.email"
                label="Email"
                variant="outlined"
                required
                type="email"
              />
              <v-select
                v-model="userForm.department_id"
                label="Department"
                variant="outlined"
                :items="departments"
                item-value="id"
                item-title="name"
                required
              />
              <v-text-field
                v-model="userForm.role"
                label="Role"
                variant="outlined"
                required
              />
              <v-text-field
                v-model="userForm.password"
                label="Password"
                variant="outlined"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" @click="closeDialog">Cancel</v-btn>
              <v-btn
                :loading="isSubmitting"
                :disabled="isSubmitting"
                type="submit"
                color="primary"
              >
                {{ isUpdating ? "Update" : "Save" }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
  
      <!-- Data Table for user list -->
      <v-data-table
        :headers="headers"
        :items="users"
        item-value="id"
        class="elevation-1"
        :items-per-page="5"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="#14A814"
              prepend-icon="mdi-plus-circle"
              @click="onCreateClick"
            >
              New
            </v-btn>
          </v-toolbar>
        </template>
  
        <!-- Dynamic Index -->
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>
  
        <!-- User Name -->
        <template #item.name="{ item }">
          {{ item.name }}
        </template>
  
        <!-- User Email -->
        <template #item.email="{ item }">
          {{ item.email }}
        </template>
  
        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            color="blue"
            @click="onEditClick(item)"
            icon="mdi-pencil"
            variant="text"
          />
          <v-btn
            color="red"
            @click="promptDelete(item)"
            icon="mdi-delete"
            variant="text"
          />
        </template>
      </v-data-table>
    </v-card>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useUsersStore } from "@/stores/user"; 
  import { useDepartmentsStore } from "@/stores/department"; 

  // Dialog state
  const createDialog = ref(false);
  const confirmDeleteDialog = ref(false);
  const isUpdating = ref(false);
  const isSubmitting = ref(false);
  const isLoadingData = ref(true);
  
  // Initialize the store
  const usersStore = useUsersStore();
  const departmentStore = useDepartmentsStore();
  
  // User form for create/update
  const userForm = ref({
    id: null,
    name: null,
    email: null,
    role: null,
    department_id: null,
    password: null,
  });
  
  // Table headers definition
  const headers = [
    { title: "#", value: "index", align: "start" },
    { title: "Name", value: "name", align: "start" },
    { title: "Email", value: "email", align: "start" },
    { title: "Department", value: "department.name", align: "start" },
    { title: "Actions", value: "actions", align: "end", sortable: false },
  ];
  
  // Computed users list connected to the store
  const users = computed(() => usersStore.users);
  const departments = computed(() => departmentStore.departments);
  
  // Fetch users from the backend on component mount
  onMounted(async () => {
    try {
      await departmentStore.fetchDepartments();
      await usersStore.fetchUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      isLoadingData.value = false;
    }
  });
  
  // Open dialog to create a new user
  const onCreateClick = () => {
    resetUserForm();
    isUpdating.value = false;
    createDialog.value = true;
  };
  
  // Open dialog to edit an existing user
  const onEditClick = (user) => {
    userForm.value = { ...user };
    isUpdating.value = true;
    createDialog.value = true;
  };
  
  // Handle create/update submission
  const handleSaveUser = async () => {
    try {
      isSubmitting.value = true;
  
      if (isUpdating.value) {
        await usersStore.updateUser(userForm.value);
      } else {
        await usersStore.addUser({ ...userForm.value });
      }
      isSubmitting.value = false;
      createDialog()
    } catch (error) {
      console.error("Error saving user:", error);
    } 
    
  };
  
  // Close dialog and reset form
  const closeDialog = () => {
    createDialog.value = false;
    resetUserForm();
  };
  
  // Reset form state
  const resetUserForm = () => {
    userForm.value = {
      id: null,
      name: null,
      email: null,
      role: null,
      password: null,
      department_id: null
    };
  };
  
  // Prompt delete confirmation
  const userToDelete = ref(null);
  
  const promptDelete = (user) => {
    userToDelete.value = user;
    confirmDeleteDialog.value = true;
  };
  
  const confirmDelete = async () => {
    if (userToDelete.value) {
      try {
        await usersStore.removeUser(userToDelete.value.id);
        confirmDeleteDialog.value = false;
        userToDelete.value = null;
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Optional custom styling */
  </style>