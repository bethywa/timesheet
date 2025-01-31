import { defineStore } from "pinia";
import axios from "axios";
import apiService from "@/services/apiService";

// Base URL for your backend API
// const API_URL = 'http://localhost:3000/tasks';
const API_URL = "http://192.168.1.1:8000/api/tasks";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    tasks: [], // State to store fetched tasks
  }),
  actions: {
    async fetchTasks() {
      try {
        const response = await apiService.all("tasks");
        this.tasks = response.data;
      } catch (error) {}
    },
    async addTask(task) {
      // this.tasks.push(task); //Delete this line during actual testing
      try {
        const response = await apiService.store("tasks", task);

        this.tasks.push(response.data);
      } catch (error) {}
    },
    async removeTask(taskId) {
      // this.tasks = this.tasks.filter((task) => task.id !== taskId); //Delete this line during actual testing
      try {
        let response = await apiService.delete(`tasks/${taskId}`);
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
      } catch (error) {}
    },
    async updateTask(task) {
      // const index = this.tasks.findIndex((t) => t.id === task.id);
      // if (index !== -1) {
      //   this.tasks.splice(index, 1, task);
      // }

      try {
        const response = await apiService.update(`tasks/${task.id}`, task);

        const index = this.tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          this.tasks.splice(index, 1, response.data);
        }
      } catch (error) {}
    },
  },
  getters: {
    completedTasks: (state) => {
      return state.tasks.filter((task) => task.completed);
    },
    pendingTasks: (state) => {
      return state.tasks.filter((task) => !task.completed);
    },
  },
});
