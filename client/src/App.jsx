import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import ScrollToTop from "./components/ScrollToTop";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import API from "./pages/API";
import Mail from "./pages/Mail";
import "./index.css";

export default function App() {
    const navbar = useRef();
    const cursor = useRef();
    const location = useLocation();
    
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                navbar.current.classList.replace("border-gray-400/0", "border-gray-400/30");
            } else {
                navbar.current.classList.replace("border-gray-400/30", "border-gray-400/0");
            }
        };
        
        window.addEventListener("scroll", handleScroll);

        // Custom cursor
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        const speed = 0.2;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const animateCursor = () => {
            currentX += (mouseX - currentX) * speed;
            currentY += (mouseY - currentY) * speed;
            if (cursor.current) {
                cursor.current.style.transform = `translate3d(${currentX - 12}px, ${currentY - 12}px, 0)`;
            }
            requestAnimationFrame(animateCursor);
        };

        document.addEventListener("mousemove", handleMouseMove);
        animateCursor();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [location]);

    return (
        <>
            <div ref={cursor} className="w-6 h-6 bg-blue-500/50 rounded-full fixed top-0 left-0 pointer-events-none z-10000"></div>
            <ScrollToTop />
            <Header ref={navbar} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/api" element={<API />} />
                <Route path="/mail" element={<Mail />} />
            </Routes>

            <Footer />
        </>
    );
}