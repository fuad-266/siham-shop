import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Shop',
            links: [
                { name: 'All Products', href: '/products' },
                { name: 'New Arrivals', href: '/products?sort=newest' },
                { name: 'Casual Abayas', href: '/products?category=casual' },
                { name: 'Formal Abayas', href: '/products?category=formal' },
            ],
        },
        {
            title: 'Customer Service',
            links: [
                { name: 'Track Order', href: '/orders' },
                { name: 'Shipping Info', href: '#' },
                { name: 'Returns & Exchanges', href: '#' },
                { name: 'FAQ', href: '#' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Privacy Policy', href: '#' },
            ],
        },
    ];

    return (
        <footer className="bg-brand-950 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <span className="text-2xl font-display font-semibold tracking-tight text-white">
                                ALORA <span className="text-gold-500">ABAYAS</span>
                            </span>
                        </Link>
                        <p className="text-brand-200 text-sm leading-relaxed max-w-xs">
                            Elegance in every fold. We provide premium quality abayas that blend traditional grace with modern sophistication for the contemporary woman.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-brand-900 rounded-full hover:bg-gold-600 transition-colors">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {footerLinks.map((column) => (
                        <div key={column.title} className="space-y-6">
                            <h4 className="text-lg font-medium text-gold-500">{column.title}</h4>
                            <ul className="space-y-4">
                                {column.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-brand-200 hover:text-white transition-colors text-sm"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact Column */}
                    <div className="space-y-6">
                        <h4 className="text-lg font-medium text-gold-500">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-brand-200">
                                <MapPin size={18} className="text-gold-600 shrink-0" />
                                <span>Bole, Addis Ababa, Ethiopia</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-brand-200">
                                <Phone size={18} className="text-gold-600 shrink-0" />
                                <span>+251 911 234 567</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-brand-200">
                                <Mail size={18} className="text-gold-600 shrink-0" />
                                <span>info@alora-abayas.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-900 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-brand-400 text-xs">
                        © {currentYear} Alora Abayas. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
