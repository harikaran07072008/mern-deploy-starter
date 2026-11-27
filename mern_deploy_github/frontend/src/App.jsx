import { useEffect, useState } from "react";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3500").replace(/\/$/, "");

export default function App() {
    const [notes, setNotes] = useState([]);
    const [health, setHealth] = useState("checking...");
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");

    async function fetchNotes() {
        try {
            const [healthRes, notesRes] = await Promise.all([
                fetch(`${API_URL}/health`),
                fetch(`${API_URL}/api/notes`),
            ]);
            if (!healthRes.ok || !notesRes.ok) throw new Error("API request failed");
            const healthData = await healthRes.json();
            const notesData = await notesRes.json();
            setHealth(`${healthData.status} (${healthData.database})`);
            setNotes(notesData);
            setError("");
        } catch (err) {
            setHealth("offline");
            setError(`Cannot reach API at ${API_URL}: ${err.message}`);
        }
    }

    useEffect(() => {
        fetchNotes();
    }, []);

    async function handleAdd(e) {
        e.preventDefault();
        if (!title.trim() || !text.trim()) return;
        const res = await fetch(`${API_URL}/api/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, text }),
        });
        if (res.ok) {
            setTitle("");
            setText("");
            fetchNotes();
        }
    }

    async function handleToggle(note) {
        await fetch(`${API_URL}/api/notes/${note._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: !note.completed }),
        });
        fetchNotes();
    }

    async function handleDelete(id) {
        await fetch(`${API_URL}/api/notes/${id}`, { method: "DELETE" });
        fetchNotes();
    }

    return (
        <div className="page">
            <header className="header">
                <h1>MERN Deployment Starter</h1>
                <p className="badge">API: {health}</p>
            </header>

            <main className="container">
                {error && <p className="error">{error}</p>}

                <form className="card form" onSubmit={handleAdd}>
                    <h2>Add Note</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Details..."
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                    />
                    <button type="submit">Save Note</button>
                </form>

                <section className="card">
                    <h2>Notes ({notes.length})</h2>
                    <ul className="notes-list">
                        {notes.map((note) => (
                            <li key={note._id} className={note.completed ? "note done" : "note"}>
                                <div>
                                    <strong>{note.title}</strong>
                                    <p>{note.text}</p>
                                </div>
                                <div className="actions">
                                    <button type="button" onClick={() => handleToggle(note)}>
                                        {note.completed ? "Undo" : "Done"}
                                    </button>
                                    <button type="button" className="danger" onClick={() => handleDelete(note._id)}>
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
        </div>
    );
}
