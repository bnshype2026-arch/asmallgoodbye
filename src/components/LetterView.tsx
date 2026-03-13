"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommentSection from "@/components/CommentSection";
import SecretCrack from "@/components/SecretCrack";

interface LetterViewProps {
    letterData: any;
    isOpening: boolean;
    onClose: () => void;
}

export default function LetterView({ letterData, isOpening, onClose }: LetterViewProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (!isOpening) {
            setShowContent(true);
        } else {
            const timer = setTimeout(() => setShowContent(true), 1200); // Wait for unfold (swifter)
            return () => clearTimeout(timer);
        }
    }, [isOpening]);

    const paperVariants: any = {
        hidden: {
            scaleY: 0.1,
            scaleX: 0.8,
            opacity: 0,
            y: 100,
            rotateX: 45
        },
        unfolding: {
            scaleY: [0.1, 0.5, 1],
            scaleX: [0.8, 0.9, 1],
            opacity: [0, 1, 1],
            y: [100, 0, 0],
            rotateX: [45, -10, 0],
            transition: {
                duration: 1.2, // Swifter duration
                ease: "easeOut",
                times: [0, 0.4, 1]
            }
        },
        reading: {
            scaleY: 1,
            scaleX: 1,
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { duration: 0.5 }
        },
        exit: {
            scaleY: 0.1,
            scaleX: 0.8,
            opacity: 0,
            y: 100,
            rotateX: -45,
            transition: { duration: 0.8, ease: "easeIn" }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 30,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "4rem 1rem 8rem 1rem", // More bottom padding for scroll space
                overflowY: "auto",
                overflowX: "hidden",
                backgroundColor: "rgba(0, 31, 63, 0.8)", // Royal Blue Backdrop
                backdropFilter: "blur(12px)",
            }}
        >
            <motion.div
                variants={paperVariants}
                initial="hidden"
                animate={isOpening ? "unfolding" : "reading"}
                exit="exit"
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    height: "auto", // Grow with content
                    minHeight: "70vh",
                    backgroundColor: "#FFFAEC", // Richer Cream
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    borderRadius: "4px",
                    boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.2)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    transformOrigin: "top center", // Unfold from top
                    marginBottom: "4rem",
                }}
            >
                {/* Paper folds textures (subtle horizontal lines) */}
                {!showContent && (
                    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2 }}>
                        <div style={{ position: "absolute", top: "33%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.03)", boxShadow: "0 1px 2px rgba(255,255,255,0.5)" }} />
                        <div style={{ position: "absolute", top: "66%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.03)", boxShadow: "0 1px 2px rgba(255,255,255,0.5)" }} />
                    </div>
                )}

                <AnimatePresence>
                    {showContent && letterData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            style={{
                                padding: "clamp(2rem, 8vw, 4rem) clamp(1.5rem, 6vw, 3rem)",
                                display: "flex",
                                flexDirection: "column",
                                flex: 1,
                            }}
                        >
                            <h1 style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                                color: "var(--color-text-on-cream)",
                                marginBottom: "2rem"
                            }}>
                                Dear {letterData.recipient_name},
                            </h1>

                            <div
                                style={{
                                    fontFamily: "var(--font-serif)",
                                    fontSize: "clamp(1rem, 4vw, 1.2rem)",
                                    lineHeight: 1.8,
                                    color: "var(--color-text-on-cream)",
                                    whiteSpace: "pre-wrap",
                                    marginBottom: "3rem"
                                }}
                            >
                                {letterData.letter_content}
                            </div>

                            {/* Secret Gallery Crack */}
                            {letterData.gallery_enabled && (
                                <SecretCrack letterId={letterData.id} />
                            )}

                            <hr style={{ border: "none", borderTop: "1px dashed var(--color-gold-muted)", opacity: 0.3, margin: "4rem 0 2rem 0" }} />

                            <CommentSection letterId={letterData.id} />

                            <div style={{ marginTop: "4rem", textAlign: "center" }}>
                                <button
                                    onClick={onClose}
                                    style={{
                                        padding: "1rem 2.5rem",
                                        backgroundColor: "var(--color-royal-blue)",
                                        color: "var(--color-gold)",
                                        border: "1px solid var(--color-gold-muted)",
                                        borderRadius: "35px",
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "0.95rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        letterSpacing: "0.05em",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = "var(--color-royal-blue-light)";
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = "var(--color-royal-blue)";
                                        e.currentTarget.style.transform = "translateY(0)";
                                    }}
                                >
                                    Close Letter
                                </button>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </motion.div>
    );
}
