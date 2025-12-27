
import React, { useState } from 'react';
import '../index.css';
import { motion, AnimatePresence } from 'framer-motion';

const Landing = () => {
    const [look, setLook] = useState(1);
    const CONTENT_FR = {
        "HERO_TITLE": "Allez-vous vraiment essayer 510 pantalons pour trouver celui qui vous va le mieux ?",
        "PAU_SNAP": "Cliquez pour le 'Chasquement' de PAU. Changez de look instantanément.",
        "TECH_CLAIM": "La Science derrière le Style : Précision biométrique millimétrée.",
        "FINAL_CTA": "TryOnYou : Le Système d'Intelligence de Mode. Créez votre avatar dès maintenant. Le fin des retours est arrivée. Vivez-le."
    };

    return (
        <div className="bg-dark text-white min-h-screen">
            <nav className="p-5 flex justify-between items-center border-b border-gray-700">
                <img src="/assets/logo_tryonyou.png" className="h-10" alt="TryOnYou Logo" />
                <div className="text-green-400 text-sm flex items-center">
                    <span className="pulse-dot mr-2"></span>
                    SYSTÈME IA CONNECTÉ
                </div>
            </nav>
            <header className="text-center p-12">
                <h1 className="text-4xl font-bold max-w-3xl mx-auto">{CONTENT_FR['HERO_TITLE']}</h1>
                <img src="/assets/montana_pantalones.png" className="w-4/5 rounded-lg mx-auto mt-8" alt="Montana Pantalones" />
            </header>
            <main className="flex justify-center items-center gap-12 p-12">
                <div onClick={() => setLook((look % 3) + 1)} className="cursor-pointer text-center">
                    <img src="/assets/pau_blanco_chasquido.png" className="w-44" alt="PAU Snap" />
                    <p className="text-gold mt-4">{CONTENT_FR['PAU_SNAP']}</p>
                </div>
                <div className="mirror-frame w-[400px] h-[550px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={look}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            src={`/assets/look${look}.png`}
                            className="h-full object-cover"
                            alt={`Look ${look}`}
                        />
                    </AnimatePresence>
                </div>
            </main>
            <footer className="text-center p-24 bg-gray-900">
                <h2 className="text-2xl mb-6">{CONTENT_FR['TECH_CLAIM']}</h2>
                <button className="bg-gold text-dark font-bold py-4 px-8 cursor-pointer">{CONTENT_FR['FINAL_CTA']}</button>
            </footer>
        </div>
    );
};
export default Landing;
