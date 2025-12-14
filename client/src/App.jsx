import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import CartInitializer from "./components/cart/CartInitializer";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isAdminRoute ? "dark" : "light"}
      />
      <CartInitializer />
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;