const LogoSlider = ({ logos }) => {
  return (
    <div className="w-full bg-[#fce8eb] pb-6 mt-[-60px]">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center">
              <img
                src={logo.image}
                alt={`Logo ${index + 1}`}
                className="w-[200px] h-[200px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;