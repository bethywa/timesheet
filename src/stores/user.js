import { defineStore } from "pinia";
import axios from "axios";
import apiService from "@/services/apiService";

// Base URL for your backend API
const API_URL = "http://172.16.29.163:8080/api/users"; // Updated to users

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [], // State to store fetched users
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await apiService.all("users");
        this.users = response.data;
        console.info(response.data);
      } catch (error) {}
    },
    async addUser(user) {
      try {
        const response = await apiService.store("users", user);

        this.users.push(response.data);
      } catch (error) {}
    },
    async removeUser(userId) {
      try {
        let response = await apiService.delete(`users/${userId}`);
        this.users = this.users.filter((user) => user.id !== userId);
      } catch (error) {}
    },
    async updateUser(user) {
      try {
        const response = await apiService.update(`users/${user.id}`, user);

        const index = this.users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
          this.users.splice(index, 1, response.data);
        }
      } catch (error) {}
    },
  },
  getters: {
    activeUsers: (state) => {
      return state.users.filter((user) => user.active);
    },
    inactiveUsers: (state) => {
      return state.users.filter((user) => !user.active);
    },
  },
});
