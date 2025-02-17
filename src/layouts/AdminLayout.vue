<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar app color="#14a814" height="48">
      <!-- Menu button to toggle the drawer -->
      <v-app-bar-nav-icon @click="toggleDrawer" />
      <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title> <!-- Dynamic title -->
      <v-spacer></v-spacer>
      <!-- Logout button in the app bar -->
      <v-btn text @click="logout">
        <span class="ml-2">Logout</span>
      </v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer app v-model="drawer" class="nvd" style="color: white;">
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
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router"; // Import useRoute
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();
const router = useRouter();
const route = useRoute(); // Get the current route

// State for the navigation drawer
const drawer = ref(false);

// State for the current page title
const currentPageTitle = ref("Daily Timesheet"); // Default title

// Watch for route changes to update the page title
watch(
  () => route.name, // Watch the route name
  (newRouteName) => {
    // Map route names to page titles
    const pageTitles = {
      Home: "Home",
      Departments: "Departments",
      Users: "Users",
      Tasks: "Tasks",
      Dashboard: "Dashboard",
      TimeEntries: "Time Entries",
      KPIReports: "KPI Reports",
    };

    // Update the current page title based on the route
    currentPageTitle.value = pageTitles[newRouteName] || "Daily Timesheet";
  },
  { immediate: true } // Trigger immediately on component mount
);

// Toggle the drawer
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

// Navigate to a specific route
const navigateTo = (path) => {
  router.push({ name: path });
  drawer.value = false; // Close the drawer after navigation
};

// Logout function
const logout = () => {
  cookies.remove("token");
  router.push({ name: "Login" });
  console.log("User logged out");
};
</script>

<style scoped>
.nvd {
  background:#14a814;
}
</style>