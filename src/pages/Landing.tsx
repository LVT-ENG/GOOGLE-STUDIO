
import React, { useState } from 'react';
import '../index.css';
import { motion, AnimatePresence } from 'framer-motion';

const content = {
    en: {
        "HERO_TITLE": "Are you really going to try on 510 pants to find the one that fits you best?",
        "PAU_SNAP": "Click for the PAU 'Snap'. Change your look instantly.",
        "TECH_CLAIM": "The Science behind the Style: Millimeter-level biometric precision.",
        "FINAL_CTA": "TryOnYou: The Fashion Intelligence System. Create your avatar now. The end of returns has arrived. Experience it.",
        "IA_CONNECTED": "AI SYSTEM CONNECTED",
        "TRY_NOW": "TRY NOW",
        "PAYMENT_PROCESSING": "Processing Payment by Iris/Voice...",
        "PAYMENT_SUCCESS": "Payment Successful!"
    },
    fr: {
        "HERO_TITLE": "Allez-vous vraiment essayer 510 pantalons pour trouver celui qui vous va le mieux ?",
        "PAU_SNAP": "Cliquez pour le 'Chasquement' de PAU. Changez de look instantanément.",
        "TECH_CLAIM": "La Science derrière le Style : Précision biométrique millimétrée.",
        "FINAL_CTA": "TryOnYou : Le Système d'Intelligence de Mode. Créez votre avatar dès maintenant. Le fin des retours est arrivée. Vivez-le.",
        "IA_CONNECTED": "SYSTÈME IA CONNECTÉ",
        "TRY_NOW": "ESSAYER MAINTENANT",
        "PAYMENT_PROCESSING": "Traitement du paiement par Iris/Voix...",
        "PAYMENT_SUCCESS": "Paiement réussi !"
    }
};

const Landing = () => {
    const [look, setLook] = useState(1);
    const [language, setLanguage] = useState('fr');
    const [paymentStatus, setPaymentStatus] = useState('');

    const handlePayment = () => {
        setPaymentStatus('processing');
        setTimeout(() => {
            setPaymentStatus('success');
        }, 2000);
    };

    const currentContent = content[language];

    return (
        <div className="bg-dark text-white min-h-screen">
            <nav className="p-5 flex justify-between items-center border-b border-gray-700">
                <img src="/assets/logo_tryonyou.png" className="h-10" alt="TryOnYou Logo" />
                <div className="flex items-center">
                    <div className="text-green-400 text-sm flex items-center mr-8">
                        <span className="pulse-dot mr-2"></span>
                        {currentContent['IA_CONNECTED']}
                    </div>
                    <div>
                        <button onClick={() => setLanguage('fr')} className={`mr-2 ${language === 'fr' ? 'opacity-100' : 'opacity-50'}`}>🇫🇷</button>
                        <button onClick={() => setLanguage('en')} className={`${language === 'en' ? 'opacity-100' : 'opacity-50'}`}>🇬🇧</button>
                    </div>
                </div>
            </nav>
            <header className="text-center p-12">
                <h1 className="text-4xl font-bold max-w-3xl mx-auto">{currentContent['HERO_TITLE']}</h1>
                <img src="/assets/montana_pantalones.png" className="w-4/5 rounded-lg mx-auto mt-8" alt="Montana Pantalones" />
            </header>
            <main className="flex justify-center items-center gap-12 p-12">
                <div onClick={() => setLook((look % 3) + 1)} className="cursor-pointer text-center">
                    <img src="/assets/pau_blanco_chasquido.png" className="w-44" alt="PAU Snap" />
                    <p className="text-gold mt-4">{currentContent['PAU_SNAP']}</p>
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
                <div className="text-center">
                    <img src="/assets/blazer_premium.png" className="w-44" alt="Blazer Premium"/>
                    <button onClick={handlePayment} className="bg-gold text-dark font-bold py-2 px-6 mt-4 cursor-pointer">
                        {currentContent['TRY_NOW']}
                    </button>
                </div>
            </main>
            <footer className="text-center p-24 bg-gray-900">
                <h2 className="text-2xl mb-6">{currentContent['TECH_CLAIM']}</h2>
                <button className="bg-gold text-dark font-bold py-4 px-8 cursor-pointer">{currentContent['FINAL_CTA']}</button>
                 {paymentStatus === 'processing' && <p className="text-green-400 mt-4">{currentContent['PAYMENT_PROCESSING']}</p>}
                {paymentStatus === 'success' && <p className="text-green-400 mt-4">{currentContent['PAYMENT_SUCCESS']}</p>}
            </footer>
        </div>
    );
};
export default Landing;
