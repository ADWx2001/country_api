import React from "react";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#6A0DAD] to-[#8A2BE2] text-gray-200 pt-12 pb-6 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              <img
                src={
                  "https://cliply.co/wp-content/uploads/2021/02/392102850_EARTH_EMOJI_400px.gif"
                }
                className="w-12 md:w-16"
                alt="Finova Logo"
              />{" "}
              Country Explorer
            </h2>
            <p className="text-sm leading-relaxed text-gray-200">
              Your gateway to global discovery. Learn about countries, cultures,
              and people from around the world all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-indigo-400 transition">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/countries"
                  className="hover:text-indigo-400 transition"
                >
                  Browse Countries
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-indigo-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-indigo-400 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social / Contact */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Connect With Us
            </h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-gray-200 hover:text-indigo-500 transition text-xl"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-500 transition text-xl"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-500 transition text-xl"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-indigo-500 transition text-xl"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
            <p className="text-sm text-gray-200">
              Email: it22115720@my.sliit.lk
            </p>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="mt-12 border-t border-gray-700 pt-4 text-center text-sm text-gray-200">
          © {new Date().getFullYear()} Country Explorer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
