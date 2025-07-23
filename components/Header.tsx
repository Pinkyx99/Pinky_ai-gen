import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center flex flex-col items-center">
       <div className="inline-block bg-slate-700/50 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full mb-4">
        Made by Pinky
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 pb-2">
        AI App Generator
      </h1>
      <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
        Generate functional, data-driven apps instantly by simply providing a prompt detailing your desired features.
      </p>
    </header>
  );
};

export default Header;