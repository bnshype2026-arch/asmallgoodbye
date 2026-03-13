"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EnvelopeScene from "@/components/EnvelopeScene";
import LetterCodePanel from "@/components/LetterCodePanel";
import LetterView from "@/components/LetterView";

export default function Home() {
  const [sceneState, setSceneState] = useState<"floating" | "code_input" | "opening" | "reading">("floating");
  const [letterData, setLetterData] = useState<any>(null);

  const handleEnvelopeClick = () => {
    setSceneState("code_input");
  };

  const handleCodeSuccess = (data: any) => {
    setLetterData(data);
    setSceneState("opening");

    // Auto-transition to reading after opening animation
    setTimeout(() => {
      setSceneState("reading");
    }, 4000); // 4 seconds for the unfolding animation
  };

  const handleClose = () => {
    // Reverse animation could be complex, for now we will just transition back to floating
    setSceneState("floating");
    setLetterData(null);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>

      {/* Intro Text & Envelope Scene */}
      <AnimatePresence>
        {(sceneState === "floating" || sceneState === "code_input") && (
          <motion.div
            key="intro-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: sceneState === "floating" ? 1 : 0, y: sceneState === "floating" ? 0 : -20 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.5rem",
                fontWeight: 500,
                color: "var(--color-text-main)",
                marginBottom: "5rem",
                textAlign: "center",
                lineHeight: 1.3,
                textShadow: "0 4px 12px rgba(212,175,55,0.15), 0 1px 3px rgba(0,0,0,0.1)",
                padding: "0 2rem",
                maxWidth: "600px"
              }}
            >
              Before I leave today,
              <br />
              <span style={{ fontSize: "1.8rem", color: "var(--color-gold-muted)", fontStyle: "italic", fontWeight: 400 }}>I left something for you.</span>
            </motion.p>

            <EnvelopeScene
              isZoomed={sceneState === "code_input"}
              onClick={sceneState === "floating" ? handleEnvelopeClick : undefined}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: sceneState === "floating" ? [0.4, 0.8, 0.4] : 0
              }}
              transition={{
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                delay: 1.5
              }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginTop: "4rem",
              }}
            >
              Tap the envelope to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Input Panel */}
      <AnimatePresence>
        {sceneState === "code_input" && (
          <LetterCodePanel
            key="code-panel"
            onSuccess={handleCodeSuccess}
            onCancel={() => setSceneState("floating")}
          />
        )}
      </AnimatePresence>

      {/* Letter View (Opening & Reading) */}
      <AnimatePresence>
        {(sceneState === "opening" || sceneState === "reading") && (
          <LetterView
            key="letter-view"
            letterData={letterData}
            isOpening={sceneState === "opening"}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

    </main>
  );
}
