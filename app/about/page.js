'use client';

export default function About() {
  return (
    <div className="w-full bg-[#fce8eb]">
      <div className="max-w-[2000px] mx-auto p-4">


      <div className="w-full bg-[#fce8eb] p-6 mt-[100px]">
  <div className="max-w-7xl mx-auto mt-[35px]"> {/* Added margin top here */}
    {/* Two-Column Layout */}
    <div className="flex flex-col md:flex-row gap-8">
      {/* Left Column - Text Content */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About ToolDocker</h1>
        <p className="text-lg text-gray-700 mb-6">
          ToolDocker is an e-commerce platform specializing in high-quality tools for professionals across various industries. We are backed by industry experts committed to providing top-tier equipment, ensuring efficiency and precision in every project.
        </p>
        <p className="text-lg text-gray-700 mb-6">
          Our journey began with a simple mission: to supply professionals and craftsmen with the best tools at competitive prices while offering expert guidance to help them make informed decisions.
        </p>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose ToolDocker?</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 mb-6">
          <li className="mb-2">Wide Range of Tools – From power tools to hand tools, we offer a comprehensive selection for every trade.</li>
          <li className="mb-2">High Quality & Durability – Our products are sourced from leading manufacturers, ensuring top performance.</li>
          <li className="mb-2">Affordable Prices – We provide cost-effective solutions without compromising on quality.</li>
          <li className="mb-2">Worldwide Shipping – Get your tools delivered anywhere with our reliable shipping options.</li>
          <li className="mb-2">Expert Support – Our team is here to assist you with personalized recommendations via chat, email, or phone.</li>
        </ul>
        <p className="text-lg text-gray-700">
          At ToolDocker, we believe the right tools make all the difference. Browse our catalog today and take your craftsmanship to the next level!
        </p>
      </div>

      {/* Right Column - Images */}
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-6">
          <img
            src="https://images.pexels.com/photos/4491852/pexels-photo-4491852.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Tools Image 1"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Tools Image 2"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <img
            src="https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Tools Image 3"
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  </div>
</div>

        {/* Hero Section */}
        <div className="relative py-16 bg-[#fce8eb] rounded-lg mb-12 mt-[35px]">
  <div className="max-w-4xl mx-auto text-center px-4">
    <h1 className="text-4xl font-bold text-gray-900 mb-6">About ToolDocker</h1>
    <p className="text-xl text-gray-600 mb-6">
      Your one-stop shop for high-quality stone cutting machines, tile cutting tools, and professional-grade equipment.
    </p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {[
        "Stone Cutting Machines",
        "Tile Cutting Machines",
        "Polishing Tools",
        "Drilling & Grinding Equipment",
        "Heavy-Duty Industrial Saws",
        "Precision Measuring Tools",
        "Construction & Masonry Tools"
      ].map((tool, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 flex items-center justify-center text-center">
          <p className="text-lg font-semibold text-gray-800">{tool}</p>
        </div>
      ))}
    </div>
  </div>
</div>


        {/* Our Story Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Established over two decades ago, ToolDocker has been a trusted provider of
              high-quality stone and tile cutting equipment for professionals worldwide.
            </p>
            <p className="text-gray-600 mb-4">
              Our journey began with a passion for precision and efficiency. From stone
              cutting machines to advanced tile cutting tools, we are committed to delivering
              durable and innovative solutions that empower craftsmen and businesses.
            </p>
            <p className="text-gray-600">
              Today, ToolDocker stands as a leading name in the industry, offering a wide range
              of tools that help professionals achieve excellence in every project.
            </p>
          </div>
          <div>
            <img
              src="https://images.pexels.com/photos/3637796/pexels-photo-3637796.jpeg"
              alt="ToolDocker Workshop"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>


        {/* Values Section */}
        <div className="bg-[#fce8eb] p-8 rounded-lg mb-16"> {/* Updated background color */}
  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
  <div className="grid md:grid-cols-3 gap-8">
    {/* Quality Section */}
    <div className="text-center">
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"> {/* Updated icon container background */}
        <svg className="w-8 h-8 text-[#e31c39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Updated icon color */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Quality</h3>
      <p className="text-gray-600">We never compromise on the quality of our products.</p>
    </div>

    {/* Innovation Section */}
    <div className="text-center">
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"> {/* Updated icon container background */}
        <svg className="w-8 h-8 text-[#e31c39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Updated icon color */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
      <p className="text-gray-600">Constantly improving our products and services.</p>
    </div>

    {/* Customer Service Section */}
    <div className="text-center">
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"> {/* Updated icon container background */}
        <svg className="w-8 h-8 text-[#e31c39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* Updated icon color */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Service</h3>
      <p className="text-gray-600">Dedicated support for our valued customers.</p>
    </div>
  </div>
</div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <img
                  src={`https://randomuser.me/api/portraits/men/${member}.jpg`}
                  alt={`Team Member ${member}`}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">John Doe</h3>
                <p className="text-gray-600">Position</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}