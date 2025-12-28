const express = require('express');
const app = express();
const cors = require('cors');
const Note = require("./model/notemodel"); 
const { databaseConnect } = require("./note/noteconfig");

app.use(express.json());
app.use(cors());

databaseConnect(); //

app.post('/api/notes', async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Please fill all fields" });
        }
        const response = await Note.create({ title, content });
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ message: "Error saving note" });
    }
});

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ message: "Error fetching notes" });
    }
});

app.patch("/api/notes/:id", async (req, res) => {
    try {
        const updated = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating note" });
    }
});

app.delete("/api/notes/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting note" });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}.`); //
});