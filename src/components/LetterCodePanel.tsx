"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface LetterCodePanelProps {
    onSuccess: (letterData: any) => void;
    onCancel: () => void;
}

export default function LetterCodePanel({ onSuccess, onCancel }: LetterCodePanelProps) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("letters")
                .select("*")
                .eq("code", code.trim())
                .single();

            if (error || !data) {
                setError("This letter code does not exist.");
            } else {
                onSuccess(data);
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100, // Ensure it's above everything
                padding: "20px",
                backgroundColor: "rgba(0, 0, 0, 0.4)", // Darken the background
                backdropFilter: "blur(8px)", // Blur for focus
                WebkitBackdropFilter: "blur(8px)", // Safari support
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    backgroundColor: "var(--color-warm-white)",
                    padding: "clamp(2rem, 8vw, 3rem) 2rem",
                    borderRadius: "var(--border-radius-soft)",
                    boxShadow: "0 30px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* Texture for the panel */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.05,
                        pointerEvents: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        borderRadius: "inherit",
                        mixBlendMode: "multiply",
                    }}
                />

                {/* Decorative Border */}
                <div
                    style={{
                        position: "absolute",
                        inset: "12px",
                        border: "1px solid var(--color-gold-muted)",
                        opacity: 0.4,
                        pointerEvents: "none",
                        borderRadius: "8px",
                    }}
                />

                <h2 style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.6rem",
                    color: "var(--color-royal-blue)",
                    marginBottom: "2rem",
                    textAlign: "center",
                    position: "relative",
                    letterSpacing: "0.02em"
                }}>
                    Enter your Letter Code
                </h2>

                <form onSubmit={handleSubmit} style={{ width: "100%", position: "relative" }}>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="[ Enter Code ]"
                        style={{
                            width: "100%",
                            padding: "1.2rem",
                            fontSize: "1.1rem",
                            textAlign: "center",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            border: "2px solid var(--color-gold-muted)",
                            borderRadius: "8px",
                            color: "var(--color-royal-blue)",
                            marginBottom: "1rem",
                            transition: "all 0.3s ease",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "var(--color-gold)";
                            e.target.style.backgroundColor = "white";
                            e.target.style.boxShadow = "0 0 15px rgba(212,175,55,0.2)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "var(--color-gold-muted)";
                            e.target.style.backgroundColor = "rgba(255,255,255,0.8)";
                            e.target.style.boxShadow = "none";
                        }}
                        disabled={loading}
                    />

                    <div style={{ minHeight: "24px", marginBottom: "1.5rem", textAlign: "center" }}>
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    style={{ color: "var(--color-royal-red)", fontSize: "0.9rem", fontWeight: 600, margin: 0 }}
                                >
                                    {error}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !code.trim()}
                        style={{
                            width: "100%",
                            padding: "1.1rem",
                            backgroundColor: "var(--color-royal-blue)",
                            color: "var(--color-gold)",
                            border: "1px solid var(--color-gold)",
                            borderRadius: "8px",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            cursor: loading || !code.trim() ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            opacity: loading || !code.trim() ? 0.7 : 1,
                            boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
                        }}
                        onMouseEnter={(e) => {
                            if (!loading && code.trim()) {
                                e.currentTarget.style.backgroundColor = "var(--color-royal-blue-light)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading && code.trim()) {
                                e.currentTarget.style.backgroundColor = "var(--color-royal-blue)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }
                        }}
                    >
                        {loading ? "Opening..." : "Open the Letter"}
                    </button>
                </form>

                <button
                    onClick={onCancel}
                    style={{
                        marginTop: "1.5rem",
                        background: "transparent",
                        border: "none",
                        color: "var(--color-royal-red)",
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        position: "relative",
                        zIndex: 2,
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-royal-red-dark)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-royal-red)")}
                >
                    Cancel
                </button>
            </motion.div>
        </motion.div>
    );
}
