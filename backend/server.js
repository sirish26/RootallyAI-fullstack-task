const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors()).use(express.json());

mongoose.connect("mongodb+srv://root:root@exerciseprogram.iixeu.mongodb.net/exerciseDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const exerciseSchema = new mongoose.Schema({
    id: Number,
    name: String,
    exercises: [String]
});

const programSchema = new mongoose.Schema({
    name: String,
    sets: Number,
    reps: Number,
    holdTime: Number,
    weight: Number,
    side: String,
});

const Category = mongoose.model("Category", exerciseSchema);
const Program = mongoose.model("Program", programSchema);

const seedCategories = async () => {
    if (await Category.countDocuments() === 0) {
        await Category.insertMany([
            { id: 1, name: "Lower Body", exercises: ["Squats", "Lunges", "Deadlifts", "Leg Press"] },
            { id: 2, name: "Upper Body", exercises: ["Push-ups", "Pull-ups", "Bench Press", "Overhead Shoulder Press"] },
            { id: 3, name: "Core", exercises: ["Plank", "Sit-ups", "Russian Twists", "Side Plank"] }
        ]);
        console.log("Categories seeded!");
    }
};

app.get("/api/categories", async (req, res) => res.json(await Category.find()));

app.post("/api/saveCombo", async (req, res) => {
    await new Program(req.body).save();
    res.json({ message: "Combo saved" });
});

app.get("/api/programs", async (req, res) => {
    try {
        res.json(await Program.find({}, 'name'));
    } catch (error) {
        console.error("Error fetching programs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(5000, async () => {
    await seedCategories();
    console.log("Backend running on port 5000");
});