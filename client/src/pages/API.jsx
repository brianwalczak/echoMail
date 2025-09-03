import { Link } from "react-router-dom";

export default function API() {
    return (
        <main className="flex items-center justify-start flex-col text-center px-4 min-h-screen pt-70 border-b border-gray-400/30">
            <div className="animated animatedFadeInUp fadeInUp">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">API Docs</h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                    🚧 This page is currently under construction. The full API documentation will be available soon. <br />
                    Keep an eye out for updates!
                </p>

                <Link to="/" className="md:inline-block bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition">Back to Home</Link>
            </div>
        </main>
    );
}