"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Photo {
    id: string;
    photo_url: string;
    caption?: string;
}

export default function MemoryGallery({ letterId }: { letterId: string }) {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchPhotos() {
            const { data, error } = await supabase
                .from("letter_photos")
                .select("*")
                .eq("letter_id", letterId)
                .order("created_at", { ascending: true });

            if (!error && data) {
                setPhotos(data);
            }
        }
        fetchPhotos();
    }, [letterId]);

    if (photos.length === 0) return null;

    return (
        <div style={{ marginTop: "3rem", padding: "0 1rem" }}>
            <h3 style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.2rem",
                color: "var(--color-gold-muted)",
                textAlign: "center",
                marginBottom: "2rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase"
            }}>
                Captured Memories
            </h3>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "2rem",
                padding: "1rem"
            }}>
                {photos.map((photo, index) => {
                    // Random rotation for the polaroid feel
                    const rotation = (index % 3 === 0) ? -3 : (index % 3 === 1) ? 2 : -1;

                    return (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, scale: 0.9, rotate: rotation - 5 }}
                            animate={{ opacity: 1, scale: 1, rotate: rotation }}
                            transition={{ duration: 1, delay: index * 0.15, ease: "easeOut" }}
                            whileHover={{ y: -10, rotate: 0, scale: 1.05, zIndex: 10 }}
                            onClick={() => setSelectedPhotoIndex(index)}
                            style={{
                                width: "clamp(140px, 40vw, 180px)",
                                backgroundColor: "white",
                                padding: "10px 10px 30px 10px",
                                border: "1px solid rgba(0,0,0,0.05)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                cursor: "pointer",
                                position: "relative",
                            }}
                        >
                            <div style={{
                                width: "100%",
                                aspectRatio: "1",
                                overflow: "hidden",
                                backgroundColor: "#eee",
                                marginBottom: "10px"
                            }}>
                                <img
                                    src={photo.photo_url}
                                    alt={photo.caption || "Memory"}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>

                            {photo.caption && (
                                <p style={{
                                    fontFamily: "var(--font-serif)",
                                    fontSize: "0.75rem",
                                    color: "var(--color-text-on-cream)",
                                    textAlign: "center",
                                    margin: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    opacity: 0.7
                                }}>
                                    {photo.caption}
                                </p>
                            )}

                            {/* Subtle glossy overlay */}
                            <div style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
                                pointerEvents: "none"
                            }} />
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedPhotoIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedPhotoIndex(null)}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 3000, // Above particles
                            backgroundColor: "rgba(0, 31, 63, 0.95)", // Royal Backdrop
                            backdropFilter: "blur(15px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "zoom-out"
                        }}
                    >
                        <button
                            onClick={() => setSelectedPhotoIndex(null)}
                            style={{
                                position: "absolute",
                                top: "2rem",
                                right: "2rem",
                                background: "rgba(255,255,255,0.1)",
                                border: "1px solid rgba(255,255,255,0.2)",
                                borderRadius: "50%",
                                color: "white",
                                cursor: "pointer",
                                padding: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {photos.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
                                    }}
                                    style={{
                                        position: "absolute",
                                        left: "2rem",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        padding: "20px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ChevronLeft size={32} />
                                </button>
                            )}

                            <motion.div
                                key={selectedPhotoIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    maxWidth: "90vw",
                                    maxHeight: "80vh",
                                    backgroundColor: "white",
                                    padding: "20px 20px 60px 20px",
                                    boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                                    position: "relative",
                                    cursor: "default"
                                }}
                            >
                                <img
                                    src={photos[selectedPhotoIndex].photo_url}
                                    alt={photos[selectedPhotoIndex].caption || "Memory"}
                                    style={{
                                        maxWidth: "100%",
                                        maxHeight: "65vh",
                                        objectFit: "contain",
                                        display: "block"
                                    }}
                                />

                                {photos[selectedPhotoIndex].caption && (
                                    <p style={{
                                        position: "absolute",
                                        bottom: "1.5rem",
                                        left: "20px",
                                        right: "20px",
                                        textAlign: "center",
                                        fontFamily: "var(--font-serif)",
                                        fontSize: "1.2rem",
                                        color: "#333",
                                        margin: 0,
                                        fontStyle: "italic"
                                    }}>
                                        {photos[selectedPhotoIndex].caption}
                                    </p>
                                )}
                            </motion.div>

                            {photos.length > 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
                                    }}
                                    style={{
                                        position: "absolute",
                                        right: "2rem",
                                        background: "rgba(255,255,255,0.05)",
                                        border: "none",
                                        color: "white",
                                        cursor: "pointer",
                                        padding: "20px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ChevronRight size={32} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
