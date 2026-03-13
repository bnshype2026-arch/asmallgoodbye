"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

export default function BGMPlayer() {
    const [isPlaying, setIsPlaying] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // We use a query param to bypass cache if updated
        audioRef.current = new Audio("/audio/piano-loop.mp3?v=1.1");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

        // Attempt to play immediately
        audioRef.current.play().catch((e) => {
            console.log("Autoplay blocked, waiting for interaction:", e);
            setIsPlaying(false); // Revert to false if blocked
        });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <motion.button
            onClick={toggleMute}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 2 }}
            style={{
                position: "fixed",
                bottom: "24px",
                left: "24px",
                zIndex: 50,
                background: "rgba(0,0,0,0.3)",
                border: "1px solid var(--color-gold-muted)",
                color: "var(--color-gold)",
                cursor: "pointer",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                transition: "all 0.3s ease",
                backdropFilter: "blur(4px)",
            }}
            aria-label="Toggle background music"
            onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-gold)";
                e.currentTarget.style.borderColor = "var(--color-gold)";
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-gold)";
                e.currentTarget.style.borderColor = "var(--color-gold-muted)";
                e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.3)";
            }}
        >
            {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </motion.button>
    );
}
