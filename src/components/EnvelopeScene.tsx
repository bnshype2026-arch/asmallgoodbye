"use client";

import { motion } from "framer-motion";

interface EnvelopeSceneProps {
    isZoomed: boolean;
    onClick?: () => void;
}

export default function EnvelopeScene({ isZoomed, onClick }: EnvelopeSceneProps) {
    return (
        <motion.div
            onClick={onClick}
            animate={{
                scale: isZoomed ? 1.5 : 1.1,
                y: isZoomed ? 60 : 0,
            }}
            transition={{ duration: 0.8, ease: "easeOut" }} // Swift transition
            style={{
                position: "relative",
                width: "min(320px, 90vw)",
                aspectRatio: "320/210",
                cursor: onClick ? "pointer" : "default",
                perspective: "1200px",
                zIndex: 10,
            }}
        >
            {/* Royal Glow */}
            <motion.div
                animate={{
                    opacity: isZoomed ? 0 : [0.3, 0.5, 0.3],
                    scale: isZoomed ? 0.8 : [1, 1.2, 1],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: "absolute",
                    inset: -40,
                    background: "radial-gradient(ellipse at center, rgba(212,175,55,0.25) 0%, transparent 70%)",
                    filter: "blur(30px)",
                    zIndex: -1,
                    pointerEvents: "none"
                }}
            />

            {/* Floating animation wrapper */}
            <motion.div
                animate={
                    !isZoomed
                        ? {
                            y: [-10, 10, -10],
                            rotateX: [2, -2, 2],
                            rotateY: [-4, 4, -4],
                        }
                        : {
                            y: 0,
                            rotateX: 10,
                            rotateY: 0,
                        }
                }
                transition={{
                    duration: 5,
                    repeat: isZoomed ? 0 : Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    transformStyle: "preserve-3d",
                }}
            >
                {/* Envelope Body */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "var(--color-royal-blue-light)",
                        borderRadius: "8px",
                        boxShadow: isZoomed
                            ? "0 40px 100px rgba(0,0,0,0.6)"
                            : "0 20px 40px rgba(0,0,0,0.4), inset 0 0 50px rgba(0,0,0,0.2)",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.2'/%3E%3C/svg%3E")`,
                        transition: "box-shadow 0.8s ease",
                        overflow: "hidden",
                        border: "1px solid rgba(212,175,55,0.3)"
                    }}
                >
                    {/* Gold Leaf Border */}
                    <div style={{
                        position: "absolute",
                        inset: "10px",
                        border: "2px solid rgba(212,175,55,0.5)",
                        borderRadius: "4px",
                        pointerEvents: "none",
                    }} />

                    {/* Fold Lines */}
                    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.3 }}>
                        <defs>
                            <filter id="gold-shadow">
                                <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
                            </filter>
                        </defs>
                        <path d="M 0 0 L 160 115 L 320 0" fill="transparent" stroke="var(--color-gold-muted)" strokeWidth="2" filter="url(#gold-shadow)" />
                        <path d="M 0 210 L 160 95 L 320 210" fill="transparent" stroke="var(--color-gold-muted)" strokeWidth="1" />
                    </svg>

                    {/* Royal Red Ribbon */}
                    <div style={{
                        position: "absolute",
                        left: "45px",
                        top: 0,
                        bottom: 0,
                        width: "14px",
                        backgroundColor: "var(--color-royal-red)",
                        boxShadow: "2px 0 10px rgba(0,0,0,0.3), inset -2px 0 5px rgba(0,0,0,0.4)",
                    }} />

                    {/* Faux Stamp */}
                    <div style={{
                        position: "absolute",
                        top: "25px",
                        right: "25px",
                        width: "40px",
                        height: "50px",
                        backgroundColor: "var(--color-gold-muted)",
                        border: "1px solid var(--color-gold)",
                        padding: "4px",
                        opacity: 0.9,
                        transform: "rotate(5deg)",
                        boxShadow: "3px 3px 6px rgba(0,0,0,0.3)"
                    }}>
                        <div style={{ width: "100%", height: "100%", border: "1px dashed rgba(0,0,0,0.2)", borderRadius: "2px" }} />
                    </div>

                    {/* Royal Wax Seal */}
                    <div
                        style={{
                            position: "absolute",
                            top: "105px",
                            left: "160px",
                            transform: "translate(-50%, -50%)",
                            width: "60px",
                            height: "60px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-royal-red-dark)",
                            boxShadow: "inset 0 4px 10px rgba(255,50,50,0.2), inset 0 -4px 10px rgba(0,0,0,0.6), 0 10px 20px rgba(0,0,0,0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                        }}
                    >
                        <div style={{
                            position: "absolute",
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            border: "2px solid rgba(212,175,55,0.3)",
                            boxShadow: "inset 0 0 8px rgba(0,0,0,0.3)"
                        }} />
                        <span style={{
                            color: "var(--color-gold)",
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.8rem",
                            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                            fontWeight: "bold"
                        }}>R</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
