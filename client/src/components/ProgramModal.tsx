import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Clock, ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Program } from "@/hooks/use-programs";

// Icon imports for mapping
import {
    Laptop, Briefcase, Bot, ShoppingCart, Globe,
    FileSpreadsheet, Lightbulb, Rocket, Award, Users
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
    Laptop: <Laptop className="w-8 h-8" />,
    Briefcase: <Briefcase className="w-8 h-8" />,
    Bot: <Bot className="w-8 h-8" />,
    Globe: <Globe className="w-8 h-8" />,
    ShoppingCart: <ShoppingCart className="w-8 h-8" />,
    FileSpreadsheet: <FileSpreadsheet className="w-8 h-8" />,
    Lightbulb: <Lightbulb className="w-8 h-8" />,
    Rocket: <Rocket className="w-8 h-8" />,
    Award: <Award className="w-8 h-8" />,
    Users: <Users className="w-8 h-8" />,
    GraduationCap: <GraduationCap className="w-8 h-8" />,
};

interface ProgramModalProps {
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
    onEnquire: (programTitle: string) => void;
}

export function ProgramModal({ program, isOpen, onClose, onEnquire }: ProgramModalProps) {
    if (!program) return null;

    const handleEnquire = () => {
        onClose();
        setTimeout(() => {
            onEnquire(program.title);
        }, 100);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, type: "spring", damping: 25 }}
                        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-thin"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'rgba(0,0,0,0.2) transparent'
                        }}
                    >
                        {/* Program Image */}
                        {program.image && (
                            <div className="relative w-full overflow-hidden bg-slate-900">
                                <img
                                    src={program.image}
                                    alt={program.title}
                                    className="w-full h-auto"
                                />
                                {/* Gradient overlay - fades from transparent (top) to dark (bottom) */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white z-10"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                {/* Title overlay on image */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white">
                                            {iconMap[program.icon] || <Laptop className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight drop-shadow-lg">
                                                {program.title}
                                            </h2>
                                            {program.duration && (
                                                <div className="flex items-center gap-1.5 mt-2 text-white/90 text-sm drop-shadow-md">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Duration: {program.duration}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Header with gradient background (fallback when no image) */}
                        {!program.image && (
                            <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 pb-10">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-white/20 text-white">
                                        {iconMap[program.icon] || <Laptop className="w-8 h-8" />}
                                    </div>
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-display font-bold text-white leading-tight">
                                            {program.title}
                                        </h2>
                                        {program.duration && (
                                            <div className="flex items-center gap-1.5 mt-2 text-white/80 text-sm">
                                                <Clock className="w-4 h-4" />
                                                <span>Duration: {program.duration}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6 -mt-4 bg-white rounded-t-2xl relative">
                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-foreground mb-2">Programme Description</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {program.description}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-foreground mb-3">What You'll Learn</h3>
                                <ul className="space-y-2">
                                    {program.features?.map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <div className="mt-0.5 flex-shrink-0">
                                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                            </div>
                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>

                            {/* For Whom Section - Only show if data exists */}
                            {program.for_whom && program.for_whom.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-sm font-semibold text-foreground mb-3">For Whom</h3>
                                    <div className="p-4 bg-secondary/30 rounded-xl border border-border/40">
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {program.for_whom.join(", ")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            <div className="mb-8 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <h3 className="text-sm font-semibold text-foreground mb-2">Why Choose This Program?</h3>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                    <li>✨ 100% Online & Flexible Learning</li>
                                    <li>📜 Industry-Recognized Certification</li>
                                    <li>👨‍🏫 Expert Instructors</li>
                                    <li>💼 Job Placement Support</li>
                                </ul>
                            </div>

                            {/* CTA Button */}
                            <Button
                                onClick={handleEnquire}
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl py-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02]"
                            >
                                Enquire About This Program
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>

                            <p className="text-center text-xs text-muted-foreground mt-3">
                                Our admissions team will contact you within 24 hours
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
