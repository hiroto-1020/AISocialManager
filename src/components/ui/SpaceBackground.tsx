"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SpaceBackground({ children }: { children: React.ReactNode }) {
    const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number }[]>([]);
    const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

    useEffect(() => {
        // Static Stars (Twinkling)
        const newStars = Array.from({ length: 150 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 5,
        }));
        setStars(newStars);

        // Shooting Stars
        const newShootingStars = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 50, // Start from top half
            delay: Math.random() * 20, // Spread out over time
        }));
        setShootingStars(newShootingStars);
    }, []);

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#030305] text-white selection:bg-cyan-500/30">
            {/* Deep Space Gradient */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b1021] via-[#030305] to-[#000000]" />

            {/* Aurora Borealis Effect */}
            <motion.div
                className="fixed -top-1/2 -left-1/2 z-0 h-[200%] w-[200%] opacity-20 mix-blend-screen pointer-events-none"
                animate={{
                    rotate: [0, 360],
                }}
                transition={{
                    duration: 180,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    background: "conic-gradient(from 0deg at 50% 50%, #000000 0deg, #0c4a6e 60deg, #000000 120deg, #1e1b4b 180deg, #000000 240deg, #115e59 300deg, #000000 360deg)",
                    filter: "blur(100px)",
                }}
            />

            {/* Twinkling Stars */}
            {stars.map((star) => (
                <motion.div
                    key={star.id}
                    className="fixed z-0 rounded-full bg-white"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        width: star.size,
                        height: star.size,
                        boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.8)`
                    }}
                    animate={{
                        opacity: [0.2, 1, 0.2],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Shooting Stars */}
            {shootingStars.map((star) => (
                <motion.div
                    key={`shooting-${star.id}`}
                    className="fixed z-0 h-[1px] w-[120px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
                    style={{
                        left: `${star.x}%`,
                        top: `${star.y}%`,
                        rotate: "45deg",
                    }}
                    animate={{
                        x: [-100, 800],
                        y: [-100, 800],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 1.2,
                        delay: star.delay,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 15 + 10,
                        ease: "easeIn",
                    }}
                />
            ))}

            {/* Realistic Earth */}
            <motion.div
                className="fixed -bottom-64 -right-20 z-0 h-[600px] w-[600px] rounded-full pointer-events-none overflow-hidden"
                style={{
                    boxShadow: "inset -40px -40px 100px rgba(0,0,0,0.9), 0 0 50px rgba(75, 108, 183, 0.3)",
                }}
            >
                {/* Earth Texture Map */}
                <motion.div
                    className="absolute inset-0 h-full w-[200%]"
                    style={{
                        backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Solarsystemscope_texture_2k_earth_daymap.jpg/2560px-Solarsystemscope_texture_2k_earth_daymap.jpg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "repeat-x",
                    }}
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 120, // Rotation speed
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
                {/* Atmosphere Glow */}
                <div className="absolute inset-0 rounded-full opacity-50" style={{ boxShadow: "inset 0 0 60px rgba(100, 200, 255, 0.4)" }} />
            </motion.div>

            {/* Realistic Mars */}
            <motion.div
                className="fixed top-20 left-10 z-0 h-32 w-32 rounded-full pointer-events-none overflow-hidden"
                style={{
                    boxShadow: "inset -10px -10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(229, 93, 75, 0.3)",
                }}
                animate={{
                    x: [0, 40, 0],
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* Mars Texture Map */}
                <motion.div
                    className="absolute inset-0 h-full w-[200%]"
                    style={{
                        backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/1024px-OSIRIS_Mars_true_color.jpg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "repeat-x",
                    }}
                    animate={{
                        x: ["0%", "-50%"],
                    }}
                    transition={{
                        duration: 60,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </motion.div>

            {/* Floating Astronaut */}
            <motion.div
                className="fixed top-1/3 right-1/4 z-0 h-32 w-32 pointer-events-none"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                {/* Using a high quality SVG/Image for astronaut */}
                <img
                    src="https://cdn-icons-png.flaticon.com/512/2026/2026521.png"
                    alt="Astronaut"
                    className="w-full h-full object-contain brightness-125 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                />
            </motion.div>

            {/* Content Wrapper */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
