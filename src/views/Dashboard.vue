<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    
    <!-- KPI Section -->
    <div class="kpi-section">
      <h2>Key Performance Indicators</h2>
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.id">
        <p class="kpi-name">{{ kpi.name }}</p>
        <p class="kpi-value">{{ kpi.value }}</p>
      </div>
    </div>

    <!-- Recent Tasks Section -->
    <div class="task-section">
      <h2>Recent Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Status</th>
            <th>Hours</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in recentTasks" :key="task.id">
            <td>{{ task.name }}</td>
            <td>{{ task.status }}</td>
            <td>{{ task.hours }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Reactive variables
const kpis = ref([]);
const recentTasks = ref([]);

// Fetch data when the component mounts
onMounted(async () => {
  try {
    // Fetch KPI data
    const kpiResponse = await axios.get("https://your-api-endpoint.com/kpis");
    kpis.value = kpiResponse.data;

    // Fetch recent tasks
    const taskResponse = await axios.get(
      "https://your-api-endpoint.com/tasks/recent"
    );
    recentTasks.value = taskResponse.data;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
});
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
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>
  