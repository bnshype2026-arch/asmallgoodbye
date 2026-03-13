"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X, Upload, Trash2 } from "lucide-react";

interface LetterFormProps {
    initialData?: any;
    onSave: () => void;
    onCancel: () => void;
}

export default function LetterForm({ initialData, onSave, onCancel }: LetterFormProps) {
    const [formData, setFormData] = useState({
        recipient_name: initialData?.recipient_name || "",
        code: initialData?.code || "",
        letter_content: initialData?.letter_content || "",
        gallery_enabled: initialData?.gallery_enabled || false,
    });

    const [photos, setPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const isEditing = !!initialData;

    useEffect(() => {
        if (isEditing && formData.gallery_enabled) {
            loadPhotos();
        }
    }, [isEditing]);

    const loadPhotos = async () => {
        const { data } = await supabase
            .from("letter_photos")
            .select("*")
            .eq("letter_id", initialData.id)
            .order("created_at", { ascending: true });
        if (data) setPhotos(data);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditing) {
                const { error: updateError } = await supabase
                    .from("letters")
                    .update(formData)
                    .eq("id", initialData.id);

                if (updateError) throw updateError;
            } else {
                const { data, error: insertError } = await supabase
                    .from("letters")
                    .insert([formData])
                    .select()
                    .single();

                if (insertError) throw insertError;

                // If gallery is enabled on creation, maybe notify they need to edit to add photos
                // but simplest is just save form.
            }
            onSave();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        if (!isEditing) {
            alert("Please save the letter first before uploading photos.");
            return;
        }

        setUploading(true);
        try {
            for (const file of Array.from(e.target.files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${initialData.id}/${Math.random()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("letter-memories")
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from("letter-memories").getPublicUrl(fileName);

                await supabase.from("letter_photos").insert([{
                    letter_id: initialData.id,
                    photo_url: data.publicUrl
                }]);
            }
            await loadPhotos();
        } catch (error: any) {
            alert("Upload failed: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (photoId: string, url: string) => {
        if (!confirm("Delete this photo?")) return;

        // Extract file path from URL
        const urlParts = url.split("/");
        const fileName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;

        await supabase.storage.from("letter-memories").remove([fileName]);
        await supabase.from("letter_photos").delete().eq("id", photoId);

        setPhotos(photos.filter(p => p.id !== photoId));
    };

    const handleUpdateCaption = async (photoId: string, caption: string) => {
        await supabase.from("letter_photos").update({ caption }).eq("id", photoId);
        setPhotos(photos.map(p => p.id === photoId ? { ...p, caption } : p));
    };

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "2rem"
        }}>
            <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                width: "100%",
                maxWidth: "800px",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
            }}>
                <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", margin: 0 }}>{isEditing ? "Edit Letter" : "Create New Letter"}</h2>
                    <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer" }}><X /></button>
                </div>

                <div style={{ padding: "2rem", overflowY: "auto", flex: 1 }}>
                    <form id="letter-form" onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Recipient Name</label>
                                <input
                                    required
                                    value={formData.recipient_name}
                                    onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                                    style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                />
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Unique Letter Code</label>
                                <input
                                    required
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc" }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <label style={{ fontWeight: 500, fontSize: "0.9rem" }}>Letter Content</label>
                            <textarea
                                required
                                rows={10}
                                value={formData.letter_content}
                                onChange={(e) => setFormData({ ...formData, letter_content: e.target.value })}
                                style={{ padding: "0.75rem", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
                            <input
                                type="checkbox"
                                id="gallery_toggle"
                                checked={formData.gallery_enabled}
                                onChange={(e) => setFormData({ ...formData, gallery_enabled: e.target.checked })}
                                style={{ width: "18px", height: "18px" }}
                            />
                            <label htmlFor="gallery_toggle" style={{ fontWeight: 500 }}>Enable Secret Memory Gallery</label>
                        </div>

                        {isEditing && formData.gallery_enabled && (
                            <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f9f9f9", borderRadius: "8px", border: "1px dashed #ccc" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                    <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Gallery Photos</h3>
                                    <label style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.5rem",
                                        padding: "0.5rem 1rem",
                                        backgroundColor: "white",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                        fontSize: "0.9rem"
                                    }}>
                                        <Upload size={16} />
                                        {uploading ? "Uploading..." : "Upload Photos"}
                                        <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} disabled={uploading} />
                                    </label>
                                </div>

                                {photos.length === 0 ? (
                                    <p style={{ color: "#888", textAlign: "center", margin: "2rem 0" }}>No photos uploaded yet.</p>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                        {photos.map(photo => (
                                            <div key={photo.id} style={{ display: "flex", gap: "1rem", backgroundColor: "white", padding: "0.5rem", borderRadius: "4px", border: "1px solid #eee" }}>
                                                <img src={photo.photo_url} alt="Memory" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
                                                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                                    <input
                                                        placeholder="Add an optional caption..."
                                                        defaultValue={photo.caption || ""}
                                                        onBlur={(e) => handleUpdateCaption(photo.id, e.target.value)}
                                                        style={{ padding: "0.5rem", border: "none", borderBottom: "1px solid #ccc", outline: "none", fontSize: "0.85rem", width: "100%" }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePhoto(photo.id, photo.photo_url)}
                                                        style={{ alignSelf: "flex-end", color: "red", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem", marginTop: "auto" }}
                                                    >
                                                        <Trash2 size={14} /> Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {!isEditing && formData.gallery_enabled && (
                            <p style={{ color: "#888", fontSize: "0.9rem", fontStyle: "italic" }}>Save the letter first to start uploading photos to the gallery.</p>
                        )}

                        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
                    </form>
                </div>

                <div style={{ padding: "1.5rem 2rem", borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", gap: "1rem", backgroundColor: "#FFFAEC" }}>
                    <button onClick={onCancel} style={{ padding: "0.75rem 1.5rem", backgroundColor: "white", border: "1px solid #ccc", borderRadius: "8px", cursor: "pointer", color: "var(--color-text-on-cream)" }}>
                        Cancel
                    </button>
                    <button form="letter-form" type="submit" disabled={loading} style={{
                        padding: "0.75rem 2rem",
                        backgroundColor: "var(--color-royal-blue)",
                        color: "var(--color-gold)",
                        border: "1px solid var(--color-gold-muted)",
                        borderRadius: "8px",
                        cursor: loading ? "wait" : "pointer",
                        fontWeight: 600
                    }}>
                        {loading ? "Saving..." : "Save Letter"}
                    </button>
                </div>
            </div>
        </div>
    );
}
