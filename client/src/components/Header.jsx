import { Link } from "react-router-dom";
import React from "react";

const Header = React.forwardRef((props, ref) => (
  <header ref={ref} className="shadow-md fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-gray-400/0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">echo<span className="text-white/90">Mail</span></Link>
            <nav className="space-x-10 hidden md:flex">
                <a href="#how-it-works" className="text-gray-300 font-bold font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">How it Works</a>
                <Link to="/api" className="text-gray-300 font-bold font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">API</Link>
                <a href="#features" className="text-gray-300 font-bold font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">Features</a>
                <a href="#faq" className="text-gray-300 font-bold font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">FAQ</a>
            </nav>

            <Link to="/mail" className="md:inline-block bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-800 transition">Get Started</Link>
        </div>
    </header>
));

export default Header;