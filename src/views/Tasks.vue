<template>
  <v-card>
    <!-- Confirmation Dialog for Delete -->
    <v-dialog v-model="confirmDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="confirmDeleteDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="red" text @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for creating/updating tasks -->
    <v-dialog v-model="createDialog" width="400" >
      <v-card>
        <v-form @submit.prevent="handleSaveTask">
          <v-card-title>{{
            isUpdating ? "Update Task" : "Add Task"
          }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="taskForm.title"
              label="Task Name"
              variant="outlined"
              required
            />
            <v-select
            v-model="taskForm.assigned_to"
            label="Assign To"
            :items="users"
            item-title="name"
            variant="outlined"
            item-value="id"
            />
            <v-textarea label="Description" v-model="taskForm.description" variant="outlined">
            </v-textarea>
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

    <!-- Data Table for task list -->
    <v-data-table
      :headers="headers"
      :items="tasks"
      item-value="id"
      class="elevation-1"
      :items-per-page="5"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>Tasks</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn
            color="#14A814"
            prepend-icon="mdi-plus-circle"
            @click="onCreateClick"
          >
          </v-btn>
        </v-toolbar>
      </template>

      <!-- Dynamic Index -->
      <template #item.index="{ index }">
        {{ index + 1 }}
      </template>

      <!-- Task Name -->
      <template #item.name="{ item }">
        {{ item.name }}
      </template>

      <!-- Task Status -->
      <template #item.status="{ item }">
        <v-chip :color="item.completed ? 'green' : 'orange'" text>
          {{ item.completed ? "Completed" : "Pending" }}
        </v-chip>
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
import { useTasksStore } from "@/stores/task";

// Dialog state
const createDialog = ref(false);
const confirmDeleteDialog = ref(false);
const isUpdating = ref(false);
const isSubmitting = ref(false);
const isLoadingData = ref(true);

// Initialize the store
const tasksStore = useTasksStore();
const userStore = useUsersStore();

// Task form for create/update
const taskForm = ref({
  title: null,
  assigned_to: null,
  description: null,
  status: false,
});

// Table headers definition 
const headers = [
  { title: "#", value: "index", align: "start" },
  { title: "Title", value: "title", align: "start" },
  { title: "Assigned To", value: "assigned_to.name", align: "start" },
  { title: "Description", value: "description", align: "start" },
  { title: "Status", value: "status", align: "center" },
  { title: "Actions", value: "actions", align: "end", sortable: false },
];

// Users to be assigned a task
const users = computed(() => userStore.users);

// Computed tasks list connected to the store
const tasks = computed(() => tasksStore.tasks);

// Fetch tasks from the backend on component mount
onMounted(async () => {
  try {
    await userStore.fetchUsers();
    await tasksStore.fetchTasks();
  } catch (error) {
    console.error("Error fetching tasks:", error);
  } finally {
    isLoadingData.value = false;
  }
});

// Open dialog to create a new task
const onCreateClick = () => {
  resetTaskForm();
  isUpdating.value = false;
  createDialog.value = true;
};

// Open dialog to edit an existing task
const onEditClick = (task) => {
  taskForm.value = { ...task };
  isUpdating.value = true;
  createDialog.value = true;
};

// Handle create/update submission
const handleSaveTask = async () => {
 
  try {
    isSubmitting.value = true;

    if (isUpdating.value) {
      await tasksStore.updateTask(taskForm.value);
    } else {
      await tasksStore.addTask({ ...taskForm.value });
    }
    isSubmitting.value = false;
  } catch (error) {
  } finally {
    // isSubmitting.value = false;
    closeDialog();
  }
};

// Close dialog and reset form
const closeDialog = () => {
  createDialog.value = false;
  resetTaskForm();
};

// Reset form state
const resetTaskForm = () => {
  taskForm.value = {
    id: null,
    title: null,
    assigned_to: null,
    description: null,
    completed: false,
  };
};

// Prompt delete confirmation
const taskToDelete = ref(null);

const promptDelete = (task) => {
  taskToDelete.value = task;
  confirmDeleteDialog.value = true;
};

const confirmDelete = async () => {
  if (taskToDelete.value) {
    try {
      await tasksStore.removeTask(taskToDelete.value.id);
      confirmDeleteDialog.value = false;
      taskToDelete.value = null;
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }
};
</script>
  
  <style scoped>
/* Optional custom styling */
</style>
  