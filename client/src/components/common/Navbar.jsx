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
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import CartBadge from "./CartBadge";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => !!state.auth.user);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Detect scroll position
  React.useEffect(() => {
    const handleScroll = () => {
      // Change background after scrolling past hero section (~600px)
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => setDropdownOpen((prev) => !prev);

  const handleLogin = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const handleSignup = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/signup");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const user_name = JSON.parse(localStorage.getItem("buyzzie_user"));

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-4 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-black/40 backdrop-blur-md border-gray-700/50'
          : ''
          }`}
      >
        {/* Logo */}
        <div className="text-3xl font-bold tracking-wide">
          <Link to="/">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                Buyzzie
              </span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex gap-8 text-xl font-medium text-white/90">
          <li className="hover:text-cyan-300 cursor-pointer transition-colors duration-200">
            <Link to="/collection" className="hover:text-cyan-300">
              Shop
            </Link>
          </li>
          <li className="hover:text-cyan-300 cursor-pointer transition-colors duration-200">
            <Link to="/categories" className="hover:text-cyan-300">
              Categories
            </Link>
          </li>
          <li className="hover:text-cyan-300 cursor-pointer transition-colors duration-200">
            New Arrivals
          </li>
          <li className="hover:text-cyan-300 cursor-pointer transition-colors duration-200">
            About
          </li>
        </ul>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center gap-6 text-white text-2xl">
          <span className="relative">
            <span className="cursor-pointer hover:text-cyan-300 transition-colors duration-200" onClick={handleUserClick}>
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
                        {user_name?.name}
                      </span>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      <span>Profile</span>
                    </Link>
                    {user_name?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left text-blue-600"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Admin Panel</span>
                      </Link>
                    )}
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
          <Link to="/cart">
            <span className="relative cursor-pointer hover:text-cyan-300 transition-colors duration-200">
              <FontAwesomeIcon icon={faCartShopping} />
              <CartBadge />
            </span>
          </Link>
        </div>

        {/* Mobile Icons (Cart + Hamburger) */}
        <div className="flex lg:hidden items-center gap-4 text-white text-2xl">
          <Link to="/cart">
            <span className="relative cursor-pointer hover:text-cyan-300 transition-colors duration-200">
              <FontAwesomeIcon icon={faCartShopping} />
              <CartBadge />
            </span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-cyan-300 transition-colors duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={mobileMenuOpen ? faXmark : faBars} className="text-3xl" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay Background (20% clickable area) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileMenu}
          style={{ backdropFilter: "blur(4px)" }}
        />
      )}

      {/* Mobile Slide-in Menu (80% height) */}
      <div
        className={`fixed top-0 right-0 h-[80vh] w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        style={{
          boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
              Menu
            </h2>
            <button
              onClick={closeMobileMenu}
              className="text-white hover:text-cyan-300 transition-colors duration-200"
              aria-label="Close menu"
            >
              <FontAwesomeIcon icon={faXmark} className="text-2xl" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <ul className="flex flex-col gap-1 p-6 text-lg font-medium text-white/90 flex-grow overflow-y-auto">
            <li className="hover:bg-white/10 rounded-lg transition-all duration-200">
              <Link
                to="/"
                className="block px-4 py-3 hover:text-cyan-300 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li className="hover:bg-white/10 rounded-lg transition-all duration-200">
              <Link
                to="/collection"
                className="block px-4 py-3 hover:text-cyan-300 transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Shop
              </Link>
            </li>
            <li className="hover:bg-white/10 rounded-lg transition-all duration-200">
              <span
                className="block px-4 py-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Categories
              </span>
            </li>
            <li className="hover:bg-white/10 rounded-lg transition-all duration-200">
              <span
                className="block px-4 py-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                New Arrivals
              </span>
            </li>
            <li className="hover:bg-white/10 rounded-lg transition-all duration-200">
              <span
                className="block px-4 py-3 hover:text-cyan-300 cursor-pointer transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                About
              </span>
            </li>

            {/* User Section in Mobile Menu */}
            <li className="mt-4 pt-4 border-t border-gray-700">
              <div className="relative">
                <button
                  onClick={handleUserClick}
                  className="flex items-center gap-3 px-4 py-3 w-full hover:bg-white/10 rounded-lg transition-all duration-200 text-left"
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <span className="text-white/90 hover:text-cyan-300 transition-colors duration-200">
                    Account
                  </span>
                </button>

                {/* Dropdown within mobile menu */}
                {dropdownOpen && (
                  <div className="mt-2 ml-4 bg-white/10 backdrop-blur-sm rounded-lg py-2 text-base">
                    {!isAuthenticated ? (
                      <>
                        <button
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-white/10 text-left text-white/90 hover:text-cyan-300 transition-all duration-200"
                          onClick={handleLogin}
                        >
                          <FontAwesomeIcon icon={faRightToBracket} />
                          <span>Login</span>
                        </button>
                        <div className="px-4 py-2 text-sm text-white/70">
                          New customer?{" "}
                          <span
                            className="text-cyan-300 hover:underline cursor-pointer font-medium"
                            onClick={handleSignup}
                          >
                            Register here
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-sm text-white/70">
                          Welcome,{" "}
                          <span className="font-bold capitalize text-cyan-300">
                            {user_name?.name || "User"}
                          </span>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-white/10 text-left text-white/90 hover:text-cyan-300 transition-all duration-200"
                          onClick={closeMobileMenu}
                        >
                          <FontAwesomeIcon icon={faUser} />
                          <span>Profile</span>
                        </Link>
                        {user_name?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 w-full hover:bg-white/10 text-left text-cyan-300 hover:text-cyan-200 transition-all duration-200"
                            onClick={closeMobileMenu}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        <button
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-white/10 text-left text-white/90 hover:text-cyan-300 transition-all duration-200"
                          onClick={handleLogout}
                        >
                          <FontAwesomeIcon icon={faArrowRightFromBracket} />
                          <span>Logout</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;