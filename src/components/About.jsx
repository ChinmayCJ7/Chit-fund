import React from "react";
import Navbar from "./Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-10 mt-20">
        {/* About Us Section */}
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <div className="max-w-2xl text-center mb-6">
          <p className="mb-4">
            Chit funds are key instruments of financial inclusion for millions in India, especially for low-budget investors who do not have access to formal institutions like banks and NBFCs. Chit funds are a traditional and indigenous financial instrument that helps subscribers inculcate the habit of saving. India is home to millions of such subscribers who have been using this system for decades.
          </p>
          <p className="mb-4">
            However, the chit fund system is also susceptible to fraud. Reports suggest that between ₹1.2 to ₹1.4 lakh crores of public money have been lost to various chit fund schemes. Over 350 scams have been identified, affecting 15 crore families across 17 states, primarily targeting low-budget investors.
          </p>
          <p>
            Blockchain technology offers numerous advantages over traditional chit funds, including increased transparency, security, and efficiency. By decentralizing the process, we can eliminate intermediaries and significantly reduce the risks of fraud and corruption.
          </p>
        </div>

        {/* Tech Stack Section */}
        <div className="max-w-2xl text-center border-2 p-6 rounded-lg bg-slate-50 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <p className="mb-4">
            Our platform is built using the following cutting-edge technologies:
          </p>
          <ul className="list-disc list-inside text-left">
            <li className="mb-2">React</li>
            <li className="mb-2">Polygon</li>
            <li className="mb-2">Solidity</li>
            <li className="mb-2">ThirdWeb</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default About;
