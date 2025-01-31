import { createRouter, createWebHistory } from "vue-router";
import AdminLayout from "@/layouts/AdminLayout.vue";
import FreeLayout from "@/layouts/FreeLayout.vue";
import Login from "@/views/Login.vue";
import { useCookies } from "vue3-cookies";

// Define routes for the application
const routes = [
  {
    path: "/admin",
    component: AdminLayout, // Parent layout for admin routes
    children: [
      {
        path: "/", // Default route for admin
        name: "Home",
        component: () => import("@/views/HomePage.vue"),
      },
      {
        path: "tasks",
        name: "Tasks",
        component: () => import("@/views/Tasks.vue"),
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/Dashboard.vue"),
      },
      {
        path: "timeEntries",
        name: "TimeEntries",
        component: () => import("@/views/TimeEntries.vue"),
      },
      {
        path: "kpireports",
        name: "KPIReports",
        component: () => import("@/views/KPIReports.vue"),
      },
      {
        path: "departments",
        name: "Departments",
        component: () => import("@/views/Departments.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/Users.vue"),
      },
    ],
  }, // <-- Added comma here
  {
    path: "/free",
    component: FreeLayout, // Parent layout for free routes
    children: [
      {
        path: "login",
        name: "Login",
        component: Login,
      },
    ],
  }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

 //router.beforeEach((to, from, next) => {
 // const { cookies } = useCookies();
 // const isAuthenticated = cookies.get("token");
  //if (to.name !== "Login" && !isAuthenticated) next({ name: "Login" });
 //  else next();
 //});

export default router;