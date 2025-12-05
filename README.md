# Daily Timesheet Frontend

Vue.js + Vuetify frontend application for the Daily Timesheet project — a task, time tracking, and KPI performance monitoring system.

## 🚀 Tech Stack

- **Vue.js 3** – Progressive JavaScript framework
- **Vuetify 3** – Material Design component framework
- **Vue Router** – Client-side routing
- **Pinia** – State management
- **Axios** – HTTP client for API communication
- **Vite** – Build tool and development server

## 📁 Project Structure

src/
├── assets/ # Static assets (images, styles)
├── components/ # Reusable Vue components 
│ ├── tasks/ # Task-related components
│ ├── kpi/ # KPI dashboard components
│ └── layout/ # Layout components (Header, Sidebar)

├── layouts/ # Page layouts
├── pages/ # Page components
│ ├── Dashboard.vue
│ ├── Tasks.vue
│ ├── TimeEntry.vue
│ ├── KpiDashboard.vue
│ ├── Reports.vue
│ └── Profile.vue
├── router/ # Vue Router configuration
├── stores/ # Pinia stores for state management
├── services/ # API services (Axios instances)
└── App.vue # Root component
