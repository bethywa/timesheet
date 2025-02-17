import { defineStore } from "pinia";
import axios from "axios";
import apiService from "@/services/apiService";

// Base URL for your backend API
const API_URL = "http://192.168.73.62:8080/api/timeEntries"; // Replace with your actual time entries API endpoint

export const useTimeEntriesStore = defineStore("timeEntries", {
  state: () => ({
    timeEntries: [], // State to store fetched time entries
    loading: false, // State to track loading status
    error: null, // State to store any errors
  }),
  actions: {
    // Fetch all time entries
    async fetchTimeEntries() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.all("time-entries");
        this.timeEntries = response.data;
      } catch (error) {
        this.error = error.message || "Failed to fetch time entries";
      } finally {
        this.loading = false;
      }
    },

    // Add a new time entry
    async addTimeEntry(timeEntry) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.store("time-entries", timeEntry);
        this.timeEntries.push(response.data);
      } catch (error) {
        this.error = error.message || "Failed to add time entry";
      } finally {
        this.loading = false;
      }
    },

    // Update an existing time entry
    async updateTimeEntry(timeEntry) {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiService.update(`time-entries/${timeEntry.id}`, timeEntry);
        const index = this.timeEntries.findIndex((entry) => entry.id === timeEntry.id);
        if (index !== -1) {
          this.timeEntries.splice(index, 1, response.data);
        }
      } catch (error) {
        this.error = error.message || "Failed to update time entry";
      } finally {
        this.loading = false;
      }
    },

    // Delete a time entry
    async removeTimeEntry(timeEntryId) {
      this.loading = true;
      this.error = null;
      try {
        await apiService.delete(`time-entries/${timeEntryId}`);
        this.timeEntries = this.timeEntries.filter((entry) => entry.id !== timeEntryId);
      } catch (error) {
        this.error = error.message || "Failed to delete time entry";
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    // Getter for all time entries
    getAllTimeEntries: (state) => state.timeEntries,

    // Getter for loading status
    isLoading: (state) => state.loading,

    // Getter for error
    getError: (state) => state.error,

    // Getter for time entries by user ID (example)
    getTimeEntriesByUserId: (state) => (userId) => {
      return state.timeEntries.filter((entry) => entry.userId === userId);
    },

    // Getter for time entries by task ID (example)
    getTimeEntriesByTaskId: (state) => (taskId) => {
      return state.timeEntries.filter((entry) => entry.taskId === taskId);
    },
  },
});