import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../index.css';

const Landing = () => {
    const [look, setLook] = useState(1);
    return (
        <div className="bg-black text-white min-h-screen font-inter">
            <nav className="p-5 flex justify-between border-b border-gray-800">
                <img src="/assets/logo_tryonyou.png" className="h-10" alt="Logo" />
                <div className="text-green-400 text-sm flex items-center">
                    <span className="pulse-dot mr-2"></span> SYSTÈME IA CONNECTÉ
                </div>
            </nav>
            <header className="text-center py-16 px-5">
                <h1 className="text-4xl font-bold max-w-3xl mx-auto">
                    Allez-vous vraiment essayer 510 pantalons pour trouver celui qui vous va le mieux ?
                </h1>
                <img src="/assets/montana_pantalones.png" className="w-3/4 mx-auto mt-10 rounded-xl" />
            </header>
            <main className="flex flex-col md:flex-row justify-center items-center gap-16 py-20 px-5">
                <motion.div whileTap={{ scale: 0.9 }} onClick={() => setLook((look % 3) + 1)} className="cursor-pointer text-center">
                    <img src="/assets/pau_blanco_chasquido.png" className="w-48" />
                    <p className="text-gold font-bold mt-5">Cliquez pour le "Chasquement" de PAU</p>
                </motion.div>
                <div className="mirror-frame border-4 border-gold rounded-2xl overflow-hidden shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={look}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            src={`/assets/look${look}.png`} className="h-[550px]"
                        />
                    </AnimatePresence>
                </div>
            </main>
            <footer className="text-center py-24 bg-zinc-900">
                <h2 className="text-gold text-2xl font-bold">TryOnYou : The Fashion Intelligence System</h2>
                <p className="max-w-2xl mx-auto my-6 text-gray-300">
                    Le fin des retours est arrivée. Ne laissez pas les autres vous le raconter. Vivez-le.
                </p>
                <button className="bg-gold text-black px-12 py-5 font-black rounded-sm hover:bg-yellow-600 transition">
                    CRÉER MON AVATAR
                </button>
            </footer>
        </div>
    );
};
export default Landing;