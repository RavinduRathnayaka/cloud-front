//import React from "react";
// Removed unused import 'Link'
function Footer() {
  return (
    <footer className="block bg-grey-light border-t">
      {/* Container */}
      <div className="py-16 md:py-20 mx-auto w-full max-w-7xl px-5 md:px-10">
        {/* Component */}
        <div className="flex-col flex items-center">
          <a href="#" className="mb-8 inline-block max-w-full text-black">
            <img
              src="{img1}"
              alt=""
              className="inline-block max-h-10"
            />
          </a>
          <div className="text-center font-semibold">
            <a
              href=""
              className="inline-block px-6 py-2 font-normal text-black transition hover:text-primary"
            >
              VitalEats
            </a>
            <a
              href="https://himas.codes/"
              className="inline-block px-6 py-2 font-normal text-black transition hover:text-primary"
            >
              +94 71 252 8831
            </a>
            
            <a
              href="https://himas.codes/"
              className="inline-block px-6 py-2 font-normal text-black transition hover:text-primary"
            >
              www.himas.codes
            </a>
           
          </div>
          <div className="mb-8 mt-8 border-b border-gray-300 w-48"></div>
          
          <p className="text-sm sm:text-base">
            © Copyright 2021. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
