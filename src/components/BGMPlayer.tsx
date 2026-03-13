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

        // Listen for internal play command
        const handlePlayCommand = () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.log(e));
            }
        };

        window.addEventListener("play-bgm", handlePlayCommand);

        return () => {
            window.removeEventListener("play-bgm", handlePlayCommand);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [isPlaying]);

    const toggleMute = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch((e) => console.log("Audio play prevented:", e));
        }
        setIsPlaying(!isPlaying);
    };

    // Return null since we want the player to be invisible
    return null;
}
