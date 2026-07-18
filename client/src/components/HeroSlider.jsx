import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { fadeIn, viewportConfig } from "./motion";
import { useSettings } from "../context/SettingsContext";

const HeroSlider = () => {
  const settings = useSettings();

  const slides = [
    {
      title: "Inspiring Minds,\nShaping Futures",
      subtitle: "New Arrivals 2024",
      body: "Premium educational books for Nursery through Higher Secondary — crafted by expert educators.",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Discover Top Titles\nFor Every Stage",
      subtitle: "Academic Excellence",
      body: "Find trusted books in science, language, mathematics, and exam-focused preparation.",
      image:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=2000&q=80"
    },
    {
      title: "Best Selling &\nMost Searched Books",
      subtitle: "Publishing House",
      body: `Discover what students, guardians, and schools choose most from ${settings.publicationName}.`,
      image:
        "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=2000&q=80"
    }
  ];

  return (
    <motion.section
      className="hero"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="container">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          className="hero-swiper"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.title}>
              <article className="hero-slide" style={{ backgroundImage: `url(${slide.image})` }}>
                <div className="hero-overlay">
                  <p className="hero-subtitle">{slide.subtitle}</p>
                  <h1>
                    {slide.title.split("\n").map((line) => (
                      <span key={line}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </h1>
                  <p>{slide.body}</p>
                  <div className="hero-cta">
                    <a href="/books" className="btn-primary">
                      Explore Books
                    </a>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default HeroSlider;
