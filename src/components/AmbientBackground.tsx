"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AmbientBackground() {
    const [petals, setPetals] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; rotation: number; swing: number }[]>([]);

    useEffect(() => {
        // Generate rose petals
        const newPetals = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // vw
            y: -10 - Math.random() * 20, // start above screen
            size: Math.random() * 8 + 6, // smaller size: 6px to 14px
            duration: Math.random() * 6 + 5, // slightly faster
            delay: Math.random() * 10, // s
            rotation: Math.random() * 360,
            swing: Math.random() * 30 - 15, // horizontal swing
        }));
        setPetals(newPetals);
    }, []);

    return (
        <>
            {/* Base Layer: Background Gradient & Glows */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: -1,
                    overflow: "hidden",
                    background: "linear-gradient(135deg, var(--color-royal-blue) 0%, #000B1A 100%)",
                }}
            >
                {/* Texture Overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.15,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        mixBlendMode: "overlay",
                    }}
                />

                {/* Royal Glows */}
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-10%",
                        width: "70vw",
                        height: "70vw",
                        background: "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
                        filter: "blur(100px)",
                    }}
                />
            </div>

            {/* Overlay Layer: Falling Rose Petals */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    pointerEvents: "none",
                    zIndex: 2000,
                    overflow: "hidden",
                }}
            >
                {petals.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{
                            opacity: 0,
                            y: `${p.y}vh`,
                            x: `${p.x}vw`,
                            rotate: p.rotation
                        }}
                        animate={{
                            opacity: [0, 0.8, 0.8, 0],
                            y: ["-10vh", "110vh"],
                            x: [`${p.x}vw`, `${p.x + p.swing}vw`, `${p.x}vw`],
                            rotate: p.rotation + 360
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "linear",
                        }}
                        style={{
                            position: "absolute",
                            width: p.size,
                            height: p.size * 0.8,
                            backgroundColor: "var(--color-royal-red)",
                            borderRadius: "50% 0 50% 50%", // Petal shape
                            boxShadow: "0 0 10px rgba(155, 17, 30, 0.4)",
                            filter: "blur(0.5px)",
                            willChange: "transform",
                        }}
                    />
                ))}
            </div>
        </>
    );
}
