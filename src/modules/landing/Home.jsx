import React from 'react'
import { useState } from 'react';

import logo from '../../assets/logo.jpg';

import ContactModal from './components/ContactModal';
import Services from './components/Services';







export default function Home() {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <>
        
            <section className="flex flex-col items-center justify-center text-center px-4 py-5 
            bg-gradient-to-br from-white to-gray-100">
                <img src={logo} alt="Smart Solution Logo" className="w-32 mb-6 drop-shadow-lg rounded-3xl" />
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Smart Solution for Living</h1>
                <p className="text-lg text-gray-600 max-w-xl mb-6">
                    We provide reliable, intelligent low-voltage and smart security solutions for modern 
                    homes and businesses.
                </p>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-6 rounded-full 
                    shadow-md transition duration-300"
                >
                    Contact Us
                </button>
            </section>

            <Services />
       

            <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
}
