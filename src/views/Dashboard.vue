<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>

    <!-- KPI Section -->
    <section class="kpi-section">
      <h2>Key Performance Indicators</h2>
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.id">
        <p class="kpi-name">{{ kpi.name }}</p>
        <p class="kpi-value">{{ kpi.value }}%</p>
        <p class="kpi-status">
          <v-chip :color="getKPIColor(kpi.value, kpi.expectedScore)" size="small">
            {{ getKPIStatus(kpi.value, kpi.expectedScore) }}
          </v-chip>
        </p>
        <p class="kpi-target">Target: {{ kpi.expectedScore }}%</p>
      </div>
    </section>

    <!-- Recent Tasks Section -->
    <section class="task-section">
      <h2>Recent Tasks</h2>
      <v-data-table :items="recentTasks" :headers="taskHeaders">
        <template v-slot:item.status="{ item }">
          <v-chip :color="getTaskStatusColor(item.status)" small>
            {{ item.status }}
          </v-chip>
        </template>
      </v-data-table>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDashboardStore } from '@/stores/dashboard';

// Initialize the dashboard store
const dashboardStore = useDashboardStore();

// Reactive state variables
const kpis = ref([]);
const recentTasks = ref([]);

// Table headers for recent tasks
const taskHeaders = [
  { title: 'Task Name', key: 'name' },
  { title: 'Status', key: 'status' },
  { title: 'Hours', key: 'hours' },
];

// Fetch data on component mount
onMounted(async () => {
  await dashboardStore.fetchDashboardData();
  kpis.value = dashboardStore.getKPIs;
  recentTasks.value = dashboardStore.getRecentTasks;
});

// Helper functions
const getKPIColor = (value, expected) => {
  if (value >= expected) return 'success';
  if (value >= expected * 0.8) return 'warning';
  return 'error';
};

const getKPIStatus = (value, expected) => {
  if (value >= expected) return 'Above Target';
  if (value >= expected * 0.8) return 'Near Target';
  return 'Below Target';
};

const getTaskStatusColor = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'warning';
    case 'Pending':
      return 'error';
    default:
      return 'info';
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.kpi-section,
.task-section {
  margin-bottom: 20px;
}

.kpi-card {
  display: inline-block;
  width: 200px;
  margin: 10px;
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  text-align: center;
}

.kpi-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.kpi-value {
  font-size: 1.5em;
  color: #007bff;
}

.kpi-status {
  margin: 5px 0;
}

.kpi-target {
  font-size: 0.9em;
  color: #666;
}
</style>