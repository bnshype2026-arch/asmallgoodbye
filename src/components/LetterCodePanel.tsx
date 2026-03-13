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
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 150,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "calc(100% - 40px)",
                    maxWidth: "400px",
                    backgroundColor: "white",
                    padding: "3rem 2rem",
                    borderRadius: "16px",
                    boxShadow: "0 50px 100px rgba(0,0,0,0.6)",
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
                        opacity: 0.03,
                        pointerEvents: "none",
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        borderRadius: "inherit",
                    }}
                />

                {/* Decorative Border */}
                <div
                    style={{
                        position: "absolute",
                        inset: "12px",
                        border: "1px solid var(--color-gold-muted)",
                        opacity: 0.3,
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
                        autoComplete="off"
                        style={{
                            width: "100%",
                            padding: "1.2rem",
                            fontSize: "1.2rem",
                            textAlign: "center",
                            backgroundColor: "#fff",
                            border: "2px solid var(--color-gold-muted)",
                            borderRadius: "8px",
                            color: "var(--color-royal-blue)",
                            marginBottom: "1rem",
                            transition: "all 0.3s ease",
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                        }}
                    />

                    <div style={{ minHeight: "24px", marginBottom: "1.5rem", textAlign: "center" }}>
                        <AnimatePresence>
                            {error && (
                                <motion.p
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
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
                            padding: "1.2rem",
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
                    >
                        {loading ? "Verifying..." : "View Your Letter"}
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
                        textDecoration: "underline",
                        textUnderlineOffset: "4px",
                    }}
                >
                    Return Back
                </button>
            </motion.div>
        </div>
    );
}
