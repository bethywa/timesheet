import { defineStore } from 'pinia';
import axios from 'axios';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    kpis: [], // Stores KPI data
    recentTasks: [], // Stores recent tasks
    loading: false, // Tracks loading state
    error: null, // Stores error messages
  }),
  actions: {
    // Fetch KPI data from the backend
    async fetchKPIData() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/kpi-reports');
        this.kpis = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch KPI data';
      } finally {
        this.loading = false;
      }
    },

    // Fetch recent tasks from the backend
    async fetchRecentTasks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('/api/tasks/recent');
        this.recentTasks = response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch recent tasks';
      } finally {
        this.loading = false;
      }
    },

    // Fetch all dashboard data (KPIs and recent tasks)
    async fetchDashboardData() {
      await this.fetchKPIData();
      await this.fetchRecentTasks();
    },
  },
  getters: {
    // Getter for KPI data
    getKPIs: (state) => state.kpis,

    // Getter for recent tasks
    getRecentTasks: (state) => state.recentTasks,

    // Getter for loading state
    isLoading: (state) => state.loading,

    // Getter for error
    getError: (state) => state.error,
  },
});