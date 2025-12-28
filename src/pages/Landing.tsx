import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/Landing.css'; // We'll create a new CSS file for specific styles

const claims = [
    {
        title: "Zero Returns",
        description: "Perfect fit guaranteed by biometric intelligence, eliminating the hassle of returns."
    },
    {
        title: "Fabric-Aware Fitting",
        description: "Our engine understands fabric elasticity and drape for a true-to-life fit."
    },
    {
        title: "AI + Biometrics",
        description: "We combine advanced AI with precise body measurements for unparalleled accuracy."
    },
    {
        title: "Confidence in Fit",
        description: "Discover the clothes that were truly made for you, without ever stepping into a fitting room."
    }
];

const Landing = () => {
    const [look, setLook] = useState(1);
    const [activeClaim, setActiveClaim] = useState(0);

    return (
        <div className="bg-dark text-white min-h-screen font-sans">
            {/* Navigation */}
            <nav className="p-5 flex justify-between items-center border-b border-gray-800 sticky top-0 bg-dark z-10">
                <img src="/assets/logo_tryonyou.png" className="h-10" alt="TryOnYou Logo" />
                <div className="text-green-400 text-sm flex items-center">
                    <span className="pulse-dot mr-2"></span>
                    AI FASHION INTELLIGENCE ONLINE
                </div>
            </nav>

            {/* Hero Section */}
            <header className="text-center p-12 md:p-20">
                <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
                    The clothes that fit you best,
                    <br />
                    without trying them on.
                </h1>
                <p className="text-gold mt-4 text-lg">Bring out your best version.</p>
            </header>

            {/* Interactive Mirror Section */}
            <main className="flex flex-col md:flex-row justify-center items-center gap-12 p-6 md:p-12">
                <div onClick={() => setLook((look % 3) + 1)} className="cursor-pointer text-center order-2 md:order-1">
                    <img src="/assets/pau_blanco_chasquido.png" className="w-44" alt="PAU Snap" />
                    <p className="text-gold mt-4">Tap Pau. Change the look.</p>
                </div>
                <div className="mirror-frame w-[300px] h-[450px] md:w-[400px] md:h-[550px] flex items-center justify-center order-1 md:order-2">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={look}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5 }}
                            src={`/assets/look${look}.png`}
                            className="h-full w-full object-cover"
                            alt={`Look ${look}`}
                        />
                    </AnimatePresence>
                </div>
                 <div className="w-44 order-3 hidden md:block"></div>
            </main>

            {/* Claims Section */}
            <section className="py-20 bg-gray-900 text-center">
                <h2 className="text-3xl font-bold mb-12">The Future of Fitting</h2>
                <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
                    {claims.map((claim, index) => (
                        <div key={index} className="bg-dark p-8 rounded-lg border border-gray-700 w-full md:w-1/3 lg:w-1/4 transform hover:scale-105 transition-transform duration-300">
                            <h3 className="text-gold text-xl font-bold mb-3">{claim.title}</h3>
                            <p className="text-gray-300">{claim.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <footer className="text-center p-20">
                <h2 className="text-3xl font-bold mb-4">Ready to find your perfect fit?</h2>
                <p className="text-gray-400 mb-8">Enter the pilot and experience the new era of fashion.</p>
                <Link to="/demo" className="bg-gold text-dark font-bold py-4 px-12 text-lg rounded-md hover:bg-yellow-500 transition-colors duration-300">
                    ENTER PILOT
                </Link>
            </footer>
        </div>
    );
};
export default Landing;
