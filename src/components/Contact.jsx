import React from "react";
import { Mail, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section className="py-5 bg-gray-100" id="contact">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
        <p className="text-gray-600 mb-10">
          We're here to help you with all your smart and secure living needs. Contact us today!
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <div className="flex items-center gap-3">
            <Phone className="text-teal-500" />
            <a href="tel:7868244191" className="text-lg text-gray-800 hover:text-teal-600 transition">
              (786) 824-4191
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="text-teal-500" />
            <a href="mailto:smartsolutionforliving@gmail.com" className="text-lg text-gray-800 hover:text-teal-600 transition">
              smartsolutionforliving@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
