import { Link } from "wouter";
import { usePopularPrograms } from "@/hooks/use-programs";
import {
    Mail,
    Phone,
    PhoneCall,
    MapPin,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Heart,
    ExternalLink
} from "lucide-react";
import footerLogo from "../assets/footer-logo.jpeg";

export function Footer() {
    const { data: popularPrograms, isLoading } = usePopularPrograms();

    const quickLinks = [
        { label: "Home", href: "/" },
        { label: "Programs", href: "/#programs" },
        { label: "About", href: "/#about" },
        { label: "Contact", href: "/#contact" },
        { label: "Admin Portal", href: "/admin" },
    ];

    return (
        <footer className="bg-black text-white">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                    {/* Column 1: About */}
                    <div className="lg:col-span-1">
                        <div className="mb-4">
                            {/* Logo Image */}
                            <div className="mb-4">
                                <img
                                    src={footerLogo}
                                    alt="Innovative Minds Logo"
                                    className="w-auto rounded-lg" style={{ height: '6rem' }}
                                />
                            </div>
                            {/* Description */}
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Empowering Sri Lanka's next generation of digital professionals through practical training programs for the modern remote economy.
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-lg font-display font-semibold mb-4 text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith("/admin") ? (
                                        <Link href={link.href}>
                                            <a className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-1">
                                                {link.label}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            className="text-slate-400 hover:text-primary transition-colors text-sm"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Popular Programs */}
                    <div>
                        <h4 className="text-lg font-display font-semibold mb-4 text-white">
                            Popular Programs
                        </h4>
                        <ul className="space-y-3">
                            {isLoading ? (
                                <li className="text-slate-500 text-sm animate-pulse">Loading programs...</li>
                            ) : popularPrograms && popularPrograms.length > 0 ? (
                                popularPrograms.map((program) => (
                                    <li key={program.id}>
                                        <a
                                            href="/#programs"
                                            className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center justify-between group"
                                        >
                                            <span className="line-clamp-1 flex-1 group-hover:text-primary">
                                                {program.title}
                                            </span>
                                            {/* {program.enquiryCount > 0 && (
                                                <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                                                    {program.enquiryCount}
                                                </span> 
                                            )} */}
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <li className="text-slate-500 text-sm">No popular programs found.</li>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-lg font-display font-semibold mb-4 text-white">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="mailto:Info@innovativeminds.lk"
                                    className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4 text-primary" />
                                    Info@innovativeminds.lk
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+94705000425"
                                    className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
                                >
                                    <Phone className="w-4 h-4 text-primary" />
                                    +94 70 5000 425
                                </a>
                            </li>
                            <li>
                                <a
                                    href="tel:+94112345678"
                                    className="text-slate-400 hover:text-primary transition-colors text-sm flex items-center gap-2"
                                >
                                    <PhoneCall className="w-4 h-4 text-primary" />
                                    +94 70 6000 425
                                </a>
                            </li>
                            {/* <li className="text-slate-400 text-sm flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Colombo, Sri Lanka
                            </li> */}
                        </ul>

                        {/* Social Media Icons */}
                        <div className="flex items-center gap-3 mt-6">
                            <a
                                href="https://web.facebook.com/innovativeminds.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/innovativemindscampus/posts/?feedView=all&viewAsMember=true"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            {/* <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                            >
                                <Instagram className="w-4 h-4" />
                            </a> */}
                            {/* <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Copyright */}
                        <div className="text-slate-500 text-sm">
                            © 2026 innovativeminds. All rights reserved.
                        </div>

                        {/* Links */}
                        {/* <div className="flex items-center gap-4 text-sm">
                            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
                                Privacy Policy
                            </a>
                            <span className="text-slate-700">|</span>
                            <a href="#" className="text-slate-500 hover:text-primary transition-colors">
                                Terms of Service
                            </a>
                        </div> */}

                        {/* Made with love */}
                        <div className="text-slate-500 text-sm flex items-center gap-1">
                            Designed with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Sri Lanka
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
