import { defineStore } from 'pinia'
import axios from 'axios'

export const useKPIReportsStore = defineStore('kpireports', {
  state: () => ({
    kpiData: [], // Stores KPI data (e.g., Task Completion Rate, Average Task Duration, etc.)
    completionRateData: { labels: [], datasets: [] }, // Data for Task Completion Rate chart
    taskDurationData: { labels: [], datasets: [] }, // Data for Average Task Duration chart
    hoursWorkedData: { labels: [], datasets: [] }, // Data for Total Hours Worked chart
    selectedPeriod: 'week', // Default selected time period
    dateRange: { start: '', end: '' }, // Custom date range
    isLoading: false, // Loading state
    error: null // Error state
  }),

  actions: {
    // Fetch KPI data from the backend
    async fetchKPIData() {
      this.isLoading = true
      this.error = null

      try {
        const params = {
          period: this.selectedPeriod,
          start: this.dateRange.start,
          end: this.dateRange.end
        }

        const response = await axios.get('/api/kpi-reports', { params })
        const data = response.data

        // Update KPI data
        this.kpiData = data.kpis

        // Update chart data
        this.completionRateData = {
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

        this.taskDurationData = {
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

        this.hoursWorkedData = {
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
        this.error = error.message || 'Failed to fetch KPI data'
        console.error('Error fetching KPI data:', error)
      } finally {
        this.isLoading = false
      }
    },

    // Update the selected time period and fetch data
    setSelectedPeriod(period) {
      this.selectedPeriod = period
      this.fetchKPIData()
    },

    // Update the custom date range and fetch data
    setDateRange(start, end) {
      this.dateRange.start = start
      this.dateRange.end = end
      this.fetchKPIData()
    }
  },

  getters: {
    // Get KPI color based on value and expected score
    getKPIColor: (state) => (value, expected) => {
      if (value >= expected) return 'success'
      if (value >= expected * 0.8) return 'warning'
      return 'error'
    },

    // Get KPI status based on value and expected score
    getKPIStatus: (state) => (value, expected) => {
      if (value >= expected) return 'Above Target'
      if (value >= expected * 0.8) return 'Near Target'
      return 'Below Target'
    }
  }
})