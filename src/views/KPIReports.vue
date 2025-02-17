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
              @update:modelValue="fetchKPIData"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.start"
              label="Start Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
              @change="fetchKPIData"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.end"
              label="End Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
              @change="fetchKPIData"
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
import axios from 'axios'
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

// KPI data from backend
const kpiData = ref([])
const completionRateData = ref({ labels: [], datasets: [] })
const taskDurationData = ref({ labels: [], datasets: [] })
const hoursWorkedData = ref({ labels: [], datasets: [] })

// Fetch KPI data from backend
const fetchKPIData = async () => {
  try {
    const params = {
      period: selectedPeriod.value,
      start: dateRange.value.start,
      end: dateRange.value.end
    }

    const response = await axios.get('/api/kpi-reports', { params })
    const data = response.data

    // Update KPI data
    kpiData.value = data.kpis

    // Update chart data
    completionRateData.value = {
      labels: data.chartLabels,
      datasets: [
        {
          label: 'Completion Rate',
          data: data.completionRates,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    }

    taskDurationData.value = {
      labels: data.chartLabels,
      datasets: [
        {
          label: 'Average Duration (hours)',
          data: data.taskDurations,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }
      ]
    }

    hoursWorkedData.value = {
      labels: data.chartLabels,
      datasets: [
        {
          label: 'Hours Worked',
          data: data.hoursWorked,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }
      ]
    }
  } catch (error) {
    console.error('Error fetching KPI data:', error)
  }
}

// Helper functions
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

// Lifecycle hooks
onMounted(() => {
  mounted.value = true
  fetchKPIData() // Fetch data on component mount
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