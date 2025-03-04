import { useState, useEffect } from "react";

const LogoSlider = ({ logos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const logosPerSlide = 4; // Number of logos to display at once
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          (prevIndex + 1) % Math.ceil(logos.length / logosPerSlide)
        );
      }, 3000); // Auto-slide every 3 seconds
  
      return () => clearInterval(interval);
    }, [logos.length]);

  return (
    <div className="w-full overflow-hidden bg-[#fce8eb] pb-6 mt-[-60px]">
    <div
      className="flex transition-transform duration-1000 ease-in-out"
      style={{
        transform: `translateX(-${currentIndex * 100}%)`,
        width: `${Math.ceil(logos.length / logosPerSlide) * 100}%`,
      }}
    >
      {Array.from({ length: Math.ceil(logos.length / logosPerSlide) }).map(
        (_, slideIndex) => (
          <div key={slideIndex} className="flex w-full justify-center gap-6">
            {logos
              .slice(slideIndex * logosPerSlide, (slideIndex + 1) * logosPerSlide)
              .map((logo, index) => (
                <img
                  key={index}
                  src={logo.image}
                  alt={`Logo ${index + 1}`}
                  className="w-[200px] h-[200px] object-contain"
                />
              ))}
          </div>
        )
      )}
    </div>
  </div>

  );
};

export default LogoSlider;
