<template>
  <div class="time-entries-container">
    <h1>Time Entries</h1>

    <!-- Time Entry Form -->
    <v-form @submit.prevent="addTimeEntry" v-model="valid">
      <v-text-field
        v-model="editedItem.user_id"
        label="User ID"
        placeholder="Enter user ID"
        :rules="[rules.required]"
        outlined
      />
      <v-text-field
        v-model="editedItem.task_id"
        label="Task ID"
        placeholder="Enter task ID"
        :rules="[rules.required]"
        outlined
      />
      <v-text-field
        v-model="editedItem.start_time"
        label="Start Time"
        placeholder="Enter start time (YYYY-MM-DD HH:mm)"
        :rules="[rules.required]"
        outlined
      />
      <v-text-field
        v-model="editedItem.end_time"
        label="End Time"
        placeholder="Enter end time (YYYY-MM-DD HH:mm)"
        :rules="[rules.required]"
        outlined
      />
      <v-text-field
        v-model="editedItem.duration"
        label="Duration (in hours)"
        placeholder="Enter duration"
        type="number"
        :rules="[rules.required, rules.numeric]"
        outlined
      />
      <v-btn :disabled="!valid" color="primary" type="submit">Add Entry</v-btn>
    </v-form>

    <!-- Time Entries Table -->
    <v-container>
      <v-data-table :headers="headers" :items="timeEntries">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Logged Entries</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ props }">
                <v-btn class="mb-2" color="primary" dark v-bind="props">
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.user_id"
                          label="User ID"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.task_id"
                          label="Task ID"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.start_time"
                          label="Start Time"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.end_time"
                          label="End Time"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4" sm="6">
                        <v-text-field
                          v-model="editedItem.duration"
                          label="Duration (in hours)"
                          type="number"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon class="me-2" size="small" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:no-data>
          <p>No data available</p>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useTimeEntriesStore } from "@/stores/timeEntries"; // Import the store

// Initialize the store
const timeEntriesStore = useTimeEntriesStore();

// Reactive variables
const valid = ref(false);
const dialog = ref(false);
const dialogDelete = ref(false);
const editedIndex = ref(-1);
const editedItem = ref({
  user_id: null,
  task_id: null,
  start_time: null,
  end_time: null,
  duration: null,
});
const defaultItem = ref({
  user_id: null,
  task_id: null,
  start_time: null,
  end_time: null,
  duration: null,
});
const headers = ref([
  { title: "ID", key: "id" },
  { title: "User ID", key: "user_id" },
  { title: "Task ID", key: "task_id" },
  { title: "Start Time", key: "start_time" },
  { title: "End Time", key: "end_time" },
  { title: "Duration", key: "duration" },
  { title: "Actions", key: "actions", sortable: false },
]);

// Fetch time entries on component mount
onMounted(async () => {
  await timeEntriesStore.fetchTimeEntries();
});

// Get time entries from the store
const timeEntries = computed(() => timeEntriesStore.getAllTimeEntries);

// Validation rules
const rules = {
  required: (value) => !!value || "Field is required.",
  numeric: (value) => /^[0-9]+$/.test(value) || "Must be a numeric value.",
};

// Add a new time entry
const addTimeEntry = async () => {
  if (valid.value) {
    await timeEntriesStore.addTimeEntry(editedItem.value);
    editedItem.value = { ...defaultItem.value }; // Reset form
  }
};

// Edit a time entry
const editItem = (item) => {
  editedIndex.value = timeEntries.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

// Delete a time entry
const deleteItem = (item) => {
  editedIndex.value = timeEntries.value.indexOf(item);
  editedItem.value = { ...item };
  dialogDelete.value = true;
};

// Confirm deletion
const deleteItemConfirm = async () => {
  await timeEntriesStore.removeTimeEntry(editedItem.value.id);
  closeDelete();
};

// Close the dialog
const close = () => {
  dialog.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

// Close the delete dialog
const closeDelete = () => {
  dialogDelete.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
};

// Save changes (add or update)
const save = async () => {
  if (editedIndex.value > -1) {
    await timeEntriesStore.updateTimeEntry(editedItem.value);
  } else {
    await timeEntriesStore.addTimeEntry(editedItem.value);
  }
  close();
};

// Form title
const formTitle = computed(() => {
  return editedIndex.value === -1 ? "New Item" : "Edit Item";
});
</script>

<style scoped>
.time-entries-container {
  padding: 20px;
}

v-btn {
  margin-top: 10px;
}
</style>