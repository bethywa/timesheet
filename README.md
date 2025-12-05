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

## 👥 User Roles & Views

### Admin/Manager
- Dashboard with team overview
- Task assignment interface
- KPI definition and management
- Team performance reports
- User management

### User (Employee)
- Personal task dashboard
- Time entry logging interface
- Personal KPI dashboard
- Task status updates
- Daily timesheet view

## 📊 Key Features

1. **Task Management**
   - Create, update, and delete tasks
   - Task status tracking (Pending, In Progress, Completed)
   - Task assignment to users
   - Due date tracking

2. **Time Tracking**
   - Start/stop timer for tasks
   - Manual time entry
   - Daily timesheet view
   - Time entry editing

3. **KPI Dashboard**
   - Real-time KPI calculations
   - Visual charts (progress bars, line charts)
   - Comparison with expected scores
   - Historical performance trends

4. **Reporting**
   - Daily/weekly/monthly reports
   - Team performance overview
   - Export to PDF/Excel
   - Filter by date range, department, user

5. **Notifications**
   - Task deadline reminders
   - KPI goal achievements
   - System announcements

