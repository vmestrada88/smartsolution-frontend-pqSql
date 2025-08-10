import React from 'react';
import { ShieldCheck, Home, Lock, Volume2 } from 'lucide-react';

const services = [
  {
    title: 'Security Systems',
    icon: <ShieldCheck size={40} className="text-teal-500 mb-4" />,
    description: 'Installation and maintenance of smart security cameras, alarm systems, and motion detectors.'
  },
  {
    title: 'Home Automation',
    icon: <Home size={40} className="text-teal-500 mb-4" />,
    description: 'Full smart home integration including lighting, climate, blinds, and device control to enhance comfort and efficiency.'
  },
  {
    title: 'Access Control',
    icon: <Lock size={40} className="text-teal-500 mb-4" />,
    description: 'Keyless smart locks and intercom systems for safe and convenient access management.'
  },
  {
    title: 'Audio & TV Automation',
    icon: <Volume2 size={40} className="text-teal-500 mb-4" />,
    description: 'Integrated home theater, multi-room audio, and TV setups with seamless network connectivity and centralized control.'
  }
];

export default function Services() {
  return (
    <section className="py-20 bg-white" id="services">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We offer tailored solutions for residential and commercial spaces.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
        {services.map((service, index) => (
          <div key={index} className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center">
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
