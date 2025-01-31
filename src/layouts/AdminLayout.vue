<template>
  <v-app>
    <!--v-app-bar-->
    <v-app-bar app color="rgb(91, 167, 149)" dark>
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title>Daily Timesheet</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="navigateTo('Home')">Home</v-btn>
      <v-btn text @click="navigateTo('Users')">Users</v-btn>
      <v-btn text @click="navigateTo('Departments')">Departments</v-btn>
      <v-btn text @click="navigateTo('Tasks')">Tasks</v-btn>
      <v-btn text @click="navigateTo('Dashboard')">Dashboard</v-btn>
      <v-btn text @click="navigateTo('TimeEntries')">Time Entries</v-btn>
      <v-btn text @click="navigateTo('KPIReports')">KPI Reports</v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer app :rail="drawer" class="nvd" style="color: white;">
      <v-list>
        <v-list-item @click="navigateTo('Home')" prepend-icon="mdi-home">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('Departments')" prepend-icon="mdi-office-building">
          <v-list-item-title>Departments</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('Users')" prepend-icon="mdi-account">
          <v-list-item-title>Users</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('Tasks')" prepend-icon="mdi-calendar-check">
          <v-list-item-title>Tasks</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('Dashboard')" prepend-icon="mdi-view-dashboard">
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('TimeEntries')" prepend-icon="mdi-clock-time-eight">
          <v-list-item-title>Time Entries</v-list-item-title>
        </v-list-item>
        <v-list-item @click="navigateTo('KPIReports')" prepend-icon="mdi-chart-box-outline">
          <v-list-item-title>KPI Reports</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout" prepend-icon="mdi-logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// State for the navigation drawer
const drawer = ref(false); // Set to false for a default closed state

// Handle toggling of the drawer
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Use Composition API to navigate
const navigateTo = (path) => {
  router.push({ name: path });
};

// Logout function (to be implemented)
const logout = () => {
  // Logic for logging out the user
  console.log("User logged out");
};
</script>

<style scoped>
.nvd {
  background: rgb(91, 167, 149);
}
</style>
