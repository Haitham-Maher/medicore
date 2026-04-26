"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer id="contact" className="bg-[hsl(var(--background))] pt-20" dir="rtl">
            <div className="container mx-auto px-6">
                {/* ─── Call to Action Section (The Image Design) ─── */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] bg-emerald-600 overflow-hidden p-12 md:p-20 text-center text-white mb-20 shadow-2xl shadow-emerald-900/20"
                >
                    {/* Decorative Background Circles */}
                    <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-emerald-500/30 blur-3xl"></div>
                    <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl"></div>

                    <div className="relative z-10">
                        {/* Top Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8 backdrop-blur-md">
                            <Sparkles size={14} className="text-emerald-300" />
                            <span>هل أنت مستعد للبدء؟</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-3xl md:text-6xl font-black mb-8 leading-tight max-w-4xl mx-auto">
                            ابدأ بإدارة نقاطك الطبية ومخزون الأدوية بنظام مركزي قوي
                        </h2>

                        <p className="text-emerald-50/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                            انضم إلى المؤسسات الصحية التي تثق في Medicore لإدارة شبكتها الطبية بكفاءة وأمان تام.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <button className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors group shadow-lg">
                                <span>ابدأ الآن</span>
                                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full sm:w-auto px-8 py-4 bg-emerald-700/50 border border-white/20 text-white font-bold rounded-2xl hover:bg-emerald-700/70 transition-colors backdrop-blur-sm">
                                طلب عرض تجريبي
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-white/10">
                            <div>
                                <div className="text-3xl md:text-4xl font-black mb-1">+50</div>
                                <div className="text-emerald-100/70 text-sm">نقطة طبية</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black mb-1">+200</div>
                                <div className="text-emerald-100/70 text-sm">طبيب متصل</div>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-black mb-1">99.9%</div>
                                <div className="text-emerald-100/70 text-sm">نسبة التشغيل</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ─── Main Footer Content ─── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-[hsl(var(--border))]">
                    {/* Logo & Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-white font-black text-xl">M</span>
                            </div>
                            <span className="text-2xl font-black text-[hsl(var(--foreground))]">Medicore</span>
                        </div>
                        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-sm">
                            نظام متكامل لإدارة النقاط الطبية يسمح للمؤسسات الصحية بإدارة العيادات، الأطباء، الأقسام، ومخزون الأدوية من منصة مركزية واحدة.
                        </p>
                        {/* Tech Badges */}
                        <div className="flex flex-wrap gap-2">
                            <TechBadge label="Next.js" />
                            <TechBadge label="React" />
                            <TechBadge label="TailwindCSS" />
                            <TechBadge label="Laravel" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6 underline decoration-emerald-500 underline-offset-8 decoration-2">روابط سريعة</h4>
                        <ul className="space-y-4">
                            <FooterLink label="المميزات" />
                            <FooterLink label="لوحة التحكم" />
                            <FooterLink label="الفريق" />
                            <FooterLink label="ابدأ الآن" />
                        </ul>
                    </div>

                    {/* Developers Column */}
                    <div>
                        <h4 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6 underline decoration-emerald-500 underline-offset-8 decoration-2">المطورون</h4>
                        <ul className="space-y-4">
                            <li className="text-[hsl(var(--muted-foreground))] text-sm">هيثم ماهر - Frontend</li>
                            <li className="text-[hsl(var(--muted-foreground))] text-sm">جميل حلمي - Backend</li>
                            <li className="text-[hsl(var(--muted-foreground))] text-sm">عاطف صرصور - Backend</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6 underline decoration-emerald-500 underline-offset-8 decoration-2">تواصل معنا</h4>
                        <ContactItem icon={<Mail size={18} />} content="info@medicore.com" />
                        <ContactItem icon={<Phone size={18} />} content="+123 456 7890" />
                        <ContactItem icon={<MapPin size={18} />} content="غزة، فلسطين" />
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 flex flex-col md:flex-row items-center justify-between text-[hsl(var(--muted-foreground))] text-sm gap-4">
                    <p>© {new Date().getFullYear()} Medicore. جميع الحقوق محفوظة.</p>
                    <div className="flex items-center gap-2">
                        <span>تم التطوير بـ</span>
                        <span className="text-red-500">❤️</span>
                        <span>بواسطة فريق Medicore</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const TechBadge = ({ label }: { label: string }) => (
    <span className="px-2 py-1 rounded-md bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] text-[10px] font-medium">
        {label}
    </span>
);

const FooterLink = ({ label }: { label: string }) => (
    <li>
        <a href="#" className="text-[hsl(var(--muted-foreground))] hover:text-emerald-500 transition-colors flex items-center gap-2 group">
            <div className="w-1 h-1 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {label}
        </a>
    </li>
);

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <button className="w-10 h-10 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:bg-emerald-500 hover:text-white transition-all border border-[hsl(var(--border))]">
        {icon}
    </button>
);

const ContactItem = ({ icon, content }: { icon: React.ReactNode, content: string }) => (
    <div className="flex items-start gap-3 group translate-x-0 cursor-pointer">
        <div className="p-2 rounded-lg bg-[hsl(var(--secondary))] text-emerald-500 border border-[hsl(var(--border))] group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
            {icon}
        </div>
        <span className="text-[hsl(var(--muted-foreground))] text-sm pt-1">{content}</span>
    </div>
);
