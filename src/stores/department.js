import { defineStore } from "pinia";
import apiService from "@/services/apiService";

// Base URL for your backend API
const API_URL = "http://192.168.1.1:8000/api/departments"; // Updated to departments

export const useDepartmentsStore = defineStore("departments", {
  state: () => ({
    departments: [], // State to store fetched departments
  }),
  actions: {
    async fetchDepartments() {
      try {
        const response = await apiService.all("departments");
        this.departments = response.data;
        console.log("departments: ", response);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    },
    async addDepartment(department) {
      try {
        const response = await apiService.store("departments", department);
        console.log("response: ", response);

        this.departments.push(response.data);
      } catch (error) {
        console.error("Error adding department:", error);
      }
    },
    async removeDepartment(departmentId) {
      try {
        let response = await apiService.delete(`departments/${departmentId}`);
        console.log("delete response: ", response);
        this.departments = this.departments.filter((department) => department.id !== departmentId);
      } catch (error) {
        console.error("Error removing department:", error);
      }
    },
    async updateDepartment(department) {
      try {
        const response = await apiService.update(`departments/${department.id}`, department);
        console.log("update response: ", response);

        const index = this.departments.findIndex((d) => d.id === department.id);
        if (index !== -1) {
          this.departments.splice(index, 1, response.data);
        }
      } catch (error) {
        console.error("Error updating department:", error);
      }
    },
  },
  getters: {
    activeDepartments: (state) => {
      return state.departments.filter((department) => department.active); // Adjust as per your department structure
    },
    inactiveDepartments: (state) => {
      return state.departments.filter((department) => !department.active); // Adjust as per your department structure
    },
  },
});