import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeCart } from "../../features/cart/cartSlice";
import { isUserAuthenticated } from "../../features/cart/cartUtils";

const CartInitializer = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    // Initialize cart when user is authenticated
    if (isUserAuthenticated() || token) {
      dispatch(initializeCart());
      console.log("Cart initialized on app load");
    }
  }, [dispatch, token]);

  return null; // This component doesn't render anything
};

export default CartInitializer;