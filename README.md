# TravelCost 🚗

TravelCost is a modern web application designed to help users calculate and manage their travel expenses efficiently. Built with a focus on speed, responsiveness, and a premium user experience.

## 🚀 Technology Stack

### **Core Framework & Language**
*   **Next.js (v16.1.1)**: Utilizing the **App Router** for optimized routing and server-side rendering.
*   **React (v19.2.3)**: Powering the interactive UI components.
*   **TypeScript**: Ensuring type safety across the codebase.

### **Styling & UI**
*   **Tailwind CSS (v4)**: Modern, utility-first styling for a sleek and responsive design.
*   **Lucide React**: Beautiful, consistent iconography.
*   **Recharts**: Interactive data visualization for travel cost analytics.

### **Backend & Auth**
*   **MongoDB**: Robust database for storing trip data and user records.
*   **Better Auth**: Integrated with **Phone-based authentication** and MongoDB adapter for secure session management.

## ✨ Features

- **Dashboard**: High-level overview of travel expenses and trip statistics.
- **Bulk Calculation**: Easily calculate costs for multiple trips or large-scale travel plans.
- **Trip Management**: Comprehensive tools to add, view, and track individual trips.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Secure Auth**: Seamless phone-based login system.

## 🛠️ Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔑 Environment Setup

Ensure you have a `.env.local` file with the following configurations:
- `MONGODB_URI`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- (Other auth provider keys as needed)

## 📄 License

This project is private and for internal use.
