"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Comment {
    id: string;
    name: string;
    message: string;
    created_at: string;
}

export default function CommentSection({ letterId }: { letterId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        async function fetchComments() {
            const { data, error } = await supabase
                .from("comments")
                .select("*")
                .eq("letter_id", letterId)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setComments(data);
            }
            setFetching(false);
        }

        fetchComments();
    }, [letterId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setLoading(true);

        const newComment = {
            letter_id: letterId,
            name: name.trim(),
            message: message.trim()
        };

        const { data, error } = await supabase
            .from("comments")
            .insert([newComment])
            .select();

        if (!error && data) {
            setComments([...comments, data[0]]);
            setName("");
            setMessage("");
        }

        setLoading(false);
    };

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.4rem",
                color: "var(--color-text-main)",
                marginBottom: "2rem"
            }}>
                Leave a Reply
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(100, 95, 90, 0.2)",
                        borderRadius: "6px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.95rem",
                        color: "var(--color-text-main)",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-gold-muted)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(100, 95, 90, 0.2)"}
                />
                <textarea
                    placeholder="Your Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    style={{
                        padding: "1rem",
                        backgroundColor: "transparent",
                        border: "1px solid rgba(100, 95, 90, 0.2)",
                        borderRadius: "6px",
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.95rem",
                        color: "var(--color-text-main)",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--color-gold-muted)"}
                    onBlur={(e) => e.target.style.borderColor = "rgba(100, 95, 90, 0.2)"}
                />

                <button
                    type="submit"
                    disabled={loading || !name.trim() || !message.trim()}
                    style={{
                        padding: "1rem",
                        backgroundColor: "var(--color-royal-blue)",
                        color: "var(--color-gold)",
                        border: "1px solid var(--color-gold-muted)",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        cursor: loading ? "not-allowed" : "pointer",
                        opacity: loading || !name.trim() || !message.trim() ? 0.6 : 1,
                        transition: "all 0.3s ease",
                        alignSelf: "flex-start",
                        paddingInline: "2rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                >
                    {loading ? "Sending..." : "Send Reply"}
                </button>
            </form>

            <div style={{ marginTop: "4rem" }}>
                {!fetching && comments.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <AnimatePresence>
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        padding: "1.5rem",
                                        backgroundColor: "rgba(255,255,255,0.4)",
                                        borderRadius: "8px",
                                        border: "1px solid rgba(100, 95, 90, 0.1)",
                                    }}
                                >
                                    <div style={{
                                        fontFamily: "var(--font-serif)",
                                        fontWeight: "bold",
                                        marginBottom: "0.5rem",
                                        color: "var(--color-text-main)"
                                    }}>
                                        {comment.name}
                                    </div>
                                    <div style={{
                                        fontFamily: "var(--font-sans)",
                                        fontSize: "0.9rem",
                                        color: "var(--color-text-muted)",
                                        lineHeight: 1.6,
                                        whiteSpace: "pre-wrap"
                                    }}>
                                        {comment.message}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
