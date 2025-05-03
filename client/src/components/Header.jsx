import { Search, ChevronDown, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../assets/logo/log_af.png";
import { signOut } from "../redux/user/userSlice";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/single-item/${searchQuery.trim()}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/countries", label: "Countries" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#6A0DAD] to-[#8A2BE2] px-4 py-3 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo and Branding */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <img
            src={
              "https://cliply.co/wp-content/uploads/2021/02/392102850_EARTH_EMOJI_400px.gif"
            }
            className="w-12 md:w-16"
            alt="Finova Logo"
          />
          {currentUser ? (
            <h1 className="text-white text-sm md:text-base">
              Hello,{" "}
              <span className="text-purple-200">{currentUser?.firstName}</span>
            </h1>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-white text-sm md:text-base font-semibold">
                Chathu
              </h1>
              <span className="text-[9px] md:text-[10px] text-white">
                Explore Countries
              </span>
            </div>
          )}
        </div>

        {/* Desktop Navigation and Search */}
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
          {/* Navigation Links */}
          <nav className="flex gap-4 mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-white hover:text-purple-200 text-md font-medium font-serif transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search countries..."
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm text-sm"
            />
          </form>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 bg-white/90 hover:bg-white px-2.5 py-1.5 rounded-lg shadow-sm transition"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-label="User menu"
          >
            <img
              src={
                currentUser?.profilePicture ||
                "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI="
              }
              alt="User"
              className="w-7 h-7 rounded-full border border-gray-200 object-cover"
            />
            <ChevronDown size={16} className="text-gray-600" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg overflow-hidden z-50">
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    onClick={handleSignOut}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg px-4 py-3 z-40"
          >
            <nav className="flex flex-col gap-3 mb-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-800 hover:text-purple-600 py-1.5 text-sm font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none shadow-sm text-sm"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
