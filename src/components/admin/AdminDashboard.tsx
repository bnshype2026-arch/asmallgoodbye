"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import LetterForm from "./LetterForm";
import RepliesModal from "./RepliesModal";

export default function AdminDashboard() {
    const [letters, setLetters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingLetter, setEditingLetter] = useState<any>(null);

    const [showRepliesFor, setShowRepliesFor] = useState<string | null>(null);

    useEffect(() => {
        fetchLetters();
    }, []);

    const fetchLetters = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("letters")
            .select(`
        *,
        comments (count)
      `)
            .order("created_at", { ascending: false });

        if (data) {
            setLetters(data);
        }
        setLoading(false);
    };

    const handleCreateNew = () => {
        setEditingLetter(null);
        setShowForm(true);
    };

    const handleEdit = (letter: any) => {
        setEditingLetter(letter);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this letter? This will also delete all associated comments and photos if DB is not set to Cascade.")) return;

        await supabase.from("letters").delete().eq("id", id);
        fetchLetters();
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#FFFAEC", // Richer Cream
            padding: "2rem",
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-on-cream)",
            position: "relative",
            zIndex: 100
        }}>
            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", padding: "0 1rem" }}>
                <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2.5rem", letterSpacing: "0.05em" }}>Vault</h1>
                <button
                    onClick={handleCreateNew}
                    style={{
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "var(--color-royal-blue)",
                        color: "var(--color-gold)",
                        border: "1px solid var(--color-gold-muted)",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "1rem",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}>
                    + Create New Letter
                </button>
            </header>

            {loading ? (
                <p style={{ textAlign: "center", marginTop: "4rem", color: "var(--color-text-muted)" }}>Loading records...</p>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
                        <thead style={{ backgroundColor: "#f9f9f9", borderBottom: "1px solid #ddd" }}>
                            <tr>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontWeight: "600", color: "black" }}>Recipient</th>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontWeight: "600", color: "black" }}>Code</th>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontWeight: "600", color: "black" }}>Created</th>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: "600", color: "black" }}>Replies</th>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "center", fontWeight: "600", color: "black" }}>Gallery</th>
                                <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontWeight: "600", color: "black" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {letters.map((letter) => (
                                <tr key={letter.id} style={{ borderBottom: "1px solid #f0f0f0", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fafafa"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                                    <td style={{ padding: "1.25rem 1.5rem", fontWeight: 500 }}>{letter.recipient_name}</td>
                                    <td style={{ padding: "1.25rem 1.5rem", fontFamily: "monospace", letterSpacing: "0.1em", color: "var(--color-gold-muted)", fontWeight: "bold" }}>{letter.code}</td>
                                    <td style={{ padding: "1.25rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                                        {new Date(letter.created_at).toLocaleDateString()}
                                    </td>
                                    <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                                        {letter.comments?.[0]?.count || 0}
                                        {(letter.comments?.[0]?.count || 0) > 0 && (
                                            <button onClick={() => setShowRepliesFor(letter.id)} style={{ display: "block", margin: "0.25rem auto 0", fontSize: "0.8rem", color: "blue", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>View</button>
                                        )}
                                    </td>
                                    <td style={{ padding: "1.25rem 1.5rem", textAlign: "center" }}>
                                        {letter.gallery_enabled ? <span style={{ color: "green", fontWeight: "bold" }}>Yes</span> : <span style={{ color: "#ccc" }}>No</span>}
                                    </td>
                                    <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                                        <button onClick={() => handleEdit(letter)} style={{ marginRight: "1.5rem", background: "none", border: "none", color: "blue", cursor: "pointer", textDecoration: "underline" }}>Edit</button>
                                        <button onClick={() => handleDelete(letter.id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", textDecoration: "underline" }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {letters.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: "4rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                                        No letters found. Create one to begin.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <LetterForm
                    initialData={editingLetter}
                    onSave={() => { setShowForm(false); fetchLetters(); }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {showRepliesFor && (
                <RepliesModal letterId={showRepliesFor} onClose={() => setShowRepliesFor(null)} />
            )}
        </div>
    );
}
