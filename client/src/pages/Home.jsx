import { Link } from "react-router-dom";
import "../css/Home.css";
import { useState } from "react";

export default function Home() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "What is a disposable email?",
            answer: "A disposable email is a temporary email address that you can use to receive messages without revealing your personal email. It's perfect for signing up for services, avoiding spam, or protecting your privacy."
        },
        {
            question: "Do I need to sign up to use the service?",
            answer: "No signup is required! You can generate a disposable email instantly and start using it right away."
        },
        {
            question: "How long do disposable emails last?",
            answer: "Our disposable emails are temporary and browser sessions typically last for 24 hours. You can create a new disposable email at any time."
        },
        {
            question: "Can I use the API for free?",
            answer: "Absolutely! Our API is free to use without requiring a signup or API token. Check out the documentation for more details on integration."
        },
        {
            question: "What happens to my emails after they expire?",
            answer: "Once a disposable email expires, all inbox messages are permanently deleted and cannot be recovered for privacy reasons."
        }
    ];

    return (
        <>
            <main className="flex items-center justify-start flex-col text-center px-4 min-h-screen glow pt-70 border-b border-gray-400/30">
                <div className="animated animatedFadeInUp fadeInUp">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Private mail for <span className="text-blue-500">everyone</span>.</h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8">Create disposable, secure emails in seconds. No signup required.</p>

                    <Link to="/mail" className="md:inline-block bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-800 transition">Get Started</Link>
                    <Link to="/api" className="md:inline-block bg-transparent text-blue-500 font-semibold py-3 px-6 rounded-lg shadow border border-blue-500 hover:bg-blue-700 hover:text-white transition ml-3">View Docs</Link>
                </div>
            </main>
            
            <div id="features" className="flex flex-col items-center justify-center py-24 bg-gray-900 border-b border-gray-400/30 scroll-mt-[90px]">
                <h1 className="text-5xl font-bold text-white mb-12">Features</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full px-4 md:px-8">
                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-400/30 rounded-lg shadow">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-8">
                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                            </svg>
                        </div>
                    
                        <h3 className="text-xl font-bold text-white mb-3">Disposable Emails</h3>
                        <p className="text-base text-gray-300">Generate disposable temporary emails instantly without signing up. Keep your personal email private and avoid unwanted newsletters, ads, and tracking.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-400/30 rounded-lg shadow">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                            </svg>
                        </div>
                    
                        <h3 className="text-xl font-bold text-white mb-3">API Access</h3>
                        <p className="text-base text-gray-300">Integrate disposable emails directly into your apps and libraries. Access our free API with no signup or request token required.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-400/30 rounded-lg shadow">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                        </div>
                    
                        <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                        <p className="text-base text-gray-300">We don't store your emails after your session ends. Your privacy is guaranteed.</p>
                    </div>

                    <div className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-400/30 rounded-lg shadow">
                        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </div>
                    
                        <h3 className="text-xl font-bold text-white mb-3">Open Source</h3>
                        <p className="text-base text-gray-300">Our code is fully open source under Apache 2.0. You can contribute or view it anytime on GitHub <a href="https://github.com/brianwalczak/echoMail" className="underline" target="_blank" rel="noopener noreferrer">here</a>.</p>
                    </div>
                </div>
            </div>

            <div id="how-it-works" className="flex flex-col items-center justify-center py-24 bg-gray-800 border-b border-gray-400/30 scroll-mt-[50px]">
                <h1 className="text-5xl font-bold text-white mb-16">How It Works</h1>

                <div className="relative flex flex-col items-center w-full max-w-3xl px-4 md:px-8">
                    <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-600/60 -translate-x-1/2"></div>

                    <div className="relative flex flex-col items-center text-center p-8 bg-gray-900 border border-gray-400/30 rounded-2xl shadow-lg mb-16 w-full">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">1</div>
                        
                        <h3 className="text-2xl font-semibold text-white mb-4 mt-6">Generate Email</h3>
                        <p className="text-base text-gray-300">Instantly create a disposable email address - no signup required.</p>
                    </div>

                    <div className="relative flex flex-col items-center text-center p-8 bg-gray-900 border border-gray-400/30 rounded-2xl shadow-lg mb-16 w-full">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">2</div>
                        
                        <h3 className="text-2xl font-semibold text-white mb-4 mt-6">Receive Emails</h3>
                        <p className="text-base text-gray-300">Messages arrive in your disposable inbox without exposing your real email to online services.</p>
                    </div>

                    <div className="relative flex flex-col items-center text-center p-8 bg-gray-900 border border-gray-400/30 rounded-2xl shadow-lg w-full">
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md">3</div>
                        
                        <h3 className="text-2xl font-semibold text-white mb-4 mt-6">Stay Private</h3>
                        <p className="text-base text-gray-300">Keep your personal inbox safe and avoid spam, tracking, and unwanted newsletters.</p>
                    </div>
                </div>
            </div>

            <div id="faq" className="flex flex-col items-center justify-center py-24 bg-gray-900 border-b border-gray-400/30">
                <h1 className="text-5xl font-bold text-white mb-12">Frequently Asked Questions</h1>

                <div className="w-full max-w-3xl px-4 md:px-8">
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4">
                            <button className="flex justify-between items-center w-full p-6 bg-gray-800 border border-gray-400/30 rounded-lg shadow hover:bg-gray-700 transition text-left" onClick={() => toggleFaq(index)}>
                                <h3 className="text-xl font-semibold text-white">{faq.question}</h3>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`size-6 text-blue-500 transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            
                            {openFaq === index && (
                                <div className="p-6 bg-gray-900 border border-gray-400/30 rounded-lg mt-2">
                                    <p className="text-base text-gray-300">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}