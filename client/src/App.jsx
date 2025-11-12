import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import CartInitializer from "./components/cart/CartInitializer";

function App() {
  return (
    <>
      <CartInitializer />
      <Navbar />
      <AppRoutes />
      <Footer />
    </>
  );
}

export default App;