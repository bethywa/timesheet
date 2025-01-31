<template>
  <v-container fluid>
    <!-- Welcome Section -->
    <div class="text-center my-6">
      <h1 class="text-h3 mb-4">Welcome to the Daily Timesheet App!</h1>
      <p class="text-body-1">
        Track your time, manage tasks, and analyze your productivity effortlessly.
      </p>
    </div>

    <!-- Quick Links Section -->
    <v-row justify="center" class="my-6">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-4" outlined>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="4" v-for="link in links" :key="link.name">
                <v-card class="pa-4 link-card" outlined @click="navigateTo(link.route)">
                  <v-card-title class="font-weight-bold">{{ link.title }}</v-card-title>
                  <v-card-text>{{ link.description }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity Section -->
    <h2 class="text-h5 mb-4 text-center">Recent Activity</h2>
    <v-list>
      <v-list-item-group>
        <v-list-item
          v-for="activity in recentActivities"
          :key="activity.id"
          class="activity-item"
        >
          <v-list-item-icon>
            <v-icon color="primary">mdi-clock-time-four</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ activity.title }}</v-list-item-title>
            <v-list-item-subtitle class="text-sm">{{ activity.date }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </v-list-item-group>
    </v-list>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Sample data for recent activities
const recentActivities = ref([
  { id: 1, title: 'Logged 8 hours on Project A', date: '2024-12-16' },
  { id: 2, title: 'Reviewed timesheet for last week', date: '2024-12-15' },
  { id: 3, title: 'Completed task: Fix UI bugs', date: '2024-12-14' },
]);

// Navigation function
const navigateTo = (path) => {
  router.push({ name: path });
};

// Links data for quick navigation
const links = ref([
  { title: 'Log Hours', description: 'Quickly add your work hours for today.', route: 'TimeEntries' },
  { title: 'View Timesheets', description: 'Check and edit your previous time entries.', route: 'Dashboard' },
  { title: 'Reports', description: 'Analyze your logged hours and tasks.', route: 'KPIReports' },
  { title: 'Manage Tasks', description: 'Track and manage your assigned tasks.', route: 'Tasks' },
]);
</script>

<style scoped>
/* Add styles for quick link cards */
.v-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.v-card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.text-center {
  text-align: center;
}

.my-6 {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

/* Quick link card styles */
.link-card {
  background-color: #f9f9f9; /* Light background for cards */
  border: 1px solid #ddd; /* Subtle border */
  border-radius: 8px; /* Rounded corners */
  transition: background-color 0.3s;
}

.link-card:hover {
  background-color: #e0f7fa; /* Change color on hover */
}

/* Recent Activity Styles */
.activity-item {
  padding: 16px;
  text-align: left; /* Left align activity text */
}

.v-list-item-icon {
  min-width: 40px; /* Adjust icon spacing */
}

.font-weight-bold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem; /* Smaller subtitle font */
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .v-card {
    margin-bottom: 1rem;
  }

  .activity-item {
    padding: 12px; /* Smaller padding for mobile */
  }
}
</style>