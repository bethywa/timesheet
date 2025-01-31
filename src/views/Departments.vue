<template>
    <v-card>
      <!-- Confirmation Dialog for Delete -->
      <v-dialog v-model="confirmDeleteDialog" max-width="400">
        <v-card>
          <v-card-title class="headline">Confirm Deletion</v-card-title>
          <v-card-text>
            Are you sure you want to delete this department? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDeleteDialog = false">Cancel</v-btn>
            <v-btn color="red" text @click="confirmDelete">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Dialog for creating/updating departments -->
      <v-dialog v-model="createDialog" width="400">
        <v-card>
          <v-form @submit.prevent="handleSaveDepartment">
            <v-card-title>{{ isUpdating ? "Update Department" : "Add Department" }}</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="departmentForm.name"
                label="Department Name"
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
  
      <!-- Data Table for department list -->
      <v-data-table
        :headers="headers"
        :items="departments"
        item-value="id"
        class="elevation-1"
        :items-per-page="5"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>Departments</v-toolbar-title>
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
  
        <!-- Department Name -->
        <template #item.name="{ item }">
          {{ item.name }}
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
  import { useDepartmentsStore } from "@/stores/department"; // Update the store path accordingly
  
  // Dialog state
  const createDialog = ref(false);
  const confirmDeleteDialog = ref(false);
  const isUpdating = ref(false);
  const isSubmitting = ref(false);
  const isLoadingData = ref(true);
  
  // Initialize the store
  const departmentsStore = useDepartmentsStore();
  
  // Department form for create/update
  const departmentForm = ref({
    id: null,
    name: "",
  });
  
  // Table headers definition
  const headers = [
    { title: "#", value: "index", align: "start" },
    { title: "Name", value: "name", align: "start" },
    { title: "Actions", value: "actions", align: "end", sortable: false },
  ];
  
  // Computed departments list connected to the store
  const departments = computed(() => departmentsStore.departments);
  
  // Fetch departments from the backend on component mount
  onMounted(async () => {
    try {
      await departmentsStore.fetchDepartments();
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      isLoadingData.value = false;
    }
  });
  
  // Open dialog to create a new department
  const onCreateClick = () => {
    resetDepartmentForm();
    isUpdating.value = false;
    createDialog.value = true;
  };
  
  // Open dialog to edit an existing department
  const onEditClick = (department) => {
    departmentForm.value = { ...department };
    isUpdating.value = true;
    createDialog.value = true;
  };
  
  // Handle create/update submission
  const handleSaveDepartment = async () => {
    try {
      isSubmitting.value = true;
  
      if (isUpdating.value) {
        await departmentsStore.updateDepartment(departmentForm.value);
      } else {
        await departmentsStore.addDepartment({ ...departmentForm.value });
      }
      isSubmitting.value = false;
    } catch (error) {
      console.error("Error saving department:", error);
    } finally {
      closeDialog();
    }
  };
  
  // Close dialog and reset form
  const closeDialog = () => {
    createDialog.value = false;
    resetDepartmentForm();
  };
  
  // Reset form state
  const resetDepartmentForm = () => {
    departmentForm.value = {
      id: null,
      name: "",
    };
  };
  
  // Prompt delete confirmation
  const departmentToDelete = ref(null);
  
  const promptDelete = (department) => {
    departmentToDelete.value = department;
    confirmDeleteDialog.value = true;
  };
  
  const confirmDelete = async () => {
    if (departmentToDelete.value) {
      try {
        await departmentsStore.removeDepartment(departmentToDelete.value.id);
        confirmDeleteDialog.value = false;
        departmentToDelete.value = null;
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    }
  };
  </script>
  
  <style scoped>
  /* Optional custom styling */
  </style>