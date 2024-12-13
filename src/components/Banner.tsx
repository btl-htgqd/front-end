// components/Banner.tsx
import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Banner: React.FC = () => {
    const sliderRef = useRef<Slider>(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };

    const handleNext = () => {
        sliderRef.current?.slickNext();
    };

    const handlePrevious = () => {
        sliderRef.current?.slickPrev();
    };

    return (
        <div className="relative overflow-hidden max-h-[500px] max-w-[80%] mx-auto mt-6 ">
            <Slider ref={sliderRef} {...settings} className="w-full">
                <div className="relative w-full">
                    <img src="/banner1.jpg" alt="Banner 1" className="w-full h-auto object-cover" />
                </div>
                <div className="relative w-full">
                    <img src="/banner2.jpg" alt="Banner 2" className="w-full h-auto object-cover" />
                </div>
                <div className="relative w-full">
                    <img src="/banner3.jpg" alt="Banner 3" className="w-full h-auto object-cover" />
                </div>
            </Slider>

            {/* Nút điều khiển Next và Previous dùng icon PNG */}
            <button
                onClick={handlePrevious}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                aria-label="Previous"
            >
                <img src="/image/leftarrow.png" alt="Previous" className="w-6 h-6" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                aria-label="Next"
            >
                <img src="/image/rightarrow.png" alt="Next" className="w-6 h-6" />
            </button>

            <style jsx>{`
              .slick-slide {
                position: relative;
              }

              .slick-dots {
                bottom: 10px;
              }

              .slick-dots li button:before {
                font-size: 12px;
                color: #fff;
              }

              .slick-dots li.slick-active button:before {
                color: #000;
              }
            `}</style>
        </div>
    );
};

export default Banner;
