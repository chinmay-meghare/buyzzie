import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import {
  faRightToBracket,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => !!state.auth.user);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const handleUserClick = () => setDropdownOpen((prev) => !prev);
  const handleLogin = () => {
    setDropdownOpen(false);
    navigate("/login");
  };
  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
  };
  const handleSignup = () => {
    setDropdownOpen(false);
    navigate("/signup");
  };

  const user_name = JSON.parse(localStorage.getItem("buyzzie_user"));

  return (
    <nav className="w-full flex items-center justify-between px-12 py-4 bg-[#1d0c3f] ">
      <div className="text-3xl font-bold tracking-wide">
        <Link to="/">
          <h1 className="text-5xl md:text-3xl font-black leading-tight mb-2">
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Buyzzie
            </span>
          </h1>
        </Link>
      </div>
      <ul className="flex gap-8 text-lg font-medium text-white/90">
        <li className="hover:text-cyan-300 cursor-pointer">
          <Link to="/" className="hover:text-cyan-300">
            Home
          </Link>
        </li>
        <li className="hover:text-cyan-300 cursor-pointer">
          <Link to="/collection" className="hover:text-cyan-300">
            Shop
          </Link>
        </li>
        <li className="hover:text-cyan-300 cursor-pointer">Categories</li>
        <li className="hover:text-cyan-300 cursor-pointer">New Arrivals</li>
        <li className="hover:text-cyan-300 cursor-pointer">About</li>
      </ul>
      <div className="flex items-center gap-6 text-white text-2xl">
        <span className="relative">
          <span className="cursor-pointer" onClick={handleUserClick}>
            <FontAwesomeIcon icon={faUser} />
          </span>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-10 text-base text-gray-800">
              {!isAuthenticated ? (
                <>
                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left"
                    onClick={handleLogin}
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    <span>Login</span>
                  </button>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    New customer?{" "}
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={handleSignup}
                    >
                      Register here
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Welcome,{" "}
                    <span className="font-bold capitalize">
                      {user_name.name}
                    </span>
                  </div>

                  <button
                    className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </span>
        <span className="relative cursor-pointer">
          <FontAwesomeIcon icon={faCartShopping} />
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
