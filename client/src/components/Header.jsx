import { Link } from "react-router-dom";
import React from "react";

const Header = React.forwardRef((props, ref) => (
  <header ref={ref} className="fixed top-0 left-0 w-full z-50 bg-gray-950/50 backdrop-blur-xl border-b border-white/0 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">echo<span className="text-white">Mail</span></Link>
            <nav className="space-x-4 hidden md:flex">
                <Link to="/#how-it-works" className="text-gray-400 font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">How it Works</Link>
                <Link to="/api" className="text-gray-400 font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">API</Link>
                <Link to="/#features" className="text-gray-400 font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">Features</Link>
                <Link to="/#faq" className="text-gray-400 font-medium rounded-md px-3 py-1.5 border border-transparent hover:border-gray-400/30 hover:bg-white/20 hover:text-white transition">FAQ</Link>
            </nav>

            <Link to="/mail" className="md:inline-block bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow hover:bg-blue-700 transition">Get Started</Link>
        </div>
    </header>
));

export default Header;