<template>
  <div>
    <h2 class="text-h4 mb-6">KPI Reports</h2>

    <!-- Date Range Selector -->
    <v-card class="mb-6">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="selectedPeriod"
              :items="timePeriods"
              label="Time Period"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.start"
              label="Start Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.end"
              label="End Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- KPI Overview -->
    <v-row>
      <v-col cols="12" md="4" v-for="kpi in kpiData" :key="kpi.name">
        <v-card>
          <v-card-text class="text-center">
            <div class="text-h6 mb-2">{{ kpi.name }}</div>
            <v-progress-circular
              :model-value="kpi.value"
              :color="getKPIColor(kpi.value, kpi.expectedScore)"
              size="92"
            >
              {{ kpi.value }}%
            </v-progress-circular>
            <div class="mt-2">
              <v-chip
                :color="getKPIColor(kpi.value, kpi.expectedScore)"
                size="small"
              >
                {{ getKPIStatus(kpi.value, kpi.expectedScore) }}
              </v-chip>
            </div>
            <div class="mt-2 text-caption">
              Target: {{ kpi.expectedScore }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Detailed KPI Charts -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>KPI Trends</v-card-title>
          <v-card-text>
            <v-tabs v-model="activeTab">
              <v-tab value="completion">Task Completion Rate</v-tab>
              <v-tab value="duration">Average Task Duration</v-tab>
              <v-tab value="hours">Total Hours Worked</v-tab>
            </v-tabs>
            <v-window v-model="activeTab">
              <v-window-item value="completion">
                <div class="pa-4" style="height: 300px">
                  <line-chart
                    v-if="mounted"
                    :chart-data="completionRateData"
                    :options="chartOptions"
                  />
                </div>
              </v-window-item>
              <v-window-item value="duration">
                <div class="pa-4" style="height: 300px">
                  <line-chart
                    v-if="mounted"
                    :chart-data="taskDurationData"
                    :options="chartOptions"
                  />
                </div>
              </v-window-item>
              <v-window-item value="hours">
                <div class="pa-4" style="height: 300px">
                  <line-chart
                    v-if="mounted"
                    :chart-data="hoursWorkedData"
                    :options="chartOptions"
                  />
                </div>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const mounted = ref(false)
const activeTab = ref('completion')
const selectedPeriod = ref('week')
const timePeriods = ['day', 'week', 'month', 'quarter', 'custom']
const dateRange = ref({
  start: '',
  end: ''
})

// Sample KPI data
const kpiData = ref([
  {
    name: 'Task Completion Rate',
    value: 85,
    expectedScore: 90,
    trend: 'up'
  },
  {
    name: 'Average Task Duration',
    value: 75,
    expectedScore: 80,
    trend: 'down'
  },
  {
    name: 'Total Hours Worked',
    value: 95,
    expectedScore: 90,
    trend: 'up'
  }
])

const getKPIColor = (value, expected) => {
  if (value >= expected) return 'success'
  if (value >= expected * 0.8) return 'warning'
  return 'error'
}

const getKPIStatus = (value, expected) => {
  if (value >= expected) return 'Above Target'
  if (value >= expected * 0.8) return 'Near Target'
  return 'Below Target'
}

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// Sample chart data
const completionRateData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Completion Rate',
      data: [75, 80, 85, 90, 85],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
}

const taskDurationData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Average Duration (hours)',
      data: [4, 3.5, 4.2, 3.8, 3.6],
      borderColor: 'rgb(255, 99, 132)',
      tension: 0.1
    }
  ]
}

const hoursWorkedData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Hours Worked',
      data: [8, 7.5, 8.2, 8.5, 7.8],
      borderColor: 'rgb(54, 162, 235)',
      tension: 0.1
    }
  ]
}

// Lifecycle hooks
onMounted(() => {
  mounted.value = true
})

onBeforeUnmount(() => {
  mounted.value = false
})
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>
