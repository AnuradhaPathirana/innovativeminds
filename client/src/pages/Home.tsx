import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { HeroSlider } from "@/components/HeroSlider";
import { ProgramCard } from "@/components/ProgramCard";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ProgramModal } from "@/components/ProgramModal";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { usePrograms, Program } from "@/hooks/use-programs";
import { Laptop, Briefcase, Bot, ShoppingCart, Globe, FileSpreadsheet, Lightbulb, ArrowRight, Check, Rocket, Award, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Icon mapping for database programs
const iconMap: Record<string, React.ReactNode> = {
  Laptop: <Laptop className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Bot: <Bot className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  ShoppingCart: <ShoppingCart className="w-6 h-6" />,
  FileSpreadsheet: <FileSpreadsheet className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  Rocket: <Rocket className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
};

// Static content data
const features = [
  {
    icon: <Laptop className="w-6 h-6" />,
    title: "100% Virtual Learning",
    description: "Learn from anywhere in Sri Lanka with our fully remote campus infrastructure."
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Job-Ready Skills",
    description: "Curriculum designed specifically for modern remote work and digital entrepreneurship."
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Practical Certification",
    description: "Earn certificates backed by portfolio projects that prove your competence to employers."
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: "Entrepreneurship Focus",
    description: "Don't just find a job—create one. We teach you how to build your own digital business."
  }
];

export default function Home() {
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [modalProgram, setModalProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: programs, isLoading: programsLoading, error: programsError } = usePrograms();

  const scrollToForm = (program?: string) => {
    if (program) setSelectedProgram(program);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openProgramModal = (program: Program) => {
    setModalProgram(program);
    setIsModalOpen(true);
  };

  const closeProgramModal = () => {
    setIsModalOpen(false);
  };

  const handleEnquireFromModal = (programTitle: string) => {
    setSelectedProgram(programTitle);
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navigation />

      <HeroSlider />

      {/* Stats/Trust Bar - Tighter spacing */}
      <section className="border-y border-border bg-secondary/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-left">
                <div className="flex-shrink-0 p-2 bg-white/50 rounded-lg text-primary shadow-sm border border-border/40">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">{feature.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-tight">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section - Refined for high readability and compact layout */}
      <section id="programs" className="py-8 md:py-8 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-border/40 pb-6">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Our <span className="text-primary">Programs</span></h2>
              <p className="text-muted-foreground text-[13px] leading-relaxed">
                Specialized professional certifications designed for the modern remote economy. Practical, industry-led training.
              </p>
            </div>
            <div className="hidden md:block">
              <Button variant="ghost" className="text-xs text-primary font-medium hover:bg-primary/5" onClick={() => scrollToForm('General Enquiry')}>
                View All Requirements
                <ArrowRight className="ml-2 w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-4">
            {programsLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : programsError ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Failed to load programs. Please refresh the page.
              </div>
            ) : programs && programs.length > 0 ? (
              programs.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  index={index}
                  title={program.title}
                  description={program.description}
                  features={program.features}
                  icon={iconMap[program.icon] || <Laptop className="w-6 h-6" />}
                  image={program.image}
                  duration={program.duration}
                  deliveryMode={program.delivery_mode}
                  onSelect={() => openProgramModal(program)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No programs available at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Join 500+ Students - Community Trust Section */}
      <section id="about" className="py-8 md:py-8 px-4 sm:px-6 lg:px-8 bg-secondary/5  border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="inline-block py-0.5 px-2 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-4">
                Community & Trust
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">Join <span className="text-primary">500+</span> Students Building the Future</h2>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-lg">
                Become part of Sri Lanka's fastest-growing community of modern professionals. We don't just teach skills; we build careers through collaboration and shared success.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Practical Learning", text: "Hands-on projects that mirror real-world workplace tasks." },
                  { title: "Modern Tool Stack", text: "Master AI and digital tools used by global companies." },
                  { title: "Global Portfolio", text: "Graduate with a professional portfolio ready for clients." },
                  { title: "Active Community", text: "Lifelong access to our network of alumni and mentors." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-white/50 border border-border/40">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold mb-0.5">{item.title}</h3>
                      <p className="text-[11px] text-muted-foreground leading-tight">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-green-400/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
                  alt="Students Collaborating"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-secondary flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="Student" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">
                      +500
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white">
                    <p className="text-[10px] font-bold text-primary flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Active Intake Now Open
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Enquiry Section - Reduced padding */}
      <section id="contact" className="py-8 md:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/2 skew-y-1 transform origin-top-left -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">Ready to Transform<span className="text-primary"> Your Career</span></h2>
            <p className="text-base text-muted-foreground mb-6">
              To receive the course schedule, fees, and intake dates, contact us using the details below.
            </p>
            <div className="flex flex-col gap-2">
              {[
                "Scholarships available for eligible students",
                "Flexible payment plans",
                "Weekend and evening batch options"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check className="text-primary w-4 h-4" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <EnquiryForm selectedProgram={selectedProgram} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Program Details Modal */}
      <ProgramModal
        program={modalProgram}
        isOpen={isModalOpen}
        onClose={closeProgramModal}
        onEnquire={handleEnquireFromModal}
      />
    </div>
  );
}
