import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import slide1 from "@assets/stock_images/modern_professional__a4fbdcd8.jpg";
import slide2 from "@assets/stock_images/online_learning_stud_8b64d313.jpg";
import slide3 from "@assets/stock_images/young_entrepreneurs__0f08b7cc.jpg";
import slide4 from "@assets/stock_images/digital_professional_a6e74f03.jpg";

const slides = [
  {
    image: slide1,
    title: "Master Remote Work",
    description: "Learn the skills to work for global companies from anywhere in Sri Lanka.",
    cta: "View Programs",
    target: "programs"
  },
  {
    image: slide2,
    title: "Virtual Classrooms",
    description: "Experience modern education with live sessions and practical portfolio work.",
    cta: "How It Works",
    target: "about"
  },
  {
    image: slide3,
    title: "Empower Your Innovation",
    description: "From digital entrepreneurship to AI tools, build your business today.",
    cta: "Start Now",
    target: "contact"
  },
  {
    image: slide4,
    title: "Join the Digital Economy",
    description: "Bridge the gap between education and modern professional work.",
    cta: "Learn More",
    target: "about"
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative h-[450px] md:h-[550px] w-full overflow-hidden bg-secondary/10">
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
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[8s] scale-105"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          
          {/* Overlay - Brighter, more compact wash */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          
          {/* Content - More compact alignment */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pt-8">
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="inline-block py-0.5 px-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold mb-3 uppercase tracking-wider">
                  IIM Sri Lanka Virtual Campus
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold leading-[1.1] mb-4 text-foreground">
                  {slides[current].title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-snug">
                  {slides[current].description}
                </p>
                <div className="flex gap-3">
                  <Button 
                    size="default" 
                    className="bg-primary hover:bg-primary/90 text-white px-6 h-10 text-base shadow-md shadow-primary/20 rounded-full"
                    onClick={() => scrollTo(slides[current].target)}
                  >
                    {slides[current].cta}
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
              className={`h-1.5 rounded-full transition-all duration-300 ${
                current === i ? "w-6 bg-primary" : "w-1.5 bg-primary/20"
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
