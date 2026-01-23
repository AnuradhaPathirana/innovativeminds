import { motion } from "framer-motion";
import { UserPlus, Video, FileCheck, Award } from "lucide-react";

const steps = [
    {
        number: 1,
        icon: UserPlus,
        title: "Register",
        description: "Choose your certificate program and register for the next intake."
    },
    {
        number: 2,
        icon: Video,
        title: "Attend Sessions",
        description: "Attend live online sessions with guided practical work."
    },
    {
        number: 3,
        icon: FileCheck,
        title: "Submit Portfolio",
        description: "Complete weekly deliverables and submit your final portfolio."
    },
    {
        number: 4,
        icon: Award,
        title: "Get Certified",
        description: "Certificates are issued upon successful completion of required outputs."
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-8 md:py-8 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    {/* Decorative Icon */}
                    {/* <div className="flex justify-center mb-4"> */}
                    {/* <svg */}
                    {/* className="w-8 h-8 text-primary" */}
                    {/* viewBox="0 0 24 24" */}
                    {/* fill="none" */}
                    {/* stroke="currentColor" */}
                    {/* strokeWidth="2" */}
                    {/* > */}
                    {/* <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" /> */}
                    {/* </svg> */}
                    {/* </div> */}

                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                        How Our <span className="text-primary">Virtual Campus</span> Works
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Our streamlined process makes it easy to start your learning journey and achieve your professional goals.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative">
                    {/* Connecting Line - Desktop */}
                    <div className="hidden lg:block absolute top-[60px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-slate-300" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                {/* Icon Circle - Animated Container */}
                                <motion.div
                                    className="relative mb-6"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: index * 0.8,
                                        repeatDelay: 2.4,
                                    }}
                                >
                                    {/* Step Number Badge */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold shadow-md">
                                            {step.number}
                                        </span>
                                    </div>

                                    {/* Outer dashed circle */}
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-white relative z-10">
                                        {/* Inner solid circle with icon */}
                                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <step.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Title - Animated */}
                                <motion.h3
                                    className="text-lg font-display font-bold mb-2"
                                    animate={{
                                        color: ["hsl(var(--foreground))", "hsl(142.1, 76.2%, 36.3%)", "hsl(var(--foreground))"],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: index * 0.8,
                                        repeatDelay: 2.4,
                                    }}
                                >
                                    {step.title}
                                </motion.h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
