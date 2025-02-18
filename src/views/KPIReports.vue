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
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.start"
              label="Start Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
              @change="fetchKPIData"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="dateRange.end"
              label="End Date"
              type="date"
              :disabled="selectedPeriod !== 'custom'"
              @change="fetchKPIData"
            />
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
                    v-if="completionRateData.labels.length > 0"
                    :chart-data="completionRateData || []"
                    :options="chartOptions"
                  />
                </div>
              </v-window-item>
              <v-window-item value="duration">
                <div class="pa-4" style="height: 300px">
                  <line-chart
                    v-if="taskDurationData.labels.length > 0"
                    :chart-data="taskDurationData"
                    :options="chartOptions"
                  />
                </div>
              </v-window-item>
              <v-window-item value="hours">
                <div class="pa-4" style="height: 300px">
                  <line-chart
                    v-if="hoursWorkedData.labels.length > 0"
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
import { ref, computed, onMounted } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useKPIReportsStore } from '@/stores/Kpireports';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const store = useKPIReportsStore();
const activeTab = ref('completion');
const selectedPeriod = ref('week');
const timePeriods = ['day', 'week', 'month', 'quarter', 'custom'];
const dateRange = ref({ start: '', end: '' });

// Fetch KPI data on component mount
onMounted(() => {
  store.fetchKPIData();
});

// Computed properties for store data
const kpiData = computed(() => store.kpiData);
const completionRateData = computed(() => store.completionRateData);
const taskDurationData = computed(() => store.taskDurationData);
const hoursWorkedData = computed(() => store.hoursWorkedData);
const getKPIColor = (value, expected) => store.getKPIColor(value, expected);
const getKPIStatus = (value, expected) => store.getKPIStatus(value, expected);

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}
</style>