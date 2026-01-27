import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slideRemoteWork from "@assets/stock_images/remote_work_girl.png";
import slideVirtualClassroom from "@assets/stock_images/virtual_classroom_instructor.png";
import slide3 from "@assets/stock_images/empower_innovation.png";
import slideDigitalEconomy from "@assets/stock_images/digital_economy_handshake.png";
import slideInstitute from "@assets/stock_images/institute_building.png";

const slides = [
  {
    image: slideInstitute,
    span: "Virtual Campus",
    title: "Institute of Innovative Minds",
    highlightWord: "Innovative",
    description: "Innovate Today, Lead Tomorrow",
    cta: "Explore Programs",
    target: "programs",
    bgPosition: "right center",
    bgSize: "cover"
  },
  {
    image: slideRemoteWork,
    span: "IIM Sri Lanka Virtual Campus",
    title: "Master Remote Work",
    highlightWord: "Remote",
    description: "Learn the skills to work for global companies from anywhere in Sri Lanka.",
    cta: "Explore Programs",
    target: "programs",
    bgPosition: "right center",
    bgSize: "cover"
  },
  {
    image: slideVirtualClassroom,
    span: "IIM Sri Lanka Virtual Campus",
    title: "Virtual Classrooms",
    highlightWord: "Virtual",
    description: "Experience modern education with live sessions and practical portfolio work.",
    cta: "Explore Programs",
    target: "programs",
    bgPosition: "right center",
    bgSize: "cover"
  },
  {
    image: slide3,
    span: "IIM Sri Lanka Virtual Campus",
    title: "Empower Your Innovation",
    highlightWord: "Empower",
    description: "From digital entrepreneurship to AI tools, build your business today.",
    cta: "Explore Programs",
    target: "programs",
    bgPosition: "center right",
    bgSize: "cover"
  },
  {
    image: slideDigitalEconomy,
    span: "IIM Sri Lanka Virtual Campus",
    title: "Join the Digital Economy",
    highlightWord: "Digital",
    description: "Bridge the gap between education and modern professional work.",
    cta: "Explore Programs",
    target: "programs",
    bgPosition: "right center",
    bgSize: "cover"
  }
];

// Function to render title with highlighted word in primary color
const renderTitle = (title: string, highlightWord: string) => {
  if (!highlightWord) return title;

  const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === highlightWord.toLowerCase()
      ? <span key={index} className="text-primary">{part}</span>
      : part
  );
};

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[400px] md:h-[480px] w-full overflow-hidden bg-secondary/10 mt-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 transition-transform duration-[8s] scale-105"
            style={{
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: slides[current].bgSize || 'cover',
              backgroundPosition: slides[current].bgPosition || 'center'
            }}
          />

          {/* Overlay - Brighter, more compact wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/30 to-transparent" />

          {/* Content - More compact alignment */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-8">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="inline-block py-0.5 px-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold mb-3 uppercase tracking-wider">
                  {slides[current].span}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-4 text-foreground">
                  {renderTitle(slides[current].title, slides[current].highlightWord)}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-snug">
                  {slides[current].description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="default"
                    className="bg-primary hover:bg-primary/90 text-white px-6 h-10 text-base shadow-md shadow-primary/20 rounded-full"
                    onClick={() => scrollTo(slides[current].target)}
                  >
                    {slides[current].cta}
                  </Button>
                  <Button
                    size="default"
                    variant="outline"
                    className="border border-primary text-primary hover:bg-primary hover:text-white px-6 h-10 text-base shadow-sm rounded-full bg-transparent"
                    onClick={() => scrollTo('contact')}
                  >
                    Enquire / Apply
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls - More compact */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <button
          onClick={prev}
          className="p-1.5 rounded-full border border-border/40 bg-background/40 backdrop-blur-sm hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${current === i ? "w-6 bg-primary" : "w-1.5 bg-primary/20"
                }`}
            />
          ))}
        </div>

        <button
          onClick={next}
          className="p-1.5 rounded-full border border-border/40 bg-background/40 backdrop-blur-sm hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
