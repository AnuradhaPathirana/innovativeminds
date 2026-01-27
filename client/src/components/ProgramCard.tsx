import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ImageIcon, Clock, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgramCardProps {
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  image?: string | null;
  duration?: string | null;
  deliveryMode?: string | null;
  onSelect: () => void;
  index: number;
}

export function ProgramCard({ title, description, features, icon, image, duration, deliveryMode, onSelect, index }: ProgramCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative bg-white border border-border/60 rounded-lg overflow-hidden hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col h-full"
    >
      {/* Program Image - Fixed aspect ratio for consistent height */}
      <div className="relative w-full flex-shrink-0 overflow-hidden bg-slate-100 aspect-[16/10]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <ImageIcon className="w-10 h-10 text-primary/30" />
          </div>
        )}

        {/* Bottom gradient overlay with Duration & Delivery Mode */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent pt-8 pb-2 px-3">
          <div className="flex items-center justify-between gap-2">
            {/* Duration Badge */}
            {duration && (
              <div className="flex items-center gap-1.5 text-white/90">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-medium">{duration}</span>
              </div>
            )}

            {/* Delivery Mode Badge */}
            <div className="flex items-center gap-1.5 text-white/90">
              <Monitor className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{deliveryMode || "Online"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Text Content Area - Fixed structure for consistent alignment */}
      <div className="relative z-10 flex flex-col flex-grow p-4 md:p-5">
        {/* Title Section - Fixed min-height */}
        <div className="flex items-start gap-3 mb-3 min-h-[48px]">
          <div className="flex-shrink-0 flex items-center justify-center p-2 rounded-md bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors duration-200">
            {icon}
          </div>
          <h3 className="text-base font-display font-bold group-hover:text-primary transition-colors leading-tight line-clamp-2">{title}</h3>
        </div>

        {/* Description - Fixed height with line-clamp */}
        <p className="text-muted-foreground text-[12px] mb-4 leading-relaxed line-clamp-2 min-h-[36px]">
          {description}
        </p>

        {/* Features List - Fixed height */}
        <ul className="space-y-1 mb-5 min-h-[60px]">
          {features.slice(0, 3).map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground/80">
              <CheckCircle2 className="w-3 h-3 text-primary/70 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Button - Always at bottom */}
        <div className="mt-auto">
          <Button
            onClick={onSelect}
            variant="outline"
            size="sm"
            className="w-full rounded-md border-border/60 hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 text-[11px] h-8 font-medium"
          >
            View Details
            <ArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
