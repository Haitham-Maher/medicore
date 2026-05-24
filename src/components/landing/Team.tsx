import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Github, Linkedin, Users } from 'lucide-react';


const developers = [
    {
        name: "عاطف صرصور",
        role: "مطور أنظمة خلفية",
        tech: "Laravel & PHP",
        image: "/images/atef.jpg",
        gradient: "from-purple-600 to-pink-500",
        shadow: "shadow-purple-500/20",
        badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        hoverGlow: "#9333ea",
        linkedin: "https://www.linkedin.com/in/atef-sarsour",
        github: "https://github.com/AtefSarsour",
        whatsapp: "https://wa.me/972566432004"
    },
    {
        name: "جميل أبو دلال",
        role: "مطور أنظمة خلفية",
        tech: "Laravel & PHP",
        image: "/images/jameel.jpeg",
        gradient: "from-blue-600 to-purple-600",
        shadow: "shadow-blue-500/20",
        badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        hoverGlow: "#2563eb",
        linkedin: "https://www.linkedin.com/in/jamil-abu-dalal-50ba29394/",
        github: "https://github.com/Jamil-Dalal",
        whatsapp: "https://wa.me/970567352090"
    },
    {
        name: "هيثم النملة",
        role: "مطور واجهات أمامية",
        tech: "Next.js & React",
        image: "/images/haitham.jpg",
        gradient: "from-emerald-500 to-teal-400",
        shadow: "shadow-emerald-500/20",
        badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        hoverGlow: "#10b981",
        linkedin: "https://www.linkedin.com/in/haitham-maher-5a872b368/",
        github: "https://github.com/Haitham-Maher",
        whatsapp: "https://wa.me/970592495102"
    }
];

const ProfileCard = ({ dev }: { dev: any }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [imageError, setImageError] = React.useState(false);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -10, boxShadow: `0 20px 60px ${dev.hoverGlow}33, 0 0 40px ${dev.hoverGlow}22` }}
            transition={{ duration: 0.3 }}
            className="group relative w-full rounded-[40px] bg-[hsl(var(--card))] dark:bg-black border border-[hsl(var(--border))] overflow-hidden shadow-xl cursor-pointer"
            dir="rtl"
        >
            {/* Spotlight Glow Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[40px] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(350px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 80%)`
                    ),
                }}
            />
            {/* الجزء العلوي الملون */}
            <div className={`relative h-32 w-full bg-linear-to-br ${dev.gradient} p-4`}>
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '12px 12px' }}>
                </div>
            </div>

            {/* الصورة الشخصية */}
            <div className="relative -mt-16 md:-mt-12 flex justify-center">
                <div className="p-1 rounded-full bg-[hsl(var(--card))]">
                    <div className={`rounded-full p-0.5 bg-linear-to-b ${dev.gradient}`}>
                        <div className="size-40 md:size-40 rounded-full overflow-hidden border-4 border-[hsl(var(--card))] bg-[hsl(var(--secondary))] flex items-center justify-center">
                            {imageError ? (
                                <span className={`text-6xl font-black text-transparent bg-clip-text bg-linear-to-br ${dev.gradient} select-none`}>
                                    {dev.name.split(' ').map((n: string) => n.charAt(0)).join('')}
                                </span>
                            ) : (
                                <img
                                    src={dev.image}
                                    alt={dev.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* المحتوى النصي */}
            <div className="p-6 pt-4 text-center">
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))] mb-1">{dev.name}</h3>
                <p className="text-[hsl(var(--muted-foreground))] text-sm mb-4">{dev.role}</p>

                {/* التكنولوجيا المستخدمة */}
                <div className={`inline-block px-5 py-1.5 rounded-full text-xs font-bold border ${dev.badgeColor} mb-6`}>
                    {dev.tech}
                </div>

                {/* خط فاصل مع شعاع متحرك */}
                <div className="w-full h-0.5 bg-[hsl(var(--border)/0.3)] mb-6 relative overflow-hidden rounded-full">
                </div>

                {/* أزرار التواصل */}
                <div className="flex justify-center gap-3">
                    <SocialIcon 
                        href={dev.whatsapp}
                        icon={
                            <svg viewBox="0 0 24 24" fontSize={18} className="size-4.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03c0 2.12.553 4.189 1.606 6.006L0 24l6.135-1.61a11.83 11.83 0 005.912 1.569h.005c6.632 0 12.032-5.4 12.035-12.032a11.85 11.85 0 00-3.48-8.504z"/>
                            </svg>
                        } 
                    />

                    <SocialIcon href={dev.linkedin} icon={<Linkedin size={18} />} />
                    <SocialIcon href={dev.github} icon={<Github size={18} />} />
                </div>
            </div>
        </motion.div>
    );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode; href?: string }) => (
    <motion.a
        href={href || "#"}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: .3 }}
        whileTap={{ scale: .9 }}
        className="p-3 rounded-full bg-[hsl(var(--secondary)/0.5)] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] cursor-pointer border border-[hsl(var(--border)/0.5)]"
    >
        {icon}
    </motion.a>
);

export default function DevTeam() {
    return (
        <section id="team" className="py-24 bg-[hsl(var(--background))]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    {/* Top Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold mb-8"
                    >
                        <Users size={16} />
                        <span>فريق التطوير</span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-[hsl(var(--foreground))] mb-8 leading-tight"
                    >
                        تعرف على <span className="text-teal-400">فريق</span> <span className="bg-linear-to-l from-sky-400 via-blue-500 to-indigo-900 bg-clip-text text-transparent drop-shadow-sm">التطوير</span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-[hsl(var(--muted-foreground))] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        نخبة من المطورين الذين جمعوا بين الشغف والخبرة لبناء نظام إدارة طبي يضمن لك أعلى معايير الأمان، السرعة، وتجربة المستخدم المذهلة.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center">
                    {developers.map((dev, index) => (
                        <ProfileCard key={index} dev={dev} />
                    ))}
                </div>
            </div>
        </section>
    );
}