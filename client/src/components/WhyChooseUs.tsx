import { motion } from "framer-motion";
import { BookOpen, Zap, Target, Award } from "lucide-react";

const reasons = [
    {
        icon: BookOpen,
        title: "Practical Learning",
        description: "Focus on hands-on projects and real-world applications. Learn by doing, not just theory."
    },
    {
        icon: Zap,
        title: "Modern Tools",
        description: "Master AI and digital tools used by global companies. Stay ahead with cutting-edge technology."
    },
    {
        icon: Target,
        title: "Clear Weekly Deliverables",
        description: "Track your progress with structured milestones. Build a professional portfolio as you learn."
    },
    {
        icon: Award,
        title: "Professional Work Standards",
        description: "Learn industry best practices and professional workflows. Be ready to earn from day one."
    }
];

export function WhyChooseUs() {
    return (
        <section className="py-12 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                            Why Choose <span className="text-primary">Us</span>
                        </h2>
                        {/* <div className="w-20 h-1 bg-primary mx-auto mb-6"></div> */}
                        <div className="max-w-3xl mx-auto">
                            {/* <p className="text-lg font-semibold text-foreground mb-2">
                                Why Institute of Innovative Minds
                            </p> */}
                            <p className="text-muted-foreground leading-relaxed">
                                We focus on practical learning, modern tools, clear weekly deliverables, and professional work standards.
                                Our programs are designed to help learners become ready to earn—either by starting something on their own
                                or by supporting clients remotely with confidence.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Reasons */}
                    <div className="space-y-4">
                        {reasons.map((reason, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group relative bg-white border border-border/60 rounded-lg p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300"
                            >
                                {/* Content */}
                                <div className="relative flex items-start gap-4">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300">
                                        <reason.icon className="w-6 h-6" />
                                    </div>

                                    {/* Text */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-display font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {reason.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {reason.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right Side - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/40">
                            {/* Image */}
                            <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 via-slate-50 to-slate-100">
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800"
                                    alt="Students learning together"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                        </div>

                        {/* Floating Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-border/60 p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">500+</span>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Active</p>
                                    <p className="text-sm font-bold text-foreground">Students</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
