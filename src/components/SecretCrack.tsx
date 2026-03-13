"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MemoryGallery from "@/components/MemoryGallery";

export default function SecretCrack({ letterId }: { letterId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={{ margin: "3rem 0", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            padding: "2rem",
                            width: "100%"
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => setIsOpen(true)}
                    >
                        {/* The Pulsing Crack */}
                        <motion.div
                            animate={{
                                width: isHovered ? "120px" : "100px",
                                height: isHovered ? "4px" : "2px",
                                opacity: [0.4, 0.8, 0.4],
                                boxShadow: [
                                    "0 0 0px rgba(212,175,55,0)",
                                    "0 0 15px rgba(212,175,55,0.5)",
                                    "0 0 0px rgba(212,175,55,0)"
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            style={{
                                backgroundColor: "var(--color-gold-muted)",
                                borderRadius: "50%",
                                position: "relative",
                            }}
                        >
                            {/* Inner Glow */}
                            <div style={{
                                position: "absolute",
                                inset: -2,
                                background: "var(--color-gold)",
                                filter: "blur(4px)",
                                opacity: 0.5,
                                borderRadius: "inherit"
                            }} />
                        </motion.div>

                        <motion.span
                            initial={{ opacity: 0.3 }}
                            animate={{ opacity: isHovered ? 1 : 0.4, y: isHovered ? 5 : 0 }}
                            style={{
                                marginTop: "1rem",
                                fontFamily: "var(--font-serif)",
                                fontSize: "0.85rem",
                                color: "var(--color-gold-muted)",
                                letterSpacing: "0.1em",
                                fontStyle: "italic",
                                textAlign: "center",
                                transition: "all 0.3s ease"
                            }}
                        >
                            {isHovered ? "Open the memories hidden within..." : "Something more is hidden here..."}
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
