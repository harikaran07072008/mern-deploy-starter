const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/Note");

const router = express.Router();

// In-memory fallback so local testing works before MongoDB Atlas is configured
const memoryNotes = [
    {
        _id: "demo-1",
        title: "Configure MongoDB Atlas",
        text: "Set DATABASE_URI in .env or Render Environment Variables.",
        completed: false,
    },
];

const usingMongo = () => mongoose.connection.readyState === 1;

router.get("/", async (req, res, next) => {
    try {
        const notes = usingMongo() ? await Note.find().sort({ createdAt: -1 }).lean() : memoryNotes;
        res.json(notes);
    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const { title, text } = req.body;
        if (!title?.trim() || !text?.trim()) {
            return res.status(400).json({ message: "Title and text are required." });
        }

        if (usingMongo()) {
            const created = await Note.create({ title: title.trim(), text: text.trim() });
            return res.status(201).json(created);
        }

        const note = {
            _id: `mem-${Date.now()}`,
            title: title.trim(),
            text: text.trim(),
            completed: false,
        };
        memoryNotes.unshift(note);
        return res.status(201).json(note);
    } catch (err) {
        next(err);
    }
});

router.patch("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        if (usingMongo()) {
            const note = await Note.findById(id);
            if (!note) return res.status(404).json({ message: "Note not found" });
            if (typeof req.body.completed === "boolean") note.completed = req.body.completed;
            if (req.body.title) note.title = req.body.title.trim();
            if (req.body.text) note.text = req.body.text.trim();
            const updated = await note.save();
            return res.json(updated);
        }

        const item = memoryNotes.find((n) => n._id === id);
        if (!item) return res.status(404).json({ message: "Note not found" });
        if (typeof req.body.completed === "boolean") item.completed = req.body.completed;
        if (req.body.title) item.title = req.body.title.trim();
        if (req.body.text) item.text = req.body.text.trim();
        return res.json(item);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        if (usingMongo()) {
            const deleted = await Note.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ message: "Note not found" });
            return res.json({ message: "Note deleted", id });
        }

        const idx = memoryNotes.findIndex((n) => n._id === id);
        if (idx === -1) return res.status(404).json({ message: "Note not found" });
        memoryNotes.splice(idx, 1);
        return res.json({ message: "Note deleted", id });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
