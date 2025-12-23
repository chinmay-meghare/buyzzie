# Buyzzie

[![Netlify Status](https://api.netlify.com/api/v1/badges/bd9747f6-3f0e-4021-9076-53c3ccfe810a/deploy-status)](https://app.netlify.com/projects/buyzzie/deploys)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff.svg?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg?logo=tailwindcss)

**Buyzzie** is a modern, feature-rich e-commerce frontend application built with React and Vite. It delivers a premium shopping experience with a sleek, responsive design, simulating a full-stack environment using Mock Service Worker (MSW) for realistic backend interactions.

Designed for performance and aesthetics, Buyzzie solves the problem of testing and prototyping complex e-commerce flows—from product discovery to checkout—without needing a live backend server. It serves as a perfect template for developers looking to build scalable online stores or explore advanced React patterns.

---

## 📑 Table of Contents
- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🚀 Demo

Experience the live application here: **[https://buyzzie.netlify.app](https://buyzzie.netlify.app)**

![Buyzzie Home Page](./client/src/assets/homepage-screenshot.png)
*(Note: Please ensure a screenshot is placed at this path or update the link)*

---

## ✨ Features

Buyzzie comes packed with essential e-commerce functionalities:

*   **🛍️ Immersive Shopping Experience**: Browse distinct collections, view detailed product pages, and filter by categories.
*   **🛒 robust Cart System**: Add items, adjust quantities, and manage your shopping cart with ease.
*   **💳 Seamless Checkout**: A streamlined checkout flow including shipping details and order summaries.
*   **👤 User Accounts**: Full user lifecycle management including Login, Signup, Profile management, and Order History.
*   **🛡️ Admin Dashboard**: Dedicated admin area for managing products, users, and orders (Simulated).
*   **🎨 Responsive Design**: Fully responsive UI built with Tailwind CSS that looks great on mobile, tablet, and desktop.
*   **🔌 Mock Backend**: Integrated **MSW (Mock Service Worker)** to intercept network requests and simulate a real REST API, allowing the app to run completely client-side while behaving like a full-stack app.

---

## 🛠️ Tech Stack

This project leverages a modern frontend ecosystem:

*   **Core**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [FontAwesome](https://fontawesome.com/)
*   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **API Simulation**: [Mock Service Worker (MSW)](https://mswjs.io/)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)

---

## ⚙️ Installation

Follow these steps to set up Buyzzie locally on your machine.

**Prerequisites**: Node.js (v16+) and npm/yarn.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/chinmay-meghare/buyzzie.git
    cd buyzzie
    ```

2.  **Navigate to the client directory**
    ```bash
    cd client
    ```

3.  **Install dependencies**
    ```bash
    npm install
    ```

4.  **Start the development server**
    ```bash
    npm run dev
    ```

The application will launch at `http://localhost:5173`.

---

## 📖 Usage

### Browsing & Shopping
*   Navigate to the **Shop** page to view all products.
*   Click on any product to see details and add it to your cart.
*   Proceed to checkout to simulate a purchase.

### User Management
*   **Sign Up** for a new account to track your orders.
*   **Log In** to access your generic profile and history.

### Admin Access
*   Access the Admin Panel (if privileges are granted/simulated) to view dashboard statistics and manage store data.

---

## 🔧 Configuration

Buyzzie is designed to work out-of-the-box with zero complex configuration thanks to MSW. 

*   **Environment Variables**: Currently, the project does not require a `.env` file for local development as it interacts with a mocked API. 
*   **Port**: By default, Vite runs on port `5173`. This can be modified in `vite.config.js`.

---

## 🤝 Contribution Guidelines

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  **Fork the Project**
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a **Pull Request**

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👏 Acknowledgements

*   **React & Redux Teams** for the amazing ecosystem.
*   **MSW** for making frontend development independent of backend readiness.
*   **Tailwind CSS** for the utility-first styling framework.

---

## 📬 Contact

Project Maintainer - **Chinmay Meghare**

Project Link: [https://github.com/chinmay-meghare/buyzzie](https://github.com/chinmay-meghare/buyzzie)
