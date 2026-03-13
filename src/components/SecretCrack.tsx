"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryGallery from "@/components/MemoryGallery";

export default function SecretCrack({ letterId }: { letterId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{
                margin: "4rem 0",
                position: "relative",
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
                        style={{
                            cursor: "pointer",
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsOpen(true)}
                    >
                        {/* The Growing Crack */}
                        <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                            <motion.div
                                animate={{
                                    width: isHovered ? ["40px", "240px", "40px"] : ["20px", "140px", "20px"],
                                    opacity: [0.1, 0.4, 0.1],
                                }}
                                transition={{
                                    duration: isHovered ? 2 : 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                style={{
                                    height: "1px",
                                    backgroundColor: "var(--color-gold)",
                                    boxShadow: "0 0 15px 2px rgba(212,175,55,0.4)",
                                    borderRadius: "50%",
                                    position: "relative",
                                    zIndex: 1
                                }}
                            >
                                {/* Center Glow Slit */}
                                <motion.div
                                    animate={{
                                        width: isHovered ? ["10px", "60px", "10px"] : ["5px", "30px", "5px"],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        top: "50%",
                                        transform: "translate(-50%, -50%)",
                                        height: "2px",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 0 20px 5px var(--color-gold)",
                                        borderRadius: "50%"
                                    }}
                                />
                            </motion.div>
                        </div>

                        <motion.span
                            animate={{
                                opacity: isHovered ? [0.8, 1, 0.8] : [0.5, 0.8, 0.5],
                                scale: isHovered ? [1, 1.05, 1] : 1
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            style={{
                                marginTop: "1.5rem",
                                fontFamily: "var(--font-serif)",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "var(--color-royal-blue)",
                                letterSpacing: "0.1em",
                                fontStyle: "italic",
                                textAlign: "center",
                                transition: "all 0.3s ease",
                            }}
                        >
                            {isHovered ? "Open the memories hidden within..." : "Tap here to unlock the hidden memories..."}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                    >
                        <div style={{
                            position: "relative",
                            padding: "2rem 0",
                            marginTop: "2rem",
                            borderTop: "1px dashed rgba(212,175,55,0.3)",
                            borderBottom: "1px dashed rgba(212,175,55,0.3)"
                        }}>
                            <h4 style={{
                                fontFamily: "var(--font-serif)",
                                textAlign: "center",
                                color: "var(--color-gold-muted)",
                                marginBottom: "2rem",
                                fontSize: "1.2rem",
                                letterSpacing: "0.1em"
                            }}>
                                Memories
                            </h4>

                            <MemoryGallery letterId={letterId} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
